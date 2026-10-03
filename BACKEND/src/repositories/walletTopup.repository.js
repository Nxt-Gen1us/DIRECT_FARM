import WalletTopup from '../models/walletTopup.model.js';

class WalletTopupRepository {
  async create(data) {
    return WalletTopup.create(data);
  }

  async findByRazorpayOrderId(razorpayOrderId) {
    return WalletTopup.findOne({ razorpayOrderId });
  }

  async findById(id) {
    return WalletTopup.findById(id);
  }

  async updateById(id, update) {
    return WalletTopup.findByIdAndUpdate(id, update, { new: true });
  }
}

export default new WalletTopupRepository();
