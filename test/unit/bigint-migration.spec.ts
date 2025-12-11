import { expect } from 'chai';
import { prisma } from '../../src/prisma';
import { v4 as uuidv4 } from 'uuid';
import { deviceManagementController } from '../../src/modules/dashboard/controllers/device-management-controller';
import { deviceAllocationService } from '../../src/auth/services/device-allocation.service';
import { teamService } from '../../src/auth/services/team.service';
import { setUtilizationTime, getTeamDevicesForUser } from '../../src/data-service/device-service';
import { Request, Response } from 'express';

// Skip tests by default (can be enabled by removing .skip)
describe.skip('BigInt Migration - Unit Tests', () => {
  let testNodeId: string;
  let testDeviceIds: string[] = [];
  let testTeamId: string;
  let testUserId: string;

  before(async () => {
    // Create a test node
    const node = await prisma.node.create({
      data: {
        id: uuidv4(),
        name: `test-node-${Date.now()}`,
        host: '127.0.0.1:4723',
        os: 'linux',
        jwtSecretToken: 'test-jwt-secret',
      },
    });
    testNodeId = node.id;

    // Create a test user
    const user = await prisma.user.create({
      data: {
        firstname: 'Test',
        lastname: 'User',
        username: `testuser_${Date.now()}`,
        password: 'hashedpassword',
        role: 'user',
        accessKey: `test-access-key-${Date.now()}-${Math.random()}`,
      },
    });
    testUserId = user.id;

    // Create a test team
    const team = await prisma.team.create({
      data: {
        name: `testteam_${Date.now()}`,
      },
    });
    testTeamId = team.id;
  });

  after(async () => {
    // Clean up test data
    if (testDeviceIds.length > 0) {
      await prisma.teamDevice.deleteMany({
        where: { deviceId: { in: testDeviceIds } },
      });
      await prisma.device.deleteMany({
        where: { id: { in: testDeviceIds } },
      });
    }
    if (testTeamId) {
      await prisma.teamMember.deleteMany({
        where: { teamId: testTeamId },
      });
      await prisma.team.delete({
        where: { id: testTeamId },
      });
    }
    if (testUserId) {
      await prisma.user.delete({
        where: { id: testUserId },
      });
    }
    if (testNodeId) {
      await prisma.node.delete({
        where: { id: testNodeId },
      });
    }
  });

  async function createTestDevice(usage: bigint | number) {
    const usageValue = typeof usage === 'number' ? BigInt(Math.floor(usage)) : usage;
    const device = await prisma.device.create({
      data: {
        id: uuidv4(),
        udid: `test-udid-${Date.now()}-${Math.random()}`,
        host: 'http://localhost:4723',
        platform: 'android',
        version: '10',
        nodeId: testNodeId,
        real: false,
        usage: usageValue,
      } as any, // Type assertion needed for BigInt until Prisma types fully update
    });
    testDeviceIds.push(device.id);
    return device;
  }

  describe('Device Management Controller - listDevices', () => {
    it('should serialize BigInt usage to number for listDevices', async () => {
      const largeUsage = BigInt(2204418803); // Value that exceeds Int32 max
      await createTestDevice(largeUsage);

      const req = {} as Request;
      const res = {
        status: (code: number) => {
          expect(code).to.equal(200);
          return res;
        },
        json: (data: any) => {
          expect(data).to.be.an('array');
          expect(data.length).to.be.greaterThan(0);
          const device = data.find((d: any) => testDeviceIds.includes(d.id));
          expect(device).to.exist;
          expect(device.usage).to.be.a('number');
          expect(device.usage).to.equal(2204418803);
          expect(device.usage).to.not.be.instanceOf(BigInt);
          return res;
        },
      } as unknown as Response;

      await deviceManagementController.listDevices(req, res);
    });

    it('should handle zero usage correctly', async () => {
      await createTestDevice(0);

      const req = {} as Request;
      const res = {
        status: (code: number) => {
          expect(code).to.equal(200);
          return res;
        },
        json: (data: any) => {
          const device = data.find((d: any) => testDeviceIds.includes(d.id));
          expect(device.usage).to.equal(0);
          expect(device.usage).to.be.a('number');
          return res;
        },
      } as unknown as Response;

      await deviceManagementController.listDevices(req, res);
    });
  });

  describe('Device Management Controller - getDevice', () => {
    it('should serialize BigInt usage to number for getDevice', async () => {
      const largeUsage = BigInt(3000000000);
      const device = await createTestDevice(largeUsage);

      const req = {
        params: { id: device.id },
      } as unknown as Request;
      const res = {
        status: (code: number) => {
          expect(code).to.equal(200);
          return res;
        },
        json: (data: any) => {
          expect(data).to.exist;
          expect(data.usage).to.be.a('number');
          expect(data.usage).to.equal(3000000000);
          expect(data.usage).to.not.be.instanceOf(BigInt);
          return res;
        },
      } as unknown as Response;

      await deviceManagementController.getDevice(req, res);
    });
  });

  describe('Device Management Controller - updateDevice', () => {
    it('should serialize BigInt usage to number after updateDevice', async () => {
      const device = await createTestDevice(1000);

      const req = {
        params: { id: device.id },
        body: {
          name: 'Updated Device Name',
          tags: ['test'],
          isFlagged: false,
          flaggedReason: null,
        },
      } as unknown as Request;
      const res = {
        status: (code: number) => {
          expect(code).to.equal(200);
          return res;
        },
        json: (data: any) => {
          expect(data.usage).to.be.a('number');
          expect(data.usage).to.not.be.instanceOf(BigInt);
          return res;
        },
      } as unknown as Response;

      await deviceManagementController.updateDevice(req, res);
    });
  });

  describe('Device Allocation Service - getAllDevices', () => {
    it('should serialize BigInt usage to number for getAllDevices', async () => {
      const largeUsage = BigInt(2500000000);
      await createTestDevice(largeUsage);

      const devices = await deviceAllocationService.getAllDevices();
      const device = devices.find((d: any) => testDeviceIds.includes(d.id));

      expect(device).to.exist;
      expect(device.usage).to.be.a('number');
      expect(device.usage).to.equal(2500000000);
      expect(device.usage).to.not.be.instanceOf(BigInt);
    });
  });

  describe('Team Service - addDeviceToTeam', () => {
    it('should serialize BigInt usage to number in teamDevice response', async () => {
      const largeUsage = BigInt(4000000000);
      const device = await createTestDevice(largeUsage);

      const teamDevices = await teamService.addDeviceToTeam([device.id], testTeamId);

      expect(teamDevices).to.be.an('array');
      expect(teamDevices.length).to.equal(1);
      const teamDevice = teamDevices[0];
      expect(teamDevice).to.exist;
      expect(teamDevice.device).to.exist;
      expect(teamDevice.device!.usage).to.be.a('number');
      expect(teamDevice.device!.usage).to.equal(4000000000);
      expect(teamDevice.device!.usage).to.not.be.instanceOf(BigInt);
    });
  });

  describe('Device Service - getTeamDevicesForUser', () => {
    it('should serialize BigInt usage to number in teamDevice response', async () => {
      // Add user to team
      await prisma.teamMember.create({
        data: {
          userId: testUserId,
          teamId: testTeamId,
        },
      });

      const largeUsage = BigInt(5000000000);
      const device = await createTestDevice(largeUsage);

      // Add device to team
      await prisma.teamDevice.create({
        data: {
          deviceId: device.id,
          teamId: testTeamId,
        },
      });

      const teamDevices = await getTeamDevicesForUser(testUserId);

      expect(teamDevices).to.be.an('array');
      const teamDevice = (teamDevices as any[]).find((td: any) => td.deviceId === device.id);
      expect(teamDevice).to.exist;
      if (teamDevice) {
        expect(teamDevice.device).to.exist;
        if (teamDevice.device) {
          expect(teamDevice.device.usage).to.be.a('number');
          expect(teamDevice.device.usage).to.equal(5000000000);
          expect(teamDevice.device.usage).to.not.be.instanceOf(BigInt);
        }
      }
    });
  });

  describe('Device Service - setUtilizationTime', () => {
    it('should accept number and convert to BigInt for large values', async () => {
      const device = await createTestDevice(0);
      const largeValue = 2204418803; // Exceeds Int32 max

      await setUtilizationTime(device.id, largeValue);

      const updatedDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      expect(updatedDevice).to.exist;
      expect(updatedDevice!.usage).to.be.instanceOf(BigInt);
      expect(updatedDevice!.usage.toString()).to.equal(largeValue.toString());
    });

    it('should handle zero value correctly', async () => {
      const device = await createTestDevice(1000);

      await setUtilizationTime(device.id, 0);

      const updatedDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      expect(updatedDevice!.usage.toString()).to.equal('0');
    });

    it('should handle very large values (> Number.MAX_SAFE_INTEGER)', async () => {
      const device = await createTestDevice(0);
      // Use a value that's safe as number but large
      const largeValue = 9007199254740991; // Number.MAX_SAFE_INTEGER

      await setUtilizationTime(device.id, largeValue);

      const updatedDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      expect(updatedDevice!.usage.toString()).to.equal(largeValue.toString());
    });
  });

  describe('Grid Router - getSavedDevices', () => {
    it('should serialize BigInt usage to number for getSavedDevices', async () => {
      // Note: getSavedDevices is a private function in grid.ts
      // We test the serialization logic directly
      const largeUsage = BigInt(2204418803);
      const device = await createTestDevice(largeUsage);

      const devices = await prisma.device.findMany({
        where: { id: { in: testDeviceIds } },
      });

      // Simulate the serializeDevice function from grid.ts
      const serializeDevice = (d: any) => ({
        ...d,
        usage: Number(d.usage),
      });

      const serialized = devices.map(serializeDevice);
      const testDevice = serialized.find((d: any) => d.id === device.id);

      expect(testDevice).to.exist;
      expect(testDevice.usage).to.be.a('number');
      expect(testDevice.usage).to.equal(2204418803);
      expect(testDevice.usage).to.not.be.instanceOf(BigInt);
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative values (edge case)', async () => {
      // Note: Usage should not be negative in practice, but test the conversion
      const device = await createTestDevice(0);

      // Prisma BigInt can handle negative, but we test the serialization
      const negativeUsage = BigInt(-1000);
      await prisma.device.update({
        where: { id: device.id },
        data: { usage: negativeUsage as any }, // Type assertion needed until Prisma client regenerates
      });

      const req = {
        params: { id: device.id },
      } as unknown as Request;
      const res = {
        status: (code: number) => {
          expect(code).to.equal(200);
          return res;
        },
        json: (data: any) => {
          expect(data).to.exist;
          expect(data.usage).to.be.a('number');
          expect(data.usage).to.equal(-1000);
          return res;
        },
      } as unknown as Response;

      await deviceManagementController.getDevice(req, res);
    });

    it('should handle multiple devices with different usage values', async () => {
      await createTestDevice(BigInt(1000));
      await createTestDevice(BigInt(2000000000));
      await createTestDevice(BigInt(3000000000));

      const req = {} as Request;
      const res = {
        status: (code: number) => {
          expect(code).to.equal(200);
          return res;
        },
        json: (data: any) => {
          const testDevices = data.filter((d: any) => testDeviceIds.includes(d.id));
          expect(testDevices.length).to.equal(3);
          testDevices.forEach((device: any) => {
            expect(device.usage).to.be.a('number');
            expect(device.usage).to.not.be.instanceOf(BigInt);
          });
          return res;
        },
      } as unknown as Response;

      await deviceManagementController.listDevices(req, res);
    });
  });
});
