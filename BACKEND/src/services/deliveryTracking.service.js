import deliveryTrackingRepository from '../repositories/deliveryTracking.repository.js';
import Order from '../models/order.model.js';
import FarmerProfile from '../models/farmerProfile.model.js';

async function assertOrderAccess(orderId, actor, write = false) {
  const order = await Order.findById(orderId).select('customer farmer').lean();
  if (!order) throw Object.assign(new Error('Order not found'), { statusCode: 404 });
  if (actor.role === 'admin') return;
  if (!write && order.customer.toString() === actor.id) return;
  const profile = await FarmerProfile.findOne({ user: actor.id }).select('_id').lean();
  if (profile && order.farmer.toString() === profile._id.toString()) return;
  throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
}

class DeliveryTrackingService {
  async createTracking(payload) {
    return deliveryTrackingRepository.create(payload);
  }

  async getTrackingForOrder(orderId, actor) {
    await assertOrderAccess(orderId, actor);
    return deliveryTrackingRepository.findByOrder(orderId);
  }

  async updateTracking(orderId, updateData, actor) {
    await assertOrderAccess(orderId, actor, true);
    return deliveryTrackingRepository.updateByOrder(orderId, updateData);
  }

  async addTrackingEvent(orderId, event, actor) {
    await assertOrderAccess(orderId, actor, true);
    return deliveryTrackingRepository.addEvent(orderId, event);
  }
}

export default new DeliveryTrackingService();
