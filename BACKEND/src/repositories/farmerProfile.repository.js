import FarmerProfile from '../models/farmerProfile.model.js';

class FarmerProfileRepository {
  async create(profileData) {
    return FarmerProfile.create(profileData);
  }

  async findById(id) {
    return FarmerProfile.findById(id).populate('user');
  }

  async findByUser(userId) {
    return FarmerProfile.findOne({ user: userId });
  }

  async updateById(id, updateData) {
    return FarmerProfile.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findAll(filter = {}, options = {}) {
    return FarmerProfile.find(filter)
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .sort(options.sort || { createdAt: -1 });
  }
}

export default new FarmerProfileRepository();
