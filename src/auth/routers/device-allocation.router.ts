import { Router } from 'express';
import { deviceAllocationController } from '../controllers/device-allocation.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';

const router = Router();
// Device allocation routes (admin only)

router.get(
  '/all',
  authMiddleware,
  adminOnly,
  deviceAllocationController.getAllDevices.bind(deviceAllocationController),
);

// Get device allocations for team
router.get(
  '/team/:teamId',
  authMiddleware,
  deviceAllocationController.getDeviceAllocationsForTeam.bind(deviceAllocationController),
);

export default router;
