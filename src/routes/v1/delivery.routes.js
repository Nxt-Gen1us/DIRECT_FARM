import express from 'express';
import {
  getDeliveryTracking,
  updateDeliveryTracking,
  addDeliveryEvent
} from '../../controllers/deliveryTracking.controller.js';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { deliveryEventSchema, deliveryUpdateSchema } from '../../validators/delivery.validator.js';

const router = express.Router();
router.use(authenticate);

router.get('/:orderId', getDeliveryTracking);
router.patch('/:orderId', authorize('farmer', 'admin'), validateRequest(deliveryUpdateSchema), updateDeliveryTracking);
router.post('/:orderId/events', authorize('farmer', 'admin'), validateRequest(deliveryEventSchema), addDeliveryEvent);

export default router;
