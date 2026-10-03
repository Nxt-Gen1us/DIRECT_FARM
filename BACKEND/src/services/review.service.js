import Review from '../models/review.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';
import reviewRepository from '../repositories/review.repository.js';

class ReviewService {
  async listProductReviews(productId) {
    return reviewRepository.findByProduct(productId);
  }

  async createProductReview(customerId, { productId, rating, comment }) {
    const product = await Product.findById(productId).select('farmer');
    if (!product) throw Object.assign(new Error('Product not found'), { statusCode: 404 });

    const purchased = await Order.exists({
      customer: customerId,
      status: 'delivered',
      'items.product': productId
    });
    if (!purchased) {
      throw Object.assign(new Error('Only customers with a delivered order can review this product'), { statusCode: 403 });
    }
    if (await Review.exists({ author: customerId, product: productId })) {
      throw Object.assign(new Error('You have already reviewed this product'), { statusCode: 409 });
    }
    return reviewRepository.create({ author: customerId, farmer: product.farmer, product: productId, rating, comment });
  }
}

export default new ReviewService();
