import Notification from '../models/notification.model.js';

class NotificationRepository {
  async create(notificationData) {
    return Notification.create(notificationData);
  }

  async findByUser(userId, options = {}) {
    return Notification.find({ user: userId })
      .skip(options.skip || 0)
      .limit(options.limit || 50)
      .sort(options.sort || { createdAt: -1 });
  }

  async markRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { readAt: new Date() },
      { new: true }
    );
  }

  async markAllRead(userId) {
    return Notification.updateMany({ user: userId, readAt: null }, { readAt: new Date() });
  }
}

export default new NotificationRepository();
