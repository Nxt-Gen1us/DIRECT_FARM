import Joi from 'joi';

export const createOrderSchema = Joi.object({
  farmer: Joi.string().optional().allow(''),
  items: Joi.array().items(Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    // price is accepted from client but ALWAYS overridden server-side
    price: Joi.number().optional()
  })).min(1).required(),
  // subtotal/total accepted as hints; recalculated server-side for security
  subtotal: Joi.number().optional(),
  shippingFee: Joi.number().default(0),
  tax: Joi.number().default(0),
  total: Joi.number().optional(),
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
