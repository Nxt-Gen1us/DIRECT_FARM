import Payment from '../models/payment.model.js';

class PaymentRepository {
  async create(paymentData) {
    return Payment.create(paymentData);
  }

  async findByOrder(orderId) {
    return Payment.findOne({ order: orderId });
  }

  async findByRazorpayOrderId(razorpayOrderId) {
    return Payment.findOne({ razorpayOrderId });
  }

  async findByUser(userId, options = {}) {
    return Payment.find({ user: userId })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .sort(options.sort || { createdAt: -1 });
  }

  async updateById(id, updateData) {
    return Payment.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByTransactionId(transactionId) {
    return Payment.findOne({ transactionId });
  }
}

export default new PaymentRepository();
