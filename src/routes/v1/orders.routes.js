import express from 'express';
import {
  createOrder,
  getOrder,
  listCustomerOrders,
  listFarmerOrders,
  updateOrder
} from '../../controllers/order.controller.js';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { createOrderSchema, updateOrderSchema } from '../../validators/order.validator.js';

const router = express.Router();
router.use(authenticate);

router.post('/', authorize('customer'), validateRequest(createOrderSchema), createOrder);
router.get('/customer', authorize('customer'), listCustomerOrders);
router.get('/farmer', authorize('farmer'), listFarmerOrders);
router.get('/:orderId', getOrder);
router.patch('/:orderId', authorize('farmer', 'admin'), validateRequest(updateOrderSchema), updateOrder);

export default router;
