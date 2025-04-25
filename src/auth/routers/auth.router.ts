import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { userController } from '../controllers/user.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';

const router = Router();

// Authentication routes
router.post('/login', authController.login.bind(authController));
router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController));
router.post('/change-password', authMiddleware, authController.changePassword.bind(authController));

export default router;
