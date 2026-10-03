import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  quantityAvailable: Joi.number().integer().min(0).required(),
  images: Joi.array().items(Joi.object({ url: Joi.string().uri().required(), type: Joi.string().valid('image', 'video').default('image') })).optional(),
  video: Joi.object({ url: Joi.string().uri().required(), type: Joi.string().valid('image', 'video').default('video') }).optional(),
  shelfLifeDays: Joi.number().integer().optional(),
  packaging: Joi.string().optional(),
  harvestDate: Joi.date().optional(),
  freshnessScore: Joi.number().min(0).max(100).optional(),
  isOrganic: Joi.boolean().optional(),
  variety: Joi.string().optional(),
  unit: Joi.string().optional(),
  minQty: Joi.number().integer().min(1).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  origin: Joi.string().optional(),
  passportId: Joi.string().optional()
});

export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  category: Joi.string().optional(),
  price: Joi.number().optional(),
  quantityAvailable: Joi.number().integer().min(0).optional(),
  images: Joi.array().items(Joi.object({ url: Joi.string().uri().required(), type: Joi.string().valid('image', 'video').default('image') })).optional(),
  video: Joi.object({ url: Joi.string().uri().required(), type: Joi.string().valid('image', 'video').default('video') }).optional(),
  shelfLifeDays: Joi.number().integer().optional(),
  packaging: Joi.string().optional(),
  harvestDate: Joi.date().optional(),
  freshnessScore: Joi.number().min(0).max(100).optional(),
  isOrganic: Joi.boolean().optional(),
  variety: Joi.string().optional(),
  unit: Joi.string().optional(),
  minQty: Joi.number().integer().min(1).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  origin: Joi.string().optional(),
  passportId: Joi.string().optional()
});
