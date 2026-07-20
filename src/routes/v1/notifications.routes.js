import express from 'express';
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../../controllers/notification.controller.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticate);

router.get('/', listNotifications);
router.patch('/:notificationId/read', markNotificationRead);
router.patch('/read-all', markAllNotificationsRead);

export default router;
