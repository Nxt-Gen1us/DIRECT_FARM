import farmerProfileRepository from '../repositories/farmerProfile.repository.js';

class FarmerProfileService {
  async createProfile(payload) {
    return farmerProfileRepository.create(payload);
  }

  async getByUser(userId) {
    return farmerProfileRepository.findByUser(userId);
  }

  async getById(profileId) {
    const profile = await farmerProfileRepository.findById(profileId);
    if (!profile) {
      throw Object.assign(new Error('Farmer profile not found'), { statusCode: 404 });
    }
    return profile;
  }

  async updateByUser(userId, updateData) {
    const profile = await farmerProfileRepository.findByUser(userId);
    if (!profile) {
      const error = new Error('Farmer profile not found');
      error.statusCode = 404;
      throw error;
    }
    return farmerProfileRepository.updateById(profile.id, updateData);
  }

  async listProfiles(filters, options) {
    return farmerProfileRepository.findAll(filters, options);
  }
}

export default new FarmerProfileService();
