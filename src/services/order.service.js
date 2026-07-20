import orderRepository from '../repositories/order.repository.js';

class OrderService {
  async createOrder(orderData) {
    return orderRepository.create(orderData);
  }

  async getOrder(orderId) {
    return orderRepository.findById(orderId);
  }

  async getCustomerOrders(customerId, options) {
    return orderRepository.findByCustomer(customerId, options);
  }

  async getFarmerOrders(farmerId, options) {
    return orderRepository.findByFarmer(farmerId, options);
  }

  async updateOrder(orderId, updateData) {
    return orderRepository.updateById(orderId, updateData);
  }
}

export default new OrderService();
