import Joi from 'joi';

const eventSchema = Joi.object({
  eventType: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  occurredAt: Joi.date().iso(),
});

export const createTimelineSchema = Joi.object({
  farmerId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
  cropName: Joi.string().required(),
  plantedAt: Joi.date().iso(),
  expectedHarvestAt: Joi.date().iso(),
  events: Joi.array().items(eventSchema).default([]),
});

export const updateTimelineSchema = Joi.object({
  cropName: Joi.string(),
  plantedAt: Joi.date().iso(),
  expectedHarvestAt: Joi.date().iso(),
  events: Joi.array().items(eventSchema),
}).min(1);

export const addEventSchema = Joi.object({
  eventType: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  occurredAt: Joi.date().iso(),
});
