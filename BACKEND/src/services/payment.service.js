import paymentRepository from '../repositories/payment.repository.js';
import Order from '../models/order.model.js';
import config from '../config/index.js';
import crypto from 'crypto';

const RAZORPAY_ORDERS_URL = 'https://api.razorpay.com/v1/orders';

function paymentError(message, statusCode) {
  return Object.assign(new Error(message), { statusCode });
}

class PaymentService {
  async createPayment(payload) {
    return paymentRepository.create(payload);
  }

  async createRazorpayOrder(userId, orderId) {
    if (!config.razorpayKeyId || !config.razorpayKeySecret) {
      throw paymentError('Online payments are not configured. Please choose cash on delivery.', 503);
    }

    const order = await Order.findOne({ _id: orderId, customer: userId });
    if (!order) throw paymentError('Order not found', 404);
    if (order.status === 'cancelled') throw paymentError('Cancelled orders cannot be paid', 409);

    const existing = await paymentRepository.findByOrder(order.id);
    if (existing?.status === 'completed') {
      throw paymentError('This order has already been paid', 409);
    }
    if (existing?.razorpayOrderId) {
      return {
        id: existing.razorpayOrderId,
        amount: Math.round(order.total * 100),
        currency: 'INR'
      };
    }

    const credentials = Buffer.from(`${config.razorpayKeyId}:${config.razorpayKeySecret}`).toString('base64');
    const response = await fetch(RAZORPAY_ORDERS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credentials}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(order.total * 100),
        currency: 'INR',
        receipt: `df_${order.id}`.slice(0, 40),
        notes: { directFarmOrderId: order.id }
      })
    });
    const razorpayOrder = await response.json();
    if (!response.ok) {
      throw paymentError(razorpayOrder?.error?.description || 'Unable to create Razorpay order', 502);
    }

    if (existing) {
      await paymentRepository.updateById(existing.id, {
        razorpayOrderId: razorpayOrder.id,
        providerResponse: razorpayOrder
      });
    } else {
      await paymentRepository.create({
        order: order.id,
        user: userId,
        method: 'razorpay',
        amount: order.total,
        status: 'pending',
        razorpayOrderId: razorpayOrder.id,
        providerResponse: razorpayOrder
      });
    }

    return { id: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency };
  }

  async verifyRazorpayPayment(userId, payload) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = payload;
    const payment = await paymentRepository.findByRazorpayOrderId(razorpay_order_id);
    if (!payment || payment.user.toString() !== userId || payment.order.toString() !== orderId) {
      throw paymentError('Payment does not belong to this order', 404);
    }
    if (payment.status === 'completed') return payment;

    const expectedSignature = crypto
      .createHmac('sha256', config.razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const suppliedBuffer = Buffer.from(razorpay_signature || '', 'utf8');
    const valid = expectedBuffer.length === suppliedBuffer.length && crypto.timingSafeEqual(expectedBuffer, suppliedBuffer);
    if (!valid) throw paymentError('Payment signature verification failed', 400);

    const verified = await paymentRepository.updateById(payment.id, {
      status: 'completed',
      transactionId: razorpay_payment_id,
      providerResponse: { ...payment.providerResponse, razorpay_payment_id, razorpay_signature }
    });
    await Order.findByIdAndUpdate(payment.order, { status: 'confirmed', updatedAt: new Date() });
    return verified;
  }

  async getPaymentByOrder(orderId) {
    return paymentRepository.findByOrder(orderId);
  }

  async getPaymentsByUser(userId, options) {
    return paymentRepository.findByUser(userId, options);
  }

  async updatePayment(paymentId, updateData) {
    return paymentRepository.updateById(paymentId, updateData);
  }
}

export default new PaymentService();
