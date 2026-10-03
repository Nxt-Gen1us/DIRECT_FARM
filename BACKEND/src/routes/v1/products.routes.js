import express from 'express';
import {
  createProduct,
  listProducts,
  listCategories,
  getProduct,
  updateProduct,
  deleteProduct
} from '../../controllers/product.controller.js';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { createProductSchema, updateProductSchema } from '../../validators/product.validator.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/categories', listCategories);
router.get('/:productId', getProduct);

router.post('/', authenticate, authorize('farmer'), validateRequest(createProductSchema), createProduct);
router.patch('/:productId', authenticate, authorize('farmer'), validateRequest(updateProductSchema), updateProduct);
router.delete('/:productId', authenticate, authorize('farmer'), deleteProduct);

export default router;
