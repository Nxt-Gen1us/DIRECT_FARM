import express from 'express';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';
import { createAdminProduct, createAdminUser, deleteAdminProduct, deleteAdminUser, getAdminStats, listAdminFarmers, listAdminUsers, updateAdminProduct, updateAdminUser, updateFarmerVerification } from '../../controllers/admin.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import Joi from 'joi';

const router = express.Router();
router.use(authenticate, authorize('admin'));
router.get('/stats', getAdminStats);
router.get('/users', listAdminUsers);
router.post('/users', validateRequest(Joi.object({ firstName: Joi.string().trim().required(), lastName: Joi.string().trim().allow('').optional(), email: Joi.string().email().required(), password: Joi.string().min(8).required(), role: Joi.string().valid('customer', 'farmer', 'admin').required(), isVerified: Joi.boolean().optional() })), createAdminUser);
router.patch('/users/:userId', validateRequest(Joi.object({ firstName: Joi.string().trim().optional(), lastName: Joi.string().trim().allow('').optional(), email: Joi.string().email().optional(), role: Joi.string().valid('customer', 'farmer', 'admin').optional(), isVerified: Joi.boolean().optional() })), updateAdminUser);
router.delete('/users/:userId', deleteAdminUser);
router.post('/products', validateRequest(Joi.object({ farmerId: Joi.string().allow('').optional(), name: Joi.string().required(), category: Joi.string().required(), price: Joi.number().min(0).required(), quantityAvailable: Joi.number().integer().min(0).required(), variety: Joi.string().allow('').optional(), unit: Joi.string().allow('').optional(), origin: Joi.string().allow('').optional(), description: Joi.string().allow('').optional() })), createAdminProduct);
router.patch('/products/:productId', validateRequest(Joi.object({ name: Joi.string().optional(), category: Joi.string().optional(), price: Joi.number().min(0).optional(), quantityAvailable: Joi.number().integer().min(0).optional(), variety: Joi.string().allow('').optional(), unit: Joi.string().allow('').optional(), origin: Joi.string().allow('').optional(), description: Joi.string().allow('').optional() })), updateAdminProduct);
router.delete('/products/:productId', deleteAdminProduct);
router.get('/farmers', listAdminFarmers);
router.patch('/farmers/:profileId/verification', validateRequest(Joi.object({ verificationStatus: Joi.string().valid('verified', 'rejected').required() })), updateFarmerVerification);

export default router;
