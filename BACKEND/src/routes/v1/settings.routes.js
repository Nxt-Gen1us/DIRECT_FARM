import express from 'express';
import { authenticate } from '../../middlewares/authMiddleware.js';
import { updateSettings, changePassword } from '../../controllers/userSettings.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { updateSettingsSchema, changePasswordSchema } from '../../validators/user.validator.js';

const router = express.Router();
router.use(authenticate);

router.patch('/preferences', validateRequest(updateSettingsSchema), updateSettings);
router.post('/password', validateRequest(changePasswordSchema), changePassword);

export default router;
