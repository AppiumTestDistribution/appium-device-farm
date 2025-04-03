import { prisma } from '../../prisma';
import log from '../../logger';
import { ATDRepository } from '../../data-service/db';

/**
 * Device allocation service for handling device allocation operations
 */
export class DeviceAllocationService {
  /**
   * Allocate device to team
   */
  async allocateDeviceToTeam(deviceUdid: string, teamId: string) {
    try {
      // Check if team exists
      const team = await prisma.team.findUnique({
        where: { id: teamId },
      });

      if (!team) {
        throw new Error('Team not found');
      }

      // Check if device exists
      const deviceModel = await ATDRepository.DeviceModel;
      const devices = deviceModel.find({ udid: deviceUdid });

      if (devices.length === 0) {
        throw new Error('Device not found');
      }

      // Check if device is already allocated to this team
      const existingAllocation = await prisma.deviceAllocation.findFirst({
        where: {
          deviceUdid,
          teamId,
        },
      });

      if (existingAllocation) {
        throw new Error('Device is already allocated to this team');
      }

      // Allocate device to team
      const allocation = await prisma.deviceAllocation.create({
        data: {
          deviceUdid,
          teamId,
        },
        include: {
          team: true,
        },
      });

      return allocation;
    } catch (error) {
      log.error(`Error allocating device to team: ${error}`);
      throw error;
    }
  }

  /**
   * Deallocate device from team
   */
  async deallocateDeviceFromTeam(deviceUdid: string, teamId: string) {
    try {
      // Check if device is allocated to team
      const allocation = await prisma.deviceAllocation.findFirst({
        where: {
          deviceUdid,
          teamId,
        },
      });

      if (!allocation) {
        throw new Error('Device is not allocated to this team');
      }

      // Deallocate device from team
      await prisma.deviceAllocation.delete({
        where: {
          id: allocation.id,
        },
      });

      return { success: true };
    } catch (error) {
      log.error(`Error deallocating device from team: ${error}`);
      throw error;
    }
  }

  /**
   * Get all device allocations
   */
  async getAllDeviceAllocations() {
    try {
      const allocations = await prisma.deviceAllocation.findMany({
        include: {
          team: true,
        },
      });

      return allocations;
    } catch (error) {
      log.error(`Error getting device allocations: ${error}`);
      throw error;
    }
  }

  /**
   * Get device allocations for team
   */
  async getDeviceAllocationsForTeam(teamId: string) {
    try {
      const allocations = await prisma.deviceAllocation.findMany({
        where: {
          teamId,
        },
      });

      return allocations;
    } catch (error) {
      log.error(`Error getting device allocations for team: ${error}`);
      throw error;
    }
  }

  /**
   * Get teams for device
   */
  async getTeamsForDevice(deviceUdid: string) {
    try {
      const allocations = await prisma.deviceAllocation.findMany({
        where: {
          deviceUdid,
        },
        include: {
          team: true,
        },
      });

      return allocations.map((allocation) => allocation.team);
    } catch (error) {
      log.error(`Error getting teams for device: ${error}`);
      throw error;
    }
  }

  /**
   * Check if user has access to device
   */
  async userHasAccessToDevice(userId: string, deviceUdid: string) {
    try {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Admin users have access to all devices
      if (user.role === 'admin') {
        return true;
      }

      // Get teams for user
      const teamMembers = await prisma.teamMember.findMany({
        where: {
          userId,
        },
        select: {
          teamId: true,
        },
      });

      const teamIds = teamMembers.map((member) => member.teamId);

      // Check if any of the user's teams have access to the device
      const allocations = await prisma.deviceAllocation.findMany({
        where: {
          deviceUdid,
          teamId: {
            in: teamIds,
          },
        },
      });

      return allocations.length > 0;
    } catch (error) {
      log.error(`Error checking user access to device: ${error}`);
      throw error;
    }
  }

  /**
   * Get accessible devices for user
   */
  async getAccessibleDevicesForUser(userId: string) {
    try {
      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Admin users have access to all devices
      if (user.role === 'admin') {
        const deviceModel = await ATDRepository.DeviceModel;
        return deviceModel.find();
      }

      // Get teams for user
      const teamMembers = await prisma.teamMember.findMany({
        where: {
          userId,
        },
        select: {
          teamId: true,
        },
      });

      const teamIds = teamMembers.map((member) => member.teamId);

      // Get device allocations for user's teams
      const allocations = await prisma.deviceAllocation.findMany({
        where: {
          teamId: {
            in: teamIds,
          },
        },
        select: {
          deviceUdid: true,
        },
      });

      const deviceUdids = allocations.map((allocation) => allocation.deviceUdid);

      // Get devices
      const deviceModel = await ATDRepository.DeviceModel;
      return deviceModel.find({ udid: { $in: deviceUdids } });
    } catch (error) {
      log.error(`Error getting accessible devices for user: ${error}`);
      throw error;
    }
  }
}

export const deviceAllocationService = new DeviceAllocationService();
