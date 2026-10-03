import reviewService from '../services/review.service.js';

export const listProductReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.listProductReviews(req.params.productId);
    res.status(200).json({ status: 'success', data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createProductReview = async (req, res, next) => {
  try {
    const review = await reviewService.createProductReview(req.user.id, req.body);
    res.status(201).json({ status: 'success', data: review });
  } catch (error) {
    next(error);
  }
};
