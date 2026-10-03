import Review from '../models/review.model.js';

class ReviewRepository {
  async create(payload) {
    return Review.create(payload);
  }

  async findByProduct(productId) {
    return Review.find({ product: productId }).populate('author', 'firstName lastName role').sort({ createdAt: -1 });
  }
}

export default new ReviewRepository();
