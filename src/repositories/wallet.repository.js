import Wallet from '../models/wallet.model.js';

class WalletRepository {
  async findByUser(userId) {
    return Wallet.findOne({ user: userId });
  }

  async create(walletData) {
    return Wallet.create(walletData);
  }

  async updateByUser(userId, updateData) {
    return Wallet.findOneAndUpdate({ user: userId }, updateData, { new: true, upsert: true });
  }

  async addTransaction(userId, transaction) {
    return Wallet.findOneAndUpdate(
      { user: userId },
      { $push: { transactions: transaction }, $inc: { balance: transaction.type === 'credit' ? transaction.amount : -transaction.amount } },
      { new: true, upsert: true }
    );
  }
}

export default new WalletRepository();
