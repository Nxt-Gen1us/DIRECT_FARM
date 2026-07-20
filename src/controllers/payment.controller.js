import paymentService from '../services/payment.service.js';

export const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment({ user: req.user.id, ...req.body });
    res.status(201).json({ status: 'success', data: payment });
  } catch (error) {
    next(error);
  }
};

export const getUserPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getPaymentsByUser(req.user.id, req.query);
    res.status(200).json({ status: 'success', data: payments });
  } catch (error) {
    next(error);
  }
};

export const getOrderPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentByOrder(req.params.orderId);
    res.status(200).json({ status: 'success', data: payment });
  } catch (error) {
    next(error);
  }
};
