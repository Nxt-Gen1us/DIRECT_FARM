import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../.env') });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/direct_farm',
  jwtSecret: process.env.JWT_SECRET || 'change_this_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  logLevel: process.env.LOG_LEVEL || 'info',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || '',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || ''
};

export function validateRuntimeConfig() {
  const isProduction = config.env === 'production';
  const required = [];

  if (isProduction) {
    if (!config.mongoUri || config.mongoUri.includes('localhost') || config.mongoUri.includes('username:password')) {
      required.push('MONGO_URI');
    }
    if (!config.jwtSecret || config.jwtSecret === 'change_this_secret' || config.jwtSecret.includes('your_')) {
      required.push('JWT_SECRET');
    }
    if (!config.corsOrigin || config.corsOrigin.includes('localhost') || config.corsOrigin.includes('your_')) {
      required.push('CORS_ORIGIN');
    }
  }

  const placeholderKeys = [];
  if (config.razorpayKeyId && config.razorpayKeyId.includes('your_')) placeholderKeys.push('RAZORPAY_KEY_ID');
  if (config.razorpayKeySecret && config.razorpayKeySecret.includes('your_')) placeholderKeys.push('RAZORPAY_KEY_SECRET');

  if (required.length || placeholderKeys.length) {
    const message = [
      'Production config validation failed.',
      ...required.map((key) => `Missing required value for ${key}.`),
      ...placeholderKeys.map((key) => `The ${key} value still contains a placeholder.`),
      'Update the environment variables before deploying.'
    ].join(' ');

    throw new Error(message);
  }

  if (config.razorpayKeyId && !config.razorpayKeySecret) {
    throw new Error('Production requires both RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET when online payments are enabled.');
  }

  if (!config.razorpayKeyId && !config.razorpayKeySecret) {
    console.warn('[config] Razorpay is not configured; the app will run in COD-only mode.');
  }
}

export default config;
