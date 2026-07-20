import Message from '../models/message.model.js';

class MessageRepository {
  async create(messageData) {
    return Message.create(messageData);
  }

  async findConversation(conversationId, options = {}) {
    return Message.find({ conversationId })
      .skip(options.skip || 0)
      .limit(options.limit || 50)
      .sort(options.sort || { createdAt: 1 });
  }

  async findRecentForUser(userId, options = {}) {
    return Message.find({ $or: [{ sender: userId }, { receiver: userId }] })
      .skip(options.skip || 0)
      .limit(options.limit || 50)
      .sort(options.sort || { createdAt: -1 });
  }

  async markRead(messageId) {
    return Message.findByIdAndUpdate(messageId, { isRead: true }, { new: true });
  }
}

export default new MessageRepository();
