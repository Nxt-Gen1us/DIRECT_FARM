import express from 'express';
import { authenticate } from '../../middlewares/authMiddleware.js';
import { listSessions, revokeSession, revokeAllSessions } from '../../controllers/session.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { logoutSchema } from '../../validators/auth.validator.js';

const router = express.Router();
router.use(authenticate);

router.get('/', listSessions);
router.post('/revoke', validateRequest(logoutSchema), revokeSession);
router.post('/revoke-all', revokeAllSessions);

export default router;
