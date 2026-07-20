import Joi from 'joi';

export const walletTransactionSchema = Joi.object({
  type: Joi.string().valid('credit', 'debit').required(),
  amount: Joi.number().positive().required(),
  reference: Joi.string().optional(),
  description: Joi.string().optional()
});
