import express from 'express';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyOtp,
  logout
} from '../../controllers/auth.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import {
  loginSchema,
  registerSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  sendOtpSchema,
  verifyOtpSchema,
  logoutSchema
} from '../../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/verify-email', validateRequest(verifyEmailSchema), verifyEmail);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);
router.post('/send-otp', validateRequest(sendOtpSchema), sendOtp);
router.post('/verify-otp', validateRequest(verifyOtpSchema), verifyOtp);
router.post('/logout', validateRequest(logoutSchema), logout);

export default router;
