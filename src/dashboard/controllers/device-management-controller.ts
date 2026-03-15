import { Request, Response } from 'express';
import { prisma } from '../../prisma';
import { updateDeviceDetails } from '../../data-service/device-service';

function serializeDevice(device: any) {
  return {
    ...device,
    usage: Number(device.usage),
  };
}

export class DeviceManagementController {
  async listDevices(req: Request, res: Response) {
    try {
      const devices = await prisma.device.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json(devices.map(serializeDevice));
    } catch (error) {
      return res.status(500).json({ error: true, message: 'Failed to fetch devices' });
    }
  }

  async getDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const device = await prisma.device.findUnique({
        where: { id },
      });

      if (!device) {
        return res.status(404).json({ error: true, message: 'Device not found' });
      }

      return res.status(200).json(serializeDevice(device));
    } catch (error) {
      return res.status(500).json({ error: true, message: 'Failed to fetch device' });
    }
  }

  async updateDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, tags, isFlagged, flaggedReason } = req.body;

      const device = await prisma.device.update({
        where: { id },
        data: {
          name,
          tags,
          isFlagged,
          flaggedReason,
        },
      });

      await updateDeviceDetails();

      return res.status(200).json(serializeDevice(device));
    } catch (error) {
      return res.status(500).json({ error: true, message: 'Failed to update device' });
    }
  }

  async deleteDevice(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await prisma.device.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Device deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: true, message: 'Failed to delete device' });
    }
  }
}

export const deviceManagementController = new DeviceManagementController();
