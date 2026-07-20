import userRepository from '../repositories/user.repository.js';

class UserService {
  async getProfile(userId) {
    return userRepository.findById(userId);
  }

  async updateProfile(userId, updateData) {
    return userRepository.updateById(userId, updateData);
  }

  async addAddress(userId, address) {
    return userRepository.updateById(userId, { $push: { addresses: address } });
  }

  async removeAddress(userId, addressId) {
    return userRepository.updateById(userId, { $pull: { addresses: { _id: addressId } } });
  }
}

export default new UserService();
