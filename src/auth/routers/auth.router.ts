import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { userController } from '../controllers/user.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';
import { IPluginArgs } from '../../interfaces/IPluginArgs';

export function getAuthRoutes(pluginArgs: IPluginArgs) {
  // Authentication routes
  const router = Router();
  router.post('/login', authController.login.bind(authController));
  router.get('/me', authMiddleware(pluginArgs), authController.getCurrentUser.bind(authController));
  router.post(
    '/change-password',
    authMiddleware(pluginArgs),
    authController.changePassword.bind(authController),
  );
  router.put(
    '/users/:userId/activate',
    authMiddleware(pluginArgs),
    adminOnly,
    authController.activateUser.bind(authController),
  );
  router.put(
    '/users/:userId/deactivate',
    authMiddleware(pluginArgs),
    adminOnly,
    authController.deactivateUser.bind(authController),
  );

  return router;
}
