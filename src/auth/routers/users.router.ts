import { Router } from 'express';
import { adminOnly, authMiddleware } from '../middleware/auth.middleware';
import { userController } from '../controllers/user.controller';
import { authController } from '../controllers/auth.controller';
import { IPluginArgs } from '../../interfaces/IPluginArgs';

export function getUsersRoutes(pluginArgs: IPluginArgs) {
  const router = Router();

  // User management routes (admin only)
  router.get(
    '/',
    authMiddleware(pluginArgs),
    adminOnly,
    userController.getAllUsers.bind(userController),
  );
  router.post(
    '/',
    authMiddleware(pluginArgs),
    adminOnly,
    authController.register.bind(authController),
  );
  router.get(
    '/:id',
    authMiddleware(pluginArgs),
    adminOnly,
    userController.getUserById.bind(userController),
  );
  router.put('/:id', authMiddleware(pluginArgs), userController.updateUser.bind(userController));
  router.delete(
    '/:id',
    authMiddleware(pluginArgs),
    adminOnly,
    userController.deleteUser.bind(userController),
  );

  return router;
}
