import Joi from 'joi';

export const sendMessageSchema = Joi.object({
  conversationId: Joi.string().required(),
  receiver: Joi.string().required(),
  content: Joi.string().required(),
  attachments: Joi.array().items(Joi.string().uri()).optional()
});
