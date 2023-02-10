// eslint-disable-next-line @typescript-eslint/no-var-requires
import NodeDevices from '../../src/device-managers/NodeDevices';

var chai = require('chai'),
  // eslint-disable-next-line no-unused-vars
  should = chai.should();
import axios from 'axios';

describe('Basic Plugin Test', () => {
  it('Basic Plugin test', async () => {
    (await axios.get('http://localhost:31337/device-farm/api/devices')).status.should.eql(200);
  });

  it('Add Android devices from node to hub', async () => {
    const nodeAndroidDevice = [
      {
        adbRemoteHost: null,
        adbPort: 5039,
        systemPort: 58296,
        sdk: '13',
        realDevice: false,
        name: 'sdk_gphone64_arm64',
        busy: false,
        state: 'device',
        udid: 'emulator-5551',
        platform: 'android',
        deviceType: 'emulator',
        host: 'http://127.2.1.41:4723',
        totalUtilizationTimeMilliSec: 7023014,
        sessionStartTime: 0,
      },
    ];
    let nodeDevices = new NodeDevices('http://localhost:31337');
    await nodeDevices.postDevicesToHub(nodeAndroidDevice, 'add');
    const devices = (await axios.get('http://localhost:31337/device-farm/api/devices')).data;
    devices.find((d) => d.udid === 'emulator-5551').should.to.be.an('object');
    nodeAndroidDevice[0].udid = 'emulator-5552';
    await nodeDevices.postDevicesToHub(nodeAndroidDevice, 'add');
    const updatedDeviceList = (await axios.get('http://localhost:31337/device-farm/api/devices'))
      .data;
    updatedDeviceList.should.have.lengthOf(2);
    updatedDeviceList.find((d) => d.udid === 'emulator-5552').should.to.be.an('object');
  });

  // Needs a fix
  it.skip('Remove Android devices from node to hub', async () => {
    const nodeAndroidDevice = [
      {
        adbRemoteHost: null,
        adbPort: 5039,
        systemPort: 58296,
        sdk: '13',
        realDevice: false,
        name: 'sdk_gphone64_arm64',
        busy: false,
        state: 'device',
        udid: 'emulator-5551',
        platform: 'android',
        deviceType: 'emulator',
        host: 'http://127.2.1.41:4723',
        totalUtilizationTimeMilliSec: 7023014,
        sessionStartTime: 0,
      },
    ];
    let nodeDevices = new NodeDevices('http://localhost:31337');
    await nodeDevices.postDevicesToHub(nodeAndroidDevice, 'add');
    const devices = (await axios.get('http://localhost:31337/device-farm/api/devices')).data;
    devices.find((d) => d.udid === 'emulator-5551').should.to.be.an('object');
    nodeAndroidDevice[0].udid = 'emulator-5552';
    await nodeDevices.postDevicesToHub(nodeAndroidDevice, 'add');
    const updatedDeviceList = (await axios.get('http://localhost:31337/device-farm/api/devices'))
      .data;
    updatedDeviceList.should.have.lengthOf(2);
    updatedDeviceList.find((d) => d.udid === 'emulator-5552').should.to.be.an('object');
  });
});
