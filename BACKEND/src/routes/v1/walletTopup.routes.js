import express from 'express';
import { createTopupOrder, verifyTopup } from '../../controllers/walletTopup.controller.js';
import { authenticate } from '../../middlewares/authMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { walletTopupSchema, walletTopupVerifySchema } from '../../validators/walletTopup.validator.js';

const router = express.Router();
router.use(authenticate);

router.post('/', validateRequest(walletTopupSchema), createTopupOrder);
router.post('/verify', validateRequest(walletTopupVerifySchema), verifyTopup);

export default router;
