import Joi from 'joi';

export const walletTopupSchema = Joi.object({
  amount: Joi.number().positive().min(10).max(100000).required()
});

export const walletTopupVerifySchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required()
});
