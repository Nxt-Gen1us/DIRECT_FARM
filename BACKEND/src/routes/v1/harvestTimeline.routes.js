import express from 'express';
import {
  createTimeline,
  getTimeline,
  getFarmerTimelines,
  getUpcomingHarvests,
  updateTimeline,
  addTimelineEvent,
  deleteTimeline,
} from '../../controllers/harvestTimeline.controller.js';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import {
  createTimelineSchema,
  updateTimelineSchema,
  addEventSchema,
} from '../../validators/harvestTimeline.validator.js';

const router = express.Router();

// Public routes for viewing upcoming harvests
router.get('/upcoming', getUpcomingHarvests);
router.get('/farmer/:farmerId', getFarmerTimelines);
router.get('/:id', getTimeline);

// Protected routes for farmers and admins
router.use(authenticate);
router.post('/', authorize('farmer', 'admin'), validateRequest(createTimelineSchema), createTimeline);
router.patch('/:id', authorize('farmer', 'admin'), validateRequest(updateTimelineSchema), updateTimeline);
router.post('/:id/events', authorize('farmer', 'admin'), validateRequest(addEventSchema), addTimelineEvent);
router.delete('/:id', authorize('farmer', 'admin'), deleteTimeline);

export default router;
