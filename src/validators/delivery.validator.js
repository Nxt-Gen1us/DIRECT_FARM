import Joi from 'joi';

export const deliveryUpdateSchema = Joi.object({
  courier: Joi.string().optional(),
  trackingNumber: Joi.string().optional(),
  estimatedDelivery: Joi.date().optional(),
  currentStatus: Joi.string().valid('pending', 'picked', 'in_transit', 'delivered', 'delayed', 'returned').optional()
});

export const deliveryEventSchema = Joi.object({
  status: Joi.string().valid('pending', 'picked', 'in_transit', 'delivered', 'delayed', 'returned').required(),
  location: Joi.string().optional(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
  recordedAt: Joi.date().optional()
});
