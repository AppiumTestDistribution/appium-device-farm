import { Router } from 'express';
import { ApiTokenController } from '../controllers/api-tokens.controllers';
import { authMiddleware } from '../middleware/auth.middleware';
import { IPluginArgs } from '../../interfaces/IPluginArgs';

export function getApiTokensRoutes(pluginArgs: IPluginArgs) {
  const router = Router();
  const controller = new ApiTokenController();
  router.get('/', authMiddleware(pluginArgs), controller.listApiTokens.bind(controller));
  router.post('/', authMiddleware(pluginArgs), controller.createApiToken.bind(controller));
  router.delete(
    '/:tokenId',
    authMiddleware(pluginArgs),
    controller.deleteApiToken.bind(controller),
  );
  return router;
}
