import Joi from 'joi';

export const createOrderSchema = Joi.object({
  farmer: Joi.string().required(),
  items: Joi.array().items(Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    price: Joi.number().required()
  })).min(1).required(),
  subtotal: Joi.number().required(),
  shippingFee: Joi.number().default(0),
  tax: Joi.number().default(0),
  total: Joi.number().required(),
  deliveryAddress: Joi.object({
    label: Joi.string().optional(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    postalCode: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});

export const updateOrderSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned').optional(),
  trackingNumber: Joi.string().optional(),
  courier: Joi.string().optional(),
  estimatedDelivery: Joi.date().optional()
});
