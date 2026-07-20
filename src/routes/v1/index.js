import express from 'express';
import healthRouter from './health.routes.js';
import authRouter from './auth.routes.js';
import tokenRouter from './token.routes.js';
import usersRouter from './users.routes.js';
import farmersRouter from './farmers.routes.js';
import productsRouter from './products.routes.js';
import ordersRouter from './orders.routes.js';
import paymentsRouter from './payments.routes.js';
import walletRouter from './wallet.routes.js';
import notificationsRouter from './notifications.routes.js';
import messagesRouter from './messages.routes.js';
import deliveryRouter from './delivery.routes.js';
import sessionsRouter from './sessions.routes.js';
import settingsRouter from './settings.routes.js';

const router = express.Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/token', tokenRouter);
router.use('/users', usersRouter);
router.use('/farmers', farmersRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);
router.use('/payments', paymentsRouter);
router.use('/wallet', walletRouter);
router.use('/notifications', notificationsRouter);
router.use('/messages', messagesRouter);
router.use('/delivery', deliveryRouter);
router.use('/sessions', sessionsRouter);
router.use('/settings', settingsRouter);

export default router;
