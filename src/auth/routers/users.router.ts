import { Router } from 'express';
import { adminOnly, authMiddleware } from '../middleware/auth.middleware';
import { userController } from '../controllers/user.controller';
import { authController } from '../controllers/auth.controller';

const router = Router();

// User management routes (admin only)
router.get('/', authMiddleware, adminOnly, userController.getAllUsers.bind(userController));
router.post('/', authMiddleware, adminOnly, authController.register.bind(authController));
router.get('/:id', authMiddleware, adminOnly, userController.getUserById.bind(userController));
router.put('/:id', authMiddleware, adminOnly, userController.updateUser.bind(userController));
router.delete('/:id', authMiddleware, adminOnly, userController.deleteUser.bind(userController));

export default router;
