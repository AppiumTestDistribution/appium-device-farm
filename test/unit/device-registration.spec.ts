import { expect } from 'chai';
import { ATDRepository } from '../../src/data-service/db';
import {
  addNewDevice,
  generateDeviceId,
  removeDevice,
} from '../../src/data-service/device-service';
import { IDevice } from '../../src/interfaces/IDevice';
import { prisma } from '../../src/prisma';

/**
 * Regression tests for https://github.com/AppiumTestDistribution/appium-device-farm/issues/2005
 *
 * When the plugin runs inside a docker container (`--network host`) and the container is
 * deleted and re-run with the same name/params, the container gets a NEW node id (the
 * metadata.json under DEVICE_FARM_HOME is regenerated) while the device udid and host
 * stay the same. Re-registering such a device used to INSERT a new row into the prisma
 * Device table, failing with "Unique constraint failed on the fields: (udid, host)".
 * Registration must instead update the existing row.
 */
describe('Device registration (issue #2005)', function () {
  const HOST = 'http://192.168.65.2:4723'; // same host on every container re-run (--network host)
  const UDID = 'emulator-5554';
  const NODE_ID_RUN_1 = 'docker-node-id-run-1';
  const NODE_ID_RUN_2 = 'docker-node-id-run-2';

  function buildDevice(nodeId: string, overrides: Partial<IDevice> = {}): IDevice {
    return {
      name: 'sdk_gphone_x86_64',
      udid: UDID,
      host: HOST,
      platform: 'android',
      deviceType: 'emulator',
      realDevice: false,
      sdk: '34',
      state: 'device',
      busy: false,
      offline: false,
      userBlocked: false,
      totalUtilizationTimeMilliSec: 0,
      sessionStartTime: 0,
      nodeId,
      ...overrides,
    } as unknown as IDevice;
  }

  async function prismaRowsForUdidHost() {
    return prisma.device.findMany({ where: { udid: UDID, host: HOST } });
  }

  async function lokiRowsForUdid() {
    return (await ATDRepository.DeviceModel).chain().find({ udid: UDID }).data();
  }

  before('Setup nodes and clean state', async () => {
    // the node row must exist in prisma because Device.nodeId references Node.id
    for (const nodeId of [NODE_ID_RUN_1, NODE_ID_RUN_2]) {
      await prisma.node.upsert({
        where: { id: nodeId },
        update: {},
        create: {
          id: nodeId,
          name: nodeId,
          host: HOST,
          os: 'linux',
          jwtSecretToken: 'secret',
          isHub: false,
          isOnline: true,
        },
      });
    }
    await prisma.device.deleteMany({ where: { udid: UDID, host: HOST } });
    (await ATDRepository.DeviceModel).removeDataOnly();
  });

  after('Clean up', async () => {
    await prisma.device.deleteMany({ where: { udid: UDID, host: HOST } });
    await prisma.node.deleteMany({ where: { id: { in: [NODE_ID_RUN_1, NODE_ID_RUN_2] } } });
    (await ATDRepository.DeviceModel).removeDataOnly();
    await prisma.$disconnect();
  });

  it('registers a device on first run (simulated first docker container)', async () => {
    const device = buildDevice(NODE_ID_RUN_1);
    const added = await addNewDevice([device], HOST);

    expect(added.length).to.be.equal(1);
    const rows = await prismaRowsForUdidHost();
    expect(rows.length).to.be.equal(1);
    expect(rows[0].nodeId).to.be.equal(NODE_ID_RUN_1);
    expect(rows[0].isActive).to.be.equal(true);
    expect(rows[0].id).to.be.equal(generateDeviceId({ ...device, id: undefined } as any));
    expect((await lokiRowsForUdid()).length).to.be.equal(1);
  });

  it('re-registering same udid+host with a new node id (recreated docker container) updates the row instead of failing with a unique constraint error', async () => {
    // second container run: same udid + host, but a new node id => new generated device id
    const device = buildDevice(NODE_ID_RUN_2);
    expect(generateDeviceId({ ...device, id: undefined } as any)).to.not.be.equal(
      generateDeviceId({ ...buildDevice(NODE_ID_RUN_1), id: undefined } as any),
    );

    let error: unknown;
    try {
      await addNewDevice([device], HOST);
    } catch (e) {
      error = e;
    }
    expect(error, `addNewDevice threw: ${error}`).to.be.undefined;

    // exactly one row, updated to the new node and active again
    const rows = await prismaRowsForUdidHost();
    expect(rows.length).to.be.equal(1);
    expect(rows[0].nodeId).to.be.equal(NODE_ID_RUN_2);
    expect(rows[0].isActive).to.be.equal(true);
    expect(rows[0].id).to.be.equal(generateDeviceId({ ...device, id: undefined } as any));

    // loki must not have a duplicate either
    const lokiRows = await lokiRowsForUdid();
    expect(lokiRows.length).to.be.equal(1);
    expect(lokiRows[0].nodeId).to.be.equal(NODE_ID_RUN_2);
  });

  it('re-registering an inactive (removed/offline) device with same udid+host reactivates the same row', async () => {
    // simulate the device going away: removeDevice marks the prisma row inactive
    await removeDevice([buildDevice(NODE_ID_RUN_2)]);
    let rows = await prismaRowsForUdidHost();
    expect(rows.length).to.be.equal(1);
    expect(rows[0].isActive).to.be.equal(false);

    // container is re-run again -> same udid+host, yet another new node id
    const NODE_ID_RUN_3 = 'docker-node-id-run-3';
    await prisma.node.upsert({
      where: { id: NODE_ID_RUN_3 },
      update: {},
      create: {
        id: NODE_ID_RUN_3,
        name: NODE_ID_RUN_3,
        host: HOST,
        os: 'linux',
        jwtSecretToken: 'secret',
        isHub: false,
        isOnline: true,
      },
    });

    await addNewDevice([buildDevice(NODE_ID_RUN_3)], HOST);

    rows = await prismaRowsForUdidHost();
    expect(rows.length).to.be.equal(1);
    expect(rows[0].isActive).to.be.equal(true);
    expect(rows[0].nodeId).to.be.equal(NODE_ID_RUN_3);

    await prisma.node.deleteMany({ where: { id: NODE_ID_RUN_3 } });
  });

  it('re-registration by the same node (periodic device list update) keeps runtime state and does not duplicate', async () => {
    // mark the device busy/booted in loki (e.g. session allocated, boot monitor ran)
    const deviceModel = await ATDRepository.DeviceModel;
    deviceModel
      .chain()
      .find({ udid: UDID, host: HOST })
      .update(function (d: IDevice) {
        d.busy = true;
        d.session_id = 'some-session-id';
        d.state = 'Booted';
      });

    // node posts its device list again (busy=false on the node side)
    await addNewDevice([buildDevice(NODE_ID_RUN_2, { busy: false })], HOST);

    const rows = await prismaRowsForUdidHost();
    expect(rows.length).to.be.equal(1);

    const lokiRows = await lokiRowsForUdid();
    expect(lokiRows.length).to.be.equal(1);
    // busy/session/state must be preserved, not reset by the re-registration
    // (the scanned device list can report a stale state like "Shutdown")
    expect(lokiRows[0].busy).to.be.equal(true);
    expect(lokiRows[0].session_id).to.be.equal('some-session-id');
    expect(lokiRows[0].state).to.be.equal('Booted');
  });

  it('handles concurrent registration of the same udid+host without a unique constraint error', async () => {
    const UDID_CONCURRENT = 'emulator-5556';
    const HOST2 = HOST;
    await prisma.device.deleteMany({ where: { udid: UDID_CONCURRENT, host: HOST2 } });

    const deviceA = buildDevice(NODE_ID_RUN_1, { udid: UDID_CONCURRENT });
    const deviceB = buildDevice(NODE_ID_RUN_2, { udid: UDID_CONCURRENT });

    const results = await Promise.allSettled([
      addNewDevice([deviceA], HOST2),
      addNewDevice([deviceB], HOST2),
    ]);
    for (const r of results) {
      expect(
        r.status,
        `concurrent addNewDevice rejected: ${r.status === 'rejected' ? r.reason : ''}`,
      ).to.be.equal('fulfilled');
    }

    const rows = await prisma.device.findMany({ where: { udid: UDID_CONCURRENT, host: HOST2 } });
    expect(rows.length).to.be.equal(1);

    await prisma.device.deleteMany({ where: { udid: UDID_CONCURRENT, host: HOST2 } });
  });
});
