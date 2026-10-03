import config from '../config/index.js';
import walletTopupRepository from '../repositories/walletTopup.repository.js';
import walletService from './wallet.service.js';
import crypto from 'crypto';

const RAZORPAY_ORDERS_URL = 'https://api.razorpay.com/v1/orders';

function paymentError(message, statusCode) {
  return Object.assign(new Error(message), { statusCode });
}

class WalletTopupService {
  async createTopupOrder(userId, amount) {
    if (!config.razorpayKeyId || !config.razorpayKeySecret) {
      throw paymentError('Online payments are not configured', 503);
    }
    if (amount <= 0) throw paymentError('Invalid top-up amount', 400);

    const credentials = Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64');
    const response = await fetch(RAZORPAY_ORDERS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `wallet_topup_${userId}_${Date.now()}`.slice(0, 40)
      })
    });
    const razorpayOrder = await response.json();
    if (!response.ok) throw paymentError(razorpayOrder?.error?.description || 'Unable to create Razorpay order', 502);

    const record = await walletTopupRepository.create({
      user: userId,
      amount,
      status: 'pending',
      razorpayOrderId: razorpayOrder.id,
      providerResponse: razorpayOrder
    });

    return { id: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency, record };
  }

  async verifyTopup(userId, payload) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = payload;
    const topup = await walletTopupRepository.findByRazorpayOrderId(razorpay_order_id);
    if (!topup || topup.user.toString() !== userId) {
      throw paymentError('Top-up not found', 404);
    }
    if (topup.status === 'completed') return topup;

    const expectedSignature = crypto
      .createHmac('sha256', config.razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const suppliedBuffer = Buffer.from(razorpay_signature || '', 'utf8');
    const valid = expectedBuffer.length === suppliedBuffer.length && crypto.timingSafeEqual(expectedBuffer, suppliedBuffer);
    if (!valid) throw paymentError('Payment signature verification failed', 400);

    const updated = await walletTopupRepository.updateById(topup.id, {
      status: 'completed',
      transactionId: razorpay_payment_id,
      providerResponse: { ...topup.providerResponse, razorpay_payment_id, razorpay_signature }
    });

    // Credit user's wallet
    await walletService.addTransaction(userId, {
      type: 'credit',
      amount: topup.amount,
      reference: `topup_${topup.id}`,
      description: 'Wallet top-up via Razorpay'
    });

    return updated;
  }
}

export default new WalletTopupService();
