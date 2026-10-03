import walletTopupService from '../services/walletTopup.service.js';

export const createTopupOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const result = await walletTopupService.createTopupOrder(req.user.id, amount);
    res.status(201).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const verifyTopup = async (req, res, next) => {
  try {
    const verified = await walletTopupService.verifyTopup(req.user.id, req.body);
    res.status(200).json({ status: 'success', data: verified });
  } catch (error) {
    next(error);
  }
};
