import express from 'express';
import {
  getFarmerProfile,
  createFarmerProfile,
  updateFarmerProfile,
  listFarmerProfiles,
  getFarmerProfileById
} from '../../controllers/farmerProfile.controller.js';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Marketplace discovery is public. Restrict the id route to Mongo ObjectIds so
// it cannot shadow the authenticated /profile route below.
router.get('/', listFarmerProfiles);
router.get('/:profileId([0-9a-fA-F]{24})', getFarmerProfileById);
router.use(authenticate);

router.get('/profile', authorize('farmer', 'admin'), getFarmerProfile);
router.post('/profile', authorize('farmer'), createFarmerProfile);
router.patch('/profile', authorize('farmer'), updateFarmerProfile);

export default router;
