import { getDevice } from '../../src/data-service/device-service'
import { DeviceModel } from '../../src/data-service/db';
import { expect } from 'chai';

describe('Get device', () => {
    before('Set devices in memory', () => {
        const devices = [
            {
                "sdk": "10",
                "realDevice": false,
                "name": "sdk_gphone_x86",
                "busy": false,
                "state": "device",
                "udid": "emulator-5554",
                "platform": "android",
                "deviceType": "emulator",
                "offline": false
            },
            {
                "sdk": "11",
                "realDevice": false,
                "name": "sdk_gphone_x86",
                "busy": false,
                "state": "device",
                "udid": "emulator-5556",
                "platform": "android",
                "deviceType": "emulator",
                "offline": false
            },
            {
                "name": "iPhone SE (2nd generation)",
                "udid": "F6A28560-7D0C-4EE9-8E1D-C1A70A350434",
                "state": "Shutdown",
                "sdk": "13.0",
                "platform": "ios",
                "busy": false,
                "offline": false,
                "realDevice": false,
                "deviceType": "simulator"
            },
            {
                "name": "iPhone 11 Pro Max",
                "udid": "F44B044A-CBC3-4F9A-96B9-448899FEDD46",
                "state": "Shutdown",
                "sdk": "14.0",
                "platform": "ios",
                "busy": false,
                "offline": false,
                "realDevice": false,
                "deviceType": "simulator"
            },
            {
                "name": "iPhone 11 Pro",
                "udid": "18E788F1-92BC-4F91-B5F5-3858B2164088",
                "state": "Shutdown",
                "sdk": "15.0",
                "platform": "ios",
                "busy": false,
                "offline": false,
                "realDevice": false,
                "deviceType": "simulator"
            }
        ];

        devices.forEach(function (device) {
            DeviceModel.insert({
              ...device
            });
        });
    });
  
    it('Get android device based on filter with minSDK', () => {
        const filterOptions = { "platform": "android", "name": "", "busy": false, "offline": false, "minSDK": 10.8 };
        const device = getDevice(filterOptions);
        expect(parseFloat(device.sdk)).to.be.gte(10.8)
    });

    it('Get ios simulator based on filter with minSDK', () => {
        const filterOptions = { "platform": "ios","name": "", "busy": false, "offline": false, "minSDK": 14.1 };
        const device = getDevice(filterOptions);
        expect(parseFloat(device.sdk)).to.be.gte(14.1)
    });
  
})