import { Router } from 'express';
import { teamController } from '../controllers/team.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';
import { IPluginArgs } from '../../interfaces/IPluginArgs';

export function getTeamsRoutes(pluginArgs: IPluginArgs) {
  const router = Router();

  // Team management routes (admin only)
  router.post(
    '/',
    authMiddleware(pluginArgs),
    adminOnly,
    teamController.createTeam.bind(teamController),
  );
  router.get('/', authMiddleware(pluginArgs), teamController.getAllTeams.bind(teamController));
  router.get('/:id', authMiddleware(pluginArgs), teamController.getTeamById.bind(teamController));
  router.put(
    '/:id',
    authMiddleware(pluginArgs),
    adminOnly,
    teamController.updateTeam.bind(teamController),
  );
  router.delete('/:id', authMiddleware, adminOnly, teamController.deleteTeam.bind(teamController));

  // Team membership routes
  router.post(
    '/:id/members',
    authMiddleware(pluginArgs),
    adminOnly,
    teamController.addUserToTeam.bind(teamController),
  );

  // Get teams for user
  router.get(
    '/user/:userId',
    authMiddleware(pluginArgs),
    teamController.getTeamsForUser.bind(teamController),
  );

  router.post(
    '/:id/devices',
    authMiddleware(pluginArgs),
    adminOnly,
    teamController.addDeviceToTeam.bind(teamController),
  );

  return router;
}
