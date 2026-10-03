import crypto from 'crypto';
import config from '../config/index.js';
import paymentRepository from '../repositories/payment.repository.js';
import walletTopupRepository from '../repositories/walletTopup.repository.js';
import walletService from '../services/wallet.service.js';
import Order from '../models/order.model.js';

export const razorpayWebhook = async (req, res, next) => {
  try {
    const secret = config.razorpayKeySecret;
    const signatureHeader = req.headers['x-razorpay-signature'];
    
    if (!secret) {
      return res.status(503).json({ status: 'error', message: 'Webhook secret not configured' });
    }
    
    if (!signatureHeader) {
      return res.status(400).json({ status: 'error', message: 'Missing signature header' });
    }

    // Use the raw body captured by express.json verify function
    const rawBody = req.rawBody;
    if (!rawBody || !(rawBody instanceof Buffer)) {
      return res.status(400).json({ status: 'error', message: 'Raw body not available for signature verification' });
    }

    // Verify Razorpay webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const receivedSignature = String(signatureHeader).trim();
    const normalizedExpected = expectedSignature.toLowerCase();
    const normalizedReceived = receivedSignature.toLowerCase();

    if (normalizedExpected.length !== normalizedReceived.length) {
      return res.status(400).json({ status: 'error', message: 'Invalid webhook signature' });
    }

    // Use timing-safe comparison to prevent timing attacks.
    const isValid = crypto.timingSafeEqual(
      Buffer.from(normalizedExpected, 'utf8'),
      Buffer.from(normalizedReceived, 'utf8')
    );

    if (!isValid) {
      return res.status(400).json({ status: 'error', message: 'Invalid webhook signature' });
    }

    // Parse the validated webhook payload
    const payload = JSON.parse(rawBody.toString('utf8'));
    const event = payload.event || payload.event_type || '';

    const paymentEntity = payload?.payload?.payment?.entity;
    const refundEntity = payload?.payload?.refund?.entity;

    if (paymentEntity) {
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      try {
        // Payment for an order
        const payment = await paymentRepository.findByRazorpayOrderId(razorpayOrderId);
        if (payment) {
          if (event === 'payment.captured' || event === 'payment.authorized') {
            await paymentRepository.updateById(payment.id, {
              status: 'completed',
              transactionId: razorpayPaymentId,
              providerResponse: { ...payment.providerResponse, webhook: payload }
            });
            await Order.findByIdAndUpdate(payment.order, { status: 'confirmed', updatedAt: new Date() });
          } else if (event === 'payment.failed') {
            await paymentRepository.updateById(payment.id, { 
              status: 'failed', 
              providerResponse: { ...payment.providerResponse, webhook: payload } 
            });
          }
        }

        // Also handle wallet topups (separate collection)
        const topup = await walletTopupRepository.findByRazorpayOrderId(razorpayOrderId);
        if (topup) {
          if (event === 'payment.captured' || event === 'payment.authorized') {
            await walletTopupRepository.updateById(topup.id, {
              status: 'completed',
              transactionId: razorpayPaymentId,
              providerResponse: { ...topup.providerResponse, webhook: payload }
            });
            await walletService.addTransaction(topup.user, {
              type: 'credit',
              amount: topup.amount,
              reference: `topup_${topup.id}`,
              description: 'Wallet top-up via Razorpay (webhook)'
            });
          } else if (event === 'payment.failed') {
            await walletTopupRepository.updateById(topup.id, { 
              status: 'failed', 
              providerResponse: { ...topup.providerResponse, webhook: payload } 
            });
          }
        }
      } catch (dbError) {
        console.warn('Webhook DB sync skipped for payment event:', dbError.message);
      }
    }

    if (refundEntity) {
      try {
        // Locate payment by payment id
        const origPayment = await paymentRepository.findByTransactionId(refundEntity.payment_id);
        if (origPayment) {
          await paymentRepository.updateById(origPayment.id, { 
            status: 'refunded', 
            providerResponse: { ...origPayment.providerResponse, refund: refundEntity } 
          });
          await Order.findByIdAndUpdate(origPayment.order, { status: 'refunded', updatedAt: new Date() });
        }
      } catch (dbError) {
        console.warn('Webhook DB sync skipped for refund event:', dbError.message);
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    // Log webhook errors for debugging but don't expose details to Razorpay
    console.error('Webhook processing error:', error);
    next(error);
  }
};
