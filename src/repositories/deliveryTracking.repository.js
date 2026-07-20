import DeliveryTracking from '../models/deliveryTracking.model.js';

class DeliveryTrackingRepository {
  async create(trackingData) {
    return DeliveryTracking.create(trackingData);
  }

  async findByOrder(orderId) {
    return DeliveryTracking.findOne({ order: orderId });
  }

  async updateByOrder(orderId, updateData) {
    return DeliveryTracking.findOneAndUpdate({ order: orderId }, updateData, { new: true, upsert: true });
  }

  async addEvent(orderId, event) {
    return DeliveryTracking.findOneAndUpdate(
      { order: orderId },
      { $push: { events: event }, currentStatus: event.status, updatedAt: new Date() },
      { new: true, upsert: true }
    );
  }
}

export default new DeliveryTrackingRepository();
