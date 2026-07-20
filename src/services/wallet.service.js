import walletRepository from '../repositories/wallet.repository.js';

class WalletService {
  async getWallet(userId) {
    return walletRepository.findByUser(userId);
  }

  async addTransaction(userId, transaction) {
    return walletRepository.addTransaction(userId, transaction);
  }

  async updateWallet(userId, updateData) {
    return walletRepository.updateByUser(userId, updateData);
  }
}

export default new WalletService();
