import User from '../models/user.model.js';

class UserRepository {
  async create(userData) {
    return User.create(userData);
  }

  async findByEmail(email) {
    return User.findOne({ email }).select('+password +verificationToken +otpCode +passwordResetToken');
  }

  async findById(id) {
    return User.findById(id);
  }

  async findByIdWithPassword(id) {
    return User.findById(id).select('+password');
  }

  async updateById(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async findByVerificationToken(token) {
    return User.findOne({ verificationToken: token }).select('+verificationToken +verificationExpires');
  }

  async findByPasswordResetToken(token) {
    return User.findOne({ passwordResetToken: token }).select('+passwordResetToken +passwordResetExpires');
  }

  async addSession(id, sessionData) {
    return User.findByIdAndUpdate(
      id,
      { $push: { sessions: sessionData } },
      { new: true }
    );
  }

  async replaceSession(userId, oldRefreshToken, newSession) {
    const user = await User.findById(userId).select('+sessions');
    if (!user) return null;
    user.sessions = (user.sessions || []).filter((s) => s.refreshToken !== oldRefreshToken);
    user.sessions.push(newSession);
    await user.save();
    return user;
  }

  async removeSession(id, refreshToken) {
    return User.findByIdAndUpdate(
      id,
      { $pull: { sessions: { refreshToken } } },
      { new: true }
    );
  }
}

export default new UserRepository();
