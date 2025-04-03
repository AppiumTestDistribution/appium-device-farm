import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { userController } from '../controllers/user.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';

const router = Router();

// Authentication routes
router.post('/register', authMiddleware, adminOnly, authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController));
router.post('/change-password', authMiddleware, authController.changePassword.bind(authController));

// User management routes (admin only)
router.get('/users', authMiddleware, adminOnly, userController.getAllUsers.bind(userController));
router.get(
  '/users/:id',
  authMiddleware,
  adminOnly,
  userController.getUserById.bind(userController),
);
router.delete(
  '/users/:id',
  authMiddleware,
  adminOnly,
  userController.deleteUser.bind(userController),
);

export default router;
