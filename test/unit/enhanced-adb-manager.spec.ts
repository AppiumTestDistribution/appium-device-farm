import { expect } from 'chai';
import {
  EnhancedADBManager,
  enhancedADBManager,
  ADBContext,
} from '../../src/utils/enhanced-adb-manager';
import { ADB } from 'appium-adb';
import * as sinon from 'sinon';

describe('EnhancedADBManager', () => {
  let sandbox: sinon.SinonSandbox;
  let mockADB: sinon.SinonStubbedInstance<ADB>;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    mockADB = sandbox.createStubInstance(ADB);

    // Mock ADB.createADB to return our stubbed instance
    sandbox.stub(ADB, 'createADB').resolves(mockADB as any);
  });

  afterEach(async () => {
    sandbox.restore();
    // Reset the singleton instance for each test
    await EnhancedADBManager.getInstance().reset();
    // Also reset the exported enhancedADBManager by creating a new instance
    (require('../../src/utils/enhanced-adb-manager') as any).enhancedADBManager =
      EnhancedADBManager.getInstance();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance when called multiple times', () => {
      const instance1 = EnhancedADBManager.getInstance();
      const instance2 = EnhancedADBManager.getInstance();

      expect(instance1).to.equal(instance2);
    });

    it('should return the same instance as the exported singleton', () => {
      const instance1 = EnhancedADBManager.getInstance();
      const instance2 = enhancedADBManager;

      expect(instance1).to.equal(instance2);
    });
  });

  describe('Local ADB Management', () => {
    it('should initialize local ADB instance only once', async () => {
      const manager = EnhancedADBManager.getInstance();

      // First initialization
      const adb1 = await manager.initializeLocalADB({ adbExecTimeout: 60000 });

      // Second initialization should return the same instance
      const adb2 = await manager.initializeLocalADB({ adbExecTimeout: 80000 });

      expect(adb1).to.equal(adb2);
      expect(ADB.createADB).to.have.been.calledOnce;
    });

    it('should handle concurrent local ADB initialization calls', async () => {
      const manager = EnhancedADBManager.getInstance();

      // Start multiple concurrent initializations
      const promises = [
        manager.initializeLocalADB({ adbExecTimeout: 60000 }),
        manager.initializeLocalADB({ adbExecTimeout: 80000 }),
        manager.initializeLocalADB({ adbExecTimeout: 100000 }),
      ];

      const results = await Promise.all(promises);

      // All should return the same instance
      results.forEach((result) => {
        expect(result).to.equal(results[0]);
      });

      // ADB.createADB should only be called once
      expect(ADB.createADB).to.have.been.calledOnce;
    });

    it('should handle local ADB initialization errors', async () => {
      const manager = EnhancedADBManager.getInstance();
      const error = new Error('ADB creation failed');

      (ADB.createADB as sinon.SinonStub).rejects(error);

      try {
        await manager.initializeLocalADB({ adbExecTimeout: 60000 });
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('should check local ADB initialization status correctly', async () => {
      const manager = EnhancedADBManager.getInstance();

      expect(manager.isLocalADBInitialized()).to.be.false;

      await manager.initializeLocalADB({ adbExecTimeout: 60000 });

      expect(manager.isLocalADBInitialized()).to.be.true;
    });

    it('should get local ADB instance synchronously', async () => {
      const manager = EnhancedADBManager.getInstance();

      expect(manager.getLocalADBInstance()).to.be.null;

      await manager.initializeLocalADB({ adbExecTimeout: 60000 });

      const adb = manager.getLocalADBInstance();
      expect(adb).to.equal(mockADB);
    });
  });

  describe('Remote ADB Management', () => {
    it('should create remote ADB instances for different hosts', async () => {
      const manager = EnhancedADBManager.getInstance();

      const adb1 = await manager.getRemoteADB('192.168.1.100', 5037);
      const adb2 = await manager.getRemoteADB('192.168.1.101', 5037);

      expect(adb1).to.equal(mockADB);
      expect(adb2).to.equal(mockADB);
      expect(ADB.createADB).to.have.been.calledTwice;
    });

    it('should reuse remote ADB instances for the same host', async () => {
      const manager = EnhancedADBManager.getInstance();

      const adb1 = await manager.getRemoteADB('192.168.1.100', 5037);
      const adb2 = await manager.getRemoteADB('192.168.1.100', 5037);

      expect(adb1).to.equal(adb2);
      expect(ADB.createADB).to.have.been.calledOnce;
    });

    it('should handle remote ADB creation errors', async () => {
      const manager = EnhancedADBManager.getInstance();
      const error = new Error('Remote ADB connection failed');

      (ADB.createADB as sinon.SinonStub).rejects(error);

      try {
        await manager.getRemoteADB('192.168.1.100', 5037);
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect(err).to.equal(error);
      }
    });

    it('should implement LRU cache for remote ADB instances', async () => {
      const manager = EnhancedADBManager.getInstance();

      // Set max remote instances to 2 for testing
      (manager as any).maxRemoteInstances = 2;

      // Create 3 remote ADB instances
      await manager.getRemoteADB('192.168.1.100', 5037);
      await manager.getRemoteADB('192.168.1.101', 5037);
      await manager.getRemoteADB('192.168.1.102', 5037);

      // The first instance should be evicted
      const activeInstances = manager.getActiveADBInstances();
      expect(activeInstances.remote).to.not.include('192.168.1.100:5037');
      expect(activeInstances.remote).to.include('192.168.1.101:5037');
      expect(activeInstances.remote).to.include('192.168.1.102:5037');
    });
  });

  describe('Device-Specific ADB Management', () => {
    it('should create device-specific ADB instances for different devices', async () => {
      const manager = EnhancedADBManager.getInstance();

      const adb1 = await manager.getDeviceSpecificADB('device1');
      const adb2 = await manager.getDeviceSpecificADB('device2');

      expect(adb1).to.equal(mockADB);
      expect(adb2).to.equal(mockADB);
      expect(ADB.createADB).to.have.been.calledTwice;
    });

    it('should reuse device-specific ADB instances for the same device', async () => {
      const manager = EnhancedADBManager.getInstance();

      const adb1 = await manager.getDeviceSpecificADB('device1');
      const adb2 = await manager.getDeviceSpecificADB('device1');

      expect(adb1).to.equal(adb2);
      expect(ADB.createADB).to.have.been.calledOnce;
    });

    it('should implement LRU cache for device-specific ADB instances', async () => {
      const manager = EnhancedADBManager.getInstance();

      // Set max device-specific instances to 2 for testing
      (manager as any).maxDeviceSpecificInstances = 2;

      // Create 3 device-specific ADB instances
      await manager.getDeviceSpecificADB('device1');
      await manager.getDeviceSpecificADB('device2');
      await manager.getDeviceSpecificADB('device3');

      // The first instance should be evicted
      const activeInstances = manager.getActiveADBInstances();
      expect(activeInstances.deviceSpecific).to.not.include('device1');
      expect(activeInstances.deviceSpecific).to.include('device2');
      expect(activeInstances.deviceSpecific).to.include('device3');
    });
  });

  describe('Context-Aware ADB Management', () => {
    it('should get local ADB for local context', async () => {
      const manager = EnhancedADBManager.getInstance();
      const context: ADBContext = { type: 'local' };

      const adb = await manager.getADBForContext(context);

      expect(adb).to.equal(mockADB);
      expect(ADB.createADB).to.have.been.calledOnce;
    });

    it('should get remote ADB for remote context', async () => {
      const manager = EnhancedADBManager.getInstance();
      const context: ADBContext = {
        type: 'remote',
        host: '192.168.1.100',
        port: 5037,
      };

      const adb = await manager.getADBForContext(context);

      expect(adb).to.equal(mockADB);
      expect(ADB.createADB).to.have.been.calledOnce;
    });

    it('should get device-specific ADB for device-specific context', async () => {
      const manager = EnhancedADBManager.getInstance();
      const context: ADBContext = {
        type: 'device-specific',
        deviceId: 'device1',
      };

      const adb = await manager.getADBForContext(context);

      expect(adb).to.equal(mockADB);
      expect(ADB.createADB).to.have.been.calledOnce;
    });

    it('should throw error for invalid context', async () => {
      const manager = EnhancedADBManager.getInstance();
      const context: ADBContext = { type: 'remote' }; // Missing host and port

      try {
        await manager.getADBForContext(context);
        expect.fail('Should have thrown an error');
      } catch (err) {
        expect((err as Error).message).to.include('Remote context requires host and port');
      }
    });
  });

  describe('Backward Compatibility', () => {
    it('should get device-specific ADB when udid is provided', async () => {
      const manager = EnhancedADBManager.getInstance();

      const adb = await manager.getADBForDevice('device1');

      expect(adb).to.equal(mockADB);
      expect(ADB.createADB).to.have.been.calledOnce;
    });

    it('should get local ADB when udid is not provided', async () => {
      const manager = EnhancedADBManager.getInstance();

      const adb = await manager.getADBForDevice();

      expect(adb).to.equal(mockADB);
      expect(ADB.createADB).to.have.been.calledOnce;
    });
  });

  describe('Cleanup and Management', () => {
    it('should cleanup all ADB instances', async () => {
      const manager = EnhancedADBManager.getInstance();

      // Create various ADB instances
      await manager.initializeLocalADB();
      await manager.getRemoteADB('192.168.1.100', 5037);
      await manager.getDeviceSpecificADB('device1');

      // Verify instances exist
      let activeInstances = manager.getActiveADBInstances();
      expect(activeInstances.local).to.not.be.null;
      expect(activeInstances.remote).to.have.length(1);
      expect(activeInstances.deviceSpecific).to.have.length(1);

      // Cleanup
      await manager.cleanup();

      // Verify instances are cleaned up
      activeInstances = manager.getActiveADBInstances();
      expect(activeInstances.local).to.be.null;
      expect(activeInstances.remote).to.have.length(0);
      expect(activeInstances.deviceSpecific).to.have.length(0);
    });

    it('should reset the manager completely', async () => {
      const manager1 = EnhancedADBManager.getInstance();
      await manager1.initializeLocalADB();

      await manager1.reset();

      const manager2 = EnhancedADBManager.getInstance();
      expect(manager1).to.not.equal(manager2);
      expect(manager2.isLocalADBInitialized()).to.be.false;
    });
  });

  describe('Active Instances Tracking', () => {
    it('should track all active ADB instances', async () => {
      const manager = EnhancedADBManager.getInstance();

      // Create various ADB instances
      await manager.initializeLocalADB();
      await manager.getRemoteADB('192.168.1.100', 5037);
      await manager.getRemoteADB('192.168.1.101', 5037);
      await manager.getDeviceSpecificADB('device1');
      await manager.getDeviceSpecificADB('device2');

      const activeInstances = manager.getActiveADBInstances();

      expect(activeInstances.local).to.not.be.null;
      expect(activeInstances.remote).to.have.length(2);
      expect(activeInstances.remote).to.include('192.168.1.100:5037');
      expect(activeInstances.remote).to.include('192.168.1.101:5037');
      expect(activeInstances.deviceSpecific).to.have.length(2);
      expect(activeInstances.deviceSpecific).to.include('device1');
      expect(activeInstances.deviceSpecific).to.include('device2');
    });
  });
});
