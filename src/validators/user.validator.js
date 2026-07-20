import Joi from 'joi';

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});

export const updateSettingsSchema = Joi.object({
  notifications: Joi.boolean().optional(),
  newsletter: Joi.boolean().optional()
});
