import notificationRepository from '../repositories/notification.repository.js';

class NotificationService {
  async createNotification(payload) {
    return notificationRepository.create(payload);
  }

  async getUserNotifications(userId, options) {
    return notificationRepository.findByUser(userId, options);
  }

  async markRead(notificationId) {
    return notificationRepository.markRead(notificationId);
  }

  async markAllRead(userId) {
    return notificationRepository.markAllRead(userId);
  }
}

export default new NotificationService();
