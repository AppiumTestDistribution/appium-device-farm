import { Router } from 'express';
import { getAuthRoutes } from './auth.router';
import { getTeamsRoutes } from './team.router';
import { getDeviceAllocationsRoutes } from './device-allocation.router';
import { getUsersRoutes } from './users.router';
import { getApiTokensRoutes } from './api-tokens.router';
import { IPluginArgs } from '../../interfaces/IPluginArgs';

export function registerAuthenticationRoutes(router: Router, pluginArgs: IPluginArgs) {
  router.use('/auth', getAuthRoutes(pluginArgs));
  router.use('/users', getUsersRoutes(pluginArgs));
  router.use('/teams', getTeamsRoutes(pluginArgs));
  router.use('/device-allocations', getDeviceAllocationsRoutes(pluginArgs));
  router.use('/api-tokens', getApiTokensRoutes(pluginArgs));
}
