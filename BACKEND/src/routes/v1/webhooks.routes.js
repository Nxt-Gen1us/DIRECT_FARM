import express from 'express';
import { razorpayWebhook } from '../../controllers/webhook.controller.js';

const router = express.Router();

// Use the app-level raw capture (express.json verify) for signature verification
router.post('/razorpay', razorpayWebhook);

export default router;
