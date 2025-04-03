import { Request, Response } from 'express';
import { deviceAllocationService } from '../services/device-allocation.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import log from '../../logger';

/**
 * Device allocation controller
 */
export class DeviceAllocationController {
  /**
   * Allocate device to team
   */
  async allocateDeviceToTeam(req: Request, res: Response) {
    try {
      const { deviceUdid, teamId } = req.body;

      if (!deviceUdid || !teamId) {
        return res.status(400).json({ message: 'Device UDID and Team ID are required' });
      }

      const allocation = await deviceAllocationService.allocateDeviceToTeam(deviceUdid, teamId);
      return res.status(201).json(allocation);
    } catch (error: any) {
      log.error(`Error allocating device to team: ${error}`);
      return res.status(400).json({ message: error.message || 'Error allocating device to team' });
    }
  }

  /**
   * Deallocate device from team
   */
  async deallocateDeviceFromTeam(req: Request, res: Response) {
    try {
      const { deviceUdid, teamId } = req.body;

      if (!deviceUdid || !teamId) {
        return res.status(400).json({ message: 'Device UDID and Team ID are required' });
      }

      await deviceAllocationService.deallocateDeviceFromTeam(deviceUdid, teamId);
      return res.status(200).json({ message: 'Device deallocated from team successfully' });
    } catch (error: any) {
      log.error(`Error deallocating device from team: ${error}`);
      return res
        .status(400)
        .json({ message: error.message || 'Error deallocating device from team' });
    }
  }

  /**
   * Get all device allocations
   */
  async getAllDeviceAllocations(req: Request, res: Response) {
    try {
      const allocations = await deviceAllocationService.getAllDeviceAllocations();
      return res.status(200).json(allocations);
    } catch (error: any) {
      log.error(`Error getting device allocations: ${error}`);
      return res.status(400).json({ message: error.message || 'Error getting device allocations' });
    }
  }

  /**
   * Get device allocations for team
   */
  async getDeviceAllocationsForTeam(req: Request, res: Response) {
    try {
      const { teamId } = req.params;

      if (!teamId) {
        return res.status(400).json({ message: 'Team ID is required' });
      }

      const allocations = await deviceAllocationService.getDeviceAllocationsForTeam(teamId);
      return res.status(200).json(allocations);
    } catch (error: any) {
      log.error(`Error getting device allocations for team: ${error}`);
      return res
        .status(400)
        .json({ message: error.message || 'Error getting device allocations for team' });
    }
  }

  /**
   * Get teams for device
   */
  async getTeamsForDevice(req: Request, res: Response) {
    try {
      const { deviceUdid } = req.params;

      if (!deviceUdid) {
        return res.status(400).json({ message: 'Device UDID is required' });
      }

      const teams = await deviceAllocationService.getTeamsForDevice(deviceUdid);
      return res.status(200).json(teams);
    } catch (error: any) {
      log.error(`Error getting teams for device: ${error}`);
      return res.status(400).json({ message: error.message || 'Error getting teams for device' });
    }
  }

  /**
   * Check if user has access to device
   */
  async checkUserAccessToDevice(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { deviceUdid } = req.params;

      if (!deviceUdid) {
        return res.status(400).json({ message: 'Device UDID is required' });
      }

      const hasAccess = await deviceAllocationService.userHasAccessToDevice(
        req.user.userId,
        deviceUdid,
      );
      return res.status(200).json({ hasAccess });
    } catch (error: any) {
      log.error(`Error checking user access to device: ${error}`);
      return res
        .status(400)
        .json({ message: error.message || 'Error checking user access to device' });
    }
  }

  /**
   * Get accessible devices for user
   */
  async getAccessibleDevicesForUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const devices = await deviceAllocationService.getAccessibleDevicesForUser(req.user.userId);
      return res.status(200).json(devices);
    } catch (error: any) {
      log.error(`Error getting accessible devices for user: ${error}`);
      return res
        .status(400)
        .json({ message: error.message || 'Error getting accessible devices for user' });
    }
  }
}

export const deviceAllocationController = new DeviceAllocationController();
