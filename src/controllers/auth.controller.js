import authService from '../services/auth.service.js';

const sanitizeUser = (user) => {
  if (!user) return user;
  const sanitized = user.toObject ? user.toObject() : { ...user };
  delete sanitized.password;
  delete sanitized.verificationToken;
  delete sanitized.otpCode;
  delete sanitized.passwordResetToken;
  delete sanitized.passwordResetExpires;
  delete sanitized.otpExpires;
  return sanitized;
};

export const register = async (req, res, next) => {
  try {
    const { user, verificationToken } = await authService.register(req.body);
    res.status(201).json({
      status: 'success',
      data: { user: sanitizeUser(user), verificationToken }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body.email, req.body.password);
    res.status(200).json({
      status: 'success',
      data: { user: sanitizeUser(user), accessToken, refreshToken }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    await authService.verifyEmail(req.body.token);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    await authService.forgotPassword(req.body.email);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    await authService.resetPassword(req.body.token, req.body.password);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

export const sendOtp = async (req, res, next) => {
  try {
    await authService.sendOtp(req.body.email);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    await authService.verifyOtp(req.body.email, req.body.otp);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logout(req.body.refreshToken);
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};
