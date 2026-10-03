import express from 'express';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { createReviewSchema } from '../../validators/review.validator.js';
import { createProductReview, listProductReviews } from '../../controllers/review.controller.js';

const router = express.Router();

router.get('/product/:productId', listProductReviews);
router.post('/', authenticate, authorize('customer'), validateRequest(createReviewSchema), createProductReview);

export default router;
