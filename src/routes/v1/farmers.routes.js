import express from 'express';
import {
  getFarmerProfile,
  createFarmerProfile,
  updateFarmerProfile
} from '../../controllers/farmerProfile.controller.js';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';

const router = express.Router();
router.use(authenticate);

router.get('/profile', authorize('farmer', 'admin'), getFarmerProfile);
router.post('/profile', authorize('farmer'), createFarmerProfile);
router.patch('/profile', authorize('farmer'), updateFarmerProfile);

export default router;
