import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import config from '../config/index.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Authentication required');
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      const error = new Error('Invalid authentication token');
      error.statusCode = 401;
      return next(error);
    }

    req.user = { id: user.id, role: user.role };
    next();
  } catch {
    const error = new Error('Invalid authentication token');
    error.statusCode = 401;
    next(error);
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    const error = new Error('Forbidden');
    error.statusCode = 403;
    return next(error);
  }
  next();
};
