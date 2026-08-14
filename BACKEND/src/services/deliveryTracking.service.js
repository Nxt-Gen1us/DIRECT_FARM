import deliveryTrackingRepository from '../repositories/deliveryTracking.repository.js';

class DeliveryTrackingService {
  async createTracking(payload) {
    return deliveryTrackingRepository.create(payload);
  }

  async getTrackingForOrder(orderId) {
    return deliveryTrackingRepository.findByOrder(orderId);
  }

  async updateTracking(orderId, updateData) {
    return deliveryTrackingRepository.updateByOrder(orderId, updateData);
  }

  async addTrackingEvent(orderId, event) {
    return deliveryTrackingRepository.addEvent(orderId, event);
  }
}

export default new DeliveryTrackingService();
