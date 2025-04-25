import { Router } from 'express';
import { deviceAllocationController } from '../controllers/device-allocation.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';

const router = Router();
// Device allocation routes (admin only)
router.post(
  '/',
  authMiddleware,
  adminOnly,
  deviceAllocationController.allocateDeviceToTeam.bind(deviceAllocationController),
);

router.delete(
  '/',
  authMiddleware,
  adminOnly,
  deviceAllocationController.deallocateDeviceFromTeam.bind(deviceAllocationController),
);

router.get(
  '/',
  authMiddleware,
  adminOnly,
  deviceAllocationController.getAllDeviceAllocations.bind(deviceAllocationController),
);

// Get device allocations for team
router.get(
  '/team/:teamId',
  authMiddleware,
  deviceAllocationController.getDeviceAllocationsForTeam.bind(deviceAllocationController),
);

// Get teams for device
router.get(
  '/device/:deviceUdid',
  authMiddleware,
  deviceAllocationController.getTeamsForDevice.bind(deviceAllocationController),
);

// Check if user has access to device
router.get(
  '/access/:deviceUdid',
  authMiddleware,
  deviceAllocationController.checkUserAccessToDevice.bind(deviceAllocationController),
);

// Get accessible devices for user
router.get(
  '/accessible',
  authMiddleware,
  deviceAllocationController.getAccessibleDevicesForUser.bind(deviceAllocationController),
);

export default router;
