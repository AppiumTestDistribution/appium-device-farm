import { expect } from 'chai';
import { prisma } from '../../src/prisma';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { DevicePlugin } from '../../src/plugin';
import { IPluginArgs } from '../../src/interfaces/IPluginArgs';
import { setUtilizationTime } from '../../src/data-service/device-service';

describe('BigInt Migration - Integration Tests', () => {
  let testNodeId: string;
  let testDeviceIds: string[] = [];
  let testTeamId: string;
  let testUserId: string;
  let server: any;
  let baseUrl: string;
  let authToken: string;

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

    // Create a test admin user for API access
    const user = await prisma.user.create({
      data: {
        firstname: 'Test',
        lastname: 'Admin',
        username: `testadmin_${Date.now()}`,
        password: '$2b$10$rQZ8vKJ5X5X5X5X5X5X5Xe5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X', // bcrypt hash
        role: 'admin',
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

    // Note: For full integration tests, you would start the server here
    // For now, we'll test the database operations and serialization
    baseUrl = 'http://localhost:4723';
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

  describe('Database Operations with BigInt', () => {
    it('should store and retrieve large usage values correctly', async () => {
      const largeUsage = BigInt(2204418803); // Value that exceeds Int32 max
      const device = await createTestDevice(largeUsage);

      const retrievedDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      expect(retrievedDevice).to.exist;
      expect(retrievedDevice!.usage).to.be.instanceOf(BigInt);
      expect(retrievedDevice!.usage.toString()).to.equal('2204418803');
    });

    it('should update usage with large values', async () => {
      const device = await createTestDevice(0);
      const largeValue = 3000000000;

      await setUtilizationTime(device.id, largeValue);

      const updatedDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      expect(updatedDevice!.usage.toString()).to.equal(largeValue.toString());
    });

    it('should handle cumulative usage updates', async () => {
      const device = await createTestDevice(1000000000);

      // Simulate multiple usage updates
      await setUtilizationTime(device.id, 2000000000);
      await setUtilizationTime(device.id, 3000000000);
      await setUtilizationTime(device.id, 4000000000);

      const finalDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      expect(finalDevice!.usage.toString()).to.equal('4000000000');
    });

    it('should query devices with large usage values', async () => {
      await createTestDevice(BigInt(2204418803));
      await createTestDevice(BigInt(3000000000));
      await createTestDevice(BigInt(1000));

      const devices = await prisma.device.findMany({
        where: {
          id: { in: testDeviceIds },
        },
        orderBy: { usage: 'desc' },
      });

      expect(devices.length).to.equal(3);
      expect(devices[0].usage.toString()).to.equal('3000000000');
      expect(devices[1].usage.toString()).to.equal('2204418803');
      expect(devices[2].usage.toString()).to.equal('1000');
    });
  });

  describe('Serialization in API Responses', () => {
    it('should serialize BigInt to number in JSON responses', async () => {
      const largeUsage = BigInt(2500000000);
      const device = await createTestDevice(largeUsage);

      // Direct database query returns BigInt
      const dbDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });
      expect(dbDevice!.usage).to.be.instanceOf(BigInt);

      // Serialize manually (simulating API response)
      const serialized = {
        ...dbDevice,
        usage: Number(dbDevice!.usage),
      };

      expect(serialized.usage).to.be.a('number');
      expect(serialized.usage).to.equal(2500000000);
      expect(serialized.usage).to.not.be.instanceOf(BigInt);

      // Verify JSON serialization works
      const jsonString = JSON.stringify(serialized);
      const parsed = JSON.parse(jsonString);
      expect(parsed.usage).to.equal(2500000000);
      expect(typeof parsed.usage).to.equal('number');
    });

    it('should handle array serialization correctly', async () => {
      await createTestDevice(BigInt(1000000000));
      await createTestDevice(BigInt(2000000000));
      await createTestDevice(BigInt(3000000000));

      const devices = await prisma.device.findMany({
        where: { id: { in: testDeviceIds } },
      });

      const serialized = devices.map((d) => ({
        ...d,
        usage: Number(d.usage),
      }));

      expect(serialized.length).to.equal(3);
      serialized.forEach((device) => {
        expect(device.usage).to.be.a('number');
        expect(device.usage).to.not.be.instanceOf(BigInt);
      });

      // Verify JSON serialization
      const jsonString = JSON.stringify(serialized);
      const parsed = JSON.parse(jsonString);
      expect(parsed.length).to.equal(3);
      parsed.forEach((device: any) => {
        expect(typeof device.usage).to.equal('number');
      });
    });
  });

  describe('Team Device Relations with BigInt', () => {
    it('should serialize device usage in teamDevice relations', async () => {
      const largeUsage = BigInt(4000000000);
      const device = await createTestDevice(largeUsage);

      // Add device to team
      await prisma.teamDevice.create({
        data: {
          deviceId: device.id,
          teamId: testTeamId,
        },
      });

      const teamDevices = await prisma.teamDevice.findMany({
        where: { teamId: testTeamId },
        include: { device: true },
      });

      expect(teamDevices.length).to.equal(1);
      expect(teamDevices[0].device).to.exist;
      expect(teamDevices[0].device!.usage).to.be.instanceOf(BigInt);

      // Serialize
      const serialized = teamDevices.map((td) => ({
        ...td,
        device: td.device ? { ...td.device, usage: Number(td.device.usage) } : null,
      }));

      expect(serialized[0].device!.usage).to.be.a('number');
      expect(serialized[0].device!.usage).to.equal(4000000000);
    });
  });

  describe('Edge Cases and Boundary Values', () => {
    it('should handle Number.MAX_SAFE_INTEGER correctly', async () => {
      const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991
      const device = await createTestDevice(0);

      await setUtilizationTime(device.id, maxSafe);

      const updatedDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      expect(updatedDevice!.usage.toString()).to.equal(maxSafe.toString());

      // Verify serialization
      const serialized = Number(updatedDevice!.usage);
      expect(serialized).to.equal(maxSafe);
    });

    it('should handle values beyond Number.MAX_SAFE_INTEGER', async () => {
      // Use a value larger than MAX_SAFE_INTEGER but still reasonable
      const beyondMax = BigInt('9007199254740992'); // MAX_SAFE_INTEGER + 1
      const device = await createTestDevice(beyondMax);

      const retrievedDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      expect(retrievedDevice!.usage.toString()).to.equal('9007199254740992');

      // Serialization will lose precision, but should not crash
      const serialized = Number(retrievedDevice!.usage);
      expect(serialized).to.be.a('number');
      // Note: This may have precision loss, but that's expected for JS numbers
    });

    it('should handle zero and small values', async () => {
      const device1 = await createTestDevice(0);
      const device2 = await createTestDevice(100);

      const devices = await prisma.device.findMany({
        where: { id: { in: [device1.id, device2.id] } },
      });

      expect(devices[0].usage.toString()).to.equal('0');
      expect(devices[1].usage.toString()).to.equal('100');

      const serialized = devices.map((d) => ({
        ...d,
        usage: Number(d.usage),
      }));

      expect(serialized[0].usage).to.equal(0);
      expect(serialized[1].usage).to.equal(100);
    });
  });

  describe('Concurrent Updates', () => {
    it('should handle concurrent usage updates correctly', async () => {
      const device = await createTestDevice(1000000000);

      // Simulate concurrent updates
      const updates = [
        setUtilizationTime(device.id, 2000000000),
        setUtilizationTime(device.id, 3000000000),
        setUtilizationTime(device.id, 4000000000),
      ];

      await Promise.all(updates);

      const finalDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      // Last write should win (or we could test with transactions)
      expect(finalDevice!.usage.toString()).to.be.oneOf(['2000000000', '3000000000', '4000000000']);
    });
  });

  describe('Data Migration Compatibility', () => {
    it('should handle existing Int values after migration', async () => {
      // Simulate existing data that was stored as Int
      // SQLite INTEGER can store 64-bit values, so existing data should work
      const existingValue = 2147483647; // Max Int32 value
      const device = await createTestDevice(existingValue);

      const retrievedDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      expect(retrievedDevice!.usage.toString()).to.equal(existingValue.toString());

      // Update with larger value
      await setUtilizationTime(device.id, 2204418803);

      const updatedDevice = await prisma.device.findUnique({
        where: { id: device.id },
      });

      expect(updatedDevice!.usage.toString()).to.equal('2204418803');
    });
  });
});
