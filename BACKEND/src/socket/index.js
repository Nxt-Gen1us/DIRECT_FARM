import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/message.model.js';
import config from '../config/index.js';

const conversationIdFor = (firstUserId, secondUserId) => [firstUserId, secondUserId].sort().join(':');

export default function attachSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error('Authentication required'));
      const decoded = jwt.verify(token, config.jwtSecret);
      socket.data.userId = decoded.userId;
      socket.data.role = decoded.role;
      return next();
    } catch {
      return next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    const userRole = socket.data.role;
    socket.join(`user:${userId}`);

    // ── Chat Events ─────────────────────────────────────────────────────────

    socket.on('thread:join', ({ threadId } = {}) => {
      if (typeof threadId === 'string' && threadId.split(':').includes(userId)) {
        socket.join(`conversation:${threadId}`);
      }
    });

    socket.on('thread:leave', ({ threadId } = {}) => {
      if (typeof threadId === 'string') socket.leave(`conversation:${threadId}`);
    });

    socket.on('typing:start', ({ threadId } = {}) => {
      if (typeof threadId === 'string' && threadId.split(':').includes(userId)) {
        socket.to(`conversation:${threadId}`).emit('typing', { threadId, from: userId, typing: true });
      }
    });
    
    socket.on('typing:stop', ({ threadId } = {}) => {
      if (typeof threadId === 'string' && threadId.split(':').includes(userId)) {
        socket.to(`conversation:${threadId}`).emit('typing', { threadId, from: userId, typing: false });
      }
    });

    socket.on('message:send', async ({ localId, receiverId, threadId, text } = {}) => {
      try {
        const conversationId = conversationIdFor(userId, receiverId);
        if (!receiverId || receiverId === userId || threadId !== conversationId || !String(text || '').trim()) {
          throw new Error('Invalid message payload');
        }
        const message = await Message.create({
          conversationId,
          sender: userId,
          receiver: receiverId,
          content: String(text).trim()
        });
        socket.emit('message:ack', { localId, serverId: message.id, threadId: conversationId, status: 'sent' });
        io.to(`user:${receiverId}`).emit('message:new', {
          id: message.id,
          threadId: conversationId,
          senderId: userId,
          from: 'them',
          kind: 'text',
          text: message.content,
          at: message.createdAt.toISOString(),
          status: 'sent'
        });
      } catch {
        socket.emit('message:ack', { localId, serverId: localId, threadId, status: 'failed' });
      }
    });

    // ── Delivery Tracking Events ─────────────────────────────────────────────

    socket.on('delivery:subscribe', ({ orderId } = {}) => {
      if (typeof orderId === 'string' && orderId) {
        // Join room for this specific order's delivery updates
        socket.join(`delivery:${orderId}`);
      }
    });

    socket.on('delivery:unsubscribe', ({ orderId } = {}) => {
      if (typeof orderId === 'string') {
        socket.leave(`delivery:${orderId}`);
      }
    });

    socket.on('delivery:gps', async ({ orderId, latitude, longitude, accuracy, timestamp } = {}) => {
      // Only farmers and admins can broadcast GPS updates
      if (userRole !== 'farmer' && userRole !== 'admin') return;
      
      if (!orderId || typeof latitude !== 'number' || typeof longitude !== 'number') return;

      // Broadcast GPS update to all subscribers of this order
      io.to(`delivery:${orderId}`).emit('delivery:location', {
        orderId,
        location: {
          latitude,
          longitude,
          accuracy: accuracy || null,
          timestamp: timestamp || new Date().toISOString()
        },
        updatedBy: userId
      });
    });

    socket.on('delivery:status', async ({ orderId, status, location, message } = {}) => {
      // Only farmers and admins can update delivery status
      if (userRole !== 'farmer' && userRole !== 'admin') return;
      
      if (!orderId || !status) return;

      // Broadcast status update to all subscribers of this order
      io.to(`delivery:${orderId}`).emit('delivery:update', {
        orderId,
        status,
        location: location || null,
        message: message || null,
        timestamp: new Date().toISOString(),
        updatedBy: userId
      });
    });

    socket.on('disconnect', () => {
      // Cleanup happens automatically when socket disconnects
    });
  });

  return io;
}
