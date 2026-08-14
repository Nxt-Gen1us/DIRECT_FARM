import express from 'express';
import {
  getProfile,
  updateProfile,
  addAddress,
  removeAddress
} from '../../controllers/user.controller.js';
import { authenticate } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/me', getProfile);
router.patch('/me', updateProfile);
router.post('/addresses', addAddress);
router.delete('/addresses/:addressId', removeAddress);

export default router;
