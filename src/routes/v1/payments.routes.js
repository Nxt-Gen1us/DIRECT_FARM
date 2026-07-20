import express from 'express';
import {
  createPayment,
  getUserPayments,
  getOrderPayment
} from '../../controllers/payment.controller.js';
import { authenticate } from '../../middlewares/authMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { createPaymentSchema } from '../../validators/payment.validator.js';

const router = express.Router();

router.use(authenticate);
router.post('/', validateRequest(createPaymentSchema), createPayment);
router.get('/', getUserPayments);
router.get('/order/:orderId', getOrderPayment);

export default router;
