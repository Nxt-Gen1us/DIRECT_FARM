import express from 'express';
import {
  sendMessage,
  getConversation,
  getRecentMessages,
  markMessageRead
} from '../../controllers/message.controller.js';
import { authenticate } from '../../middlewares/authMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { sendMessageSchema } from '../../validators/message.validator.js';

const router = express.Router();
router.use(authenticate);

router.post('/', validateRequest(sendMessageSchema), sendMessage);
router.get('/recent', getRecentMessages);
router.get('/conversation/:conversationId', getConversation);
router.patch('/:messageId/read', markMessageRead);

export default router;
