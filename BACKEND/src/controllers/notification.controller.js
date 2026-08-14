import notificationService from '../services/notification.service.js';

export const listNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id, req.query);
    res.status(200).json({ status: 'success', data: notifications });
  } catch (error) {
    next(error);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markRead(req.params.notificationId);
    res.status(200).json({ status: 'success', data: notification });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsRead = async (req, res, next) => {
  try {
    await notificationService.markAllRead(req.user.id);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};
