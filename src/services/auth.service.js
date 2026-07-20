import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import defaultUserRepository from '../repositories/user.repository.js';
import config from '../config/index.js';
import defaultEmailService from './email.service.js';

export class AuthService {
  constructor({ userRepository = defaultUserRepository, emailService = defaultEmailService } = {}) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  async register(payload) {
    const existingUser = await this.userRepository.findByEmail(payload.email);
    if (existingUser) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(payload.password, 12);
    const verificationToken = crypto.randomBytes(24).toString('hex');
    const user = await this.userRepository.create({
      ...payload,
      password: hashedPassword,
      verificationToken,
      verificationExpires: Date.now() + 1000 * 60 * 60 * 24
    });

    try {
      await this.emailService.sendVerificationEmail(user.email, verificationToken);
    } catch (e) {
      console.warn('Failed to send verification email', e.message);
    }

    return { user, verificationToken };
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = this.generateToken({ userId: user.id, role: user.role }, config.jwtExpiresIn);
    const refreshToken = this.generateToken({ userId: user.id, role: user.role }, config.refreshTokenExpiresIn);

    await this.userRepository.addSession(user.id, {
      device: 'unknown',
      ip: 'unknown',
      userAgent: 'unknown',
      refreshToken
    });

    return { user, accessToken, refreshToken };
  }

  async verifyEmail(token) {
    const user = await this.userRepository.findByVerificationToken(token);
    if (!user || user.verificationExpires < Date.now()) {
      const error = new Error('Invalid or expired verification token');
      error.statusCode = 400;
      throw error;
    }
    return this.userRepository.updateById(user.id, { isVerified: true, verificationToken: null, verificationExpires: null });
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const resetToken = crypto.randomBytes(24).toString('hex');
    const resetExpires = Date.now() + 1000 * 60 * 30;

    await this.userRepository.updateById(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires
    });

    try {
      await this.emailService.sendPasswordReset(user.email, resetToken);
    } catch (e) {
      console.warn('Failed to send password reset email', e.message);
    }

    return resetToken;
  }

  async resetPassword(token, password) {
    const user = await this.userRepository.findByPasswordResetToken(token);
    if (!user || user.passwordResetExpires < Date.now()) {
      const error = new Error('Invalid or expired password reset token');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    return this.userRepository.updateById(user.id, {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null
    });
  }

  async sendOtp(email) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 1000 * 60 * 10;

    await this.userRepository.updateById(user.id, {
      otpCode,
      otpExpires
    });

    try {
      await this.emailService.sendOtp(user.email, otpCode);
    } catch (e) {
      console.warn('Failed to send OTP', e.message);
    }

    return otpCode;
  }

  async rotateRefreshToken(oldRefreshToken) {
    const decoded = await this.verifyRefreshToken(oldRefreshToken);
    if (!decoded) {
      const error = new Error('Invalid refresh token');
      error.statusCode = 401;
      throw error;
    }

    const newRefreshToken = this.generateToken({ userId: decoded.userId, role: decoded.role }, config.refreshTokenExpiresIn);
    const accessToken = this.generateToken({ userId: decoded.userId, role: decoded.role }, config.jwtExpiresIn);

    const newSession = {
      device: 'rotated',
      ip: 'unknown',
      userAgent: 'unknown',
      refreshToken: newRefreshToken,
      createdAt: new Date()
    };

    await this.userRepository.replaceSession(decoded.userId, oldRefreshToken, newSession);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async verifyOtp(email, otp) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || user.otpCode !== otp || user.otpExpires < Date.now()) {
      const error = new Error('Invalid or expired OTP');
      error.statusCode = 400;
      throw error;
    }

    return this.userRepository.updateById(user.id, {
      otpCode: null,
      otpExpires: null
    });
  }

  async logout(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtSecret);
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        const error = new Error('Invalid token');
        error.statusCode = 401;
        throw error;
      }
      return this.userRepository.removeSession(user.id, refreshToken);
    } catch (err) {
      const error = new Error('Invalid token');
      error.statusCode = 401;
      throw error;
    }
  }

  generateToken(payload, expiresIn) {
    return jwt.sign(payload, config.jwtSecret, { expiresIn });
  }

  async verifyRefreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, config.jwtSecret);
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) return null;
      const session = user.sessions.find((item) => item.refreshToken === refreshToken);
      return session ? decoded : null;
    } catch {
      return null;
    }
  }
}

export default new AuthService();
