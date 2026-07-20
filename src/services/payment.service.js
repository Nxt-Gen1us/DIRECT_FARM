import paymentRepository from '../repositories/payment.repository.js';

class PaymentService {
  async createPayment(payload) {
    return paymentRepository.create(payload);
  }

  async getPaymentByOrder(orderId) {
    return paymentRepository.findByOrder(orderId);
  }

  async getPaymentsByUser(userId, options) {
    return paymentRepository.findByUser(userId, options);
  }

  async updatePayment(paymentId, updateData) {
    return paymentRepository.updateById(paymentId, updateData);
  }
}

export default new PaymentService();
