import express from 'express';
import { getWallet, addWalletTransaction } from '../../controllers/wallet.controller.js';
import { authenticate } from '../../middlewares/authMiddleware.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { walletTransactionSchema } from '../../validators/wallet.validator.js';

const router = express.Router();
router.use(authenticate);

router.get('/', getWallet);
router.post('/transactions', validateRequest(walletTransactionSchema), addWalletTransaction);

export default router;
