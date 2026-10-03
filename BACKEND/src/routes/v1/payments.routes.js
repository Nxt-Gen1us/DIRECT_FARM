import express from 'express';
import {
  createPayment,
  getUserPayments,
  getOrderPayment,
  createRazorpayOrder,
  verifyRazorpayPayment
} from '../../controllers/payment.controller.js';
import { authenticate } from '../../middlewares/authMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { createPaymentSchema } from '../../validators/payment.validator.js';
import Joi from 'joi';

const router = express.Router();

router.use(authenticate);
const razorpayOrderSchema = Joi.object({ orderId: Joi.string().required() });
const razorpayVerifySchema = Joi.object({
  orderId: Joi.string().required(),
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required()
});

router.post('/razorpay/create-order', validateRequest(razorpayOrderSchema), createRazorpayOrder);
router.post('/razorpay/verify', validateRequest(razorpayVerifySchema), verifyRazorpayPayment);
router.post('/', validateRequest(createPaymentSchema), createPayment);
router.get('/', getUserPayments);
router.get('/order/:orderId', getOrderPayment);

export default router;
