// eslint-disable-next-line @typescript-eslint/no-var-requires
const { config } = require('./wdio.base.conf');
const path = require('path');

const host = 'localhost';
const port = 4723;
// const deviceVersion = process.env.ANDROID_VERSION || '8.1'
// const commandTimeout = 30000
const appiumPath = path.join(__dirname, '../node_modules/.bin', 'appium');
const appPath = path.join(__dirname, '../../../apps', 'android-demo-app.apk');
console.log(appiumPath);

const droidConf = {
  ...config,
  services: [
    [
      'appium',
      {
        command: appiumPath,
        basePath: '/wd/hub',
        args: {
          debugLogSpacing: true,
          logLevel: 'info',
          log: './appium.txt',
          '--use-plugins': 'device-farm',
          '--plugin-device-farm-platform': 'android',
        },
      },
    ],
  ],
  hostname: host,
  port: port,
  specs: ['./e2e/android/conf.spec.js'],
  capabilities: [
    {
      platformName: 'Android',
      'appium:uiautomator2ServerInstallTimeout': '50000',
      'appium:automationName': 'UIAutomator2',
      'appium:app': '/Users/saikrisv/Downloads/VodQA.apk',
    },
  ],
};

exports.config = droidConf;
