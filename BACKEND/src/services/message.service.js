import messageRepository from '../repositories/message.repository.js';

class MessageService {
  async sendMessage(payload) {
    return messageRepository.create(payload);
  }

  async getConversation(conversationId, options) {
    return messageRepository.findConversation(conversationId, options);
  }

  async getRecentMessages(userId, options) {
    return messageRepository.findRecentForUser(userId, options);
  }

  async markRead(messageId) {
    return messageRepository.markRead(messageId);
  }
}

export default new MessageService();
