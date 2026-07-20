import Joi from 'joi';

export const createPaymentSchema = Joi.object({
  order: Joi.string().required(),
  method: Joi.string().valid('razorpay', 'cod', 'wallet', 'escrow').required(),
  amount: Joi.number().required(),
  status: Joi.string().valid('pending', 'completed', 'failed', 'refunded').default('pending'),
  transactionId: Joi.string().optional(),
  providerResponse: Joi.object().optional()
});
