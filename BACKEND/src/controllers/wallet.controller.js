import walletService from '../services/wallet.service.js';

export const getWallet = async (req, res, next) => {
  try {
    const wallet = await walletService.getWallet(req.user.id);
    res.status(200).json({ status: 'success', data: wallet });
  } catch (error) {
    next(error);
  }
};

export const addWalletTransaction = async (req, res, next) => {
  try {
    const { type } = req.body;
    // Prevent arbitrary credits via this endpoint; require official top-up flow
    if (type === 'credit' && req.user.role !== 'admin') {
      const error = new Error('Credits must be performed via the wallet top-up flow');
      error.statusCode = 403;
      throw error;
    }

    const wallet = await walletService.addTransaction(req.user.id, req.body);
    res.status(201).json({ status: 'success', data: wallet });
  } catch (error) {
    next(error);
  }
};
