import { Router } from 'express';
import { deviceAllocationController } from '../controllers/device-allocation.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';
import { IPluginArgs } from '../../interfaces/IPluginArgs';

export function getDeviceAllocationsRoutes(pluginArgs: IPluginArgs) {
  const router = Router();
  // Device allocation routes (admin only)

  router.get(
    '/all',
    authMiddleware(pluginArgs),
    adminOnly,
    deviceAllocationController.getAllDevices.bind(deviceAllocationController),
  );

  // Get device allocations for team
  router.get(
    '/team/:teamId',
    authMiddleware(pluginArgs),
    deviceAllocationController.getDeviceAllocationsForTeam.bind(deviceAllocationController),
  );

  return router;
}
