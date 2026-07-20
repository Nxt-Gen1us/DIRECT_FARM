import bcrypt from 'bcryptjs';
import userRepository from '../repositories/user.repository.js';

class UserSettingsService {
  async updatePreferences(userId, preferences) {
    return userRepository.updateById(userId, { preferences });
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      const error = new Error('Current password is incorrect');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    return userRepository.updateById(userId, { password: hashedPassword });
  }
}

export default new UserSettingsService();
