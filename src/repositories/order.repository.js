import Order from '../models/order.model.js';

class OrderRepository {
  async create(orderData) {
    return Order.create(orderData);
  }

  async findById(id) {
    return Order.findById(id).populate('items.product customer farmer');
  }

  async findByCustomer(customerId, options = {}) {
    return Order.find({ customer: customerId })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .sort(options.sort || { createdAt: -1 });
  }

  async findByFarmer(farmerId, options = {}) {
    return Order.find({ farmer: farmerId })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .sort(options.sort || { createdAt: -1 });
  }

  async updateById(id, updateData) {
    return Order.findByIdAndUpdate(id, updateData, { new: true });
  }
}

export default new OrderRepository();
