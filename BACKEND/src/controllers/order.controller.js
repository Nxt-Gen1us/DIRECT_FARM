import orderService from '../services/order.service.js';

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder({ customer: req.user.id, ...req.body });
    res.status(201).json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req.params.orderId, req.user);
    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
};

export const listCustomerOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getCustomerOrders(req.user.id, req.query);
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    next(error);
  }
};

export const listFarmerOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getFarmerOrders(req.user.id, req.query);
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const order = await orderService.updateOrder(req.params.orderId, req.body, req.user);
    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
};
