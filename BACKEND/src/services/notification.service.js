import notificationRepository from '../repositories/notification.repository.js';

class NotificationService {
  async createNotification(payload) {
    return notificationRepository.create(payload);
  }

  async getUserNotifications(userId, options) {
    return notificationRepository.findByUser(userId, options);
  }

  async markRead(notificationId, userId) {
    const notification = await notificationRepository.markRead(notificationId, userId);
    if (!notification) {
      throw Object.assign(new Error('Notification not found'), { statusCode: 404 });
    }
    return notification;
  }

  async markAllRead(userId) {
    return notificationRepository.markAllRead(userId);
  }
}

export default new NotificationService();
