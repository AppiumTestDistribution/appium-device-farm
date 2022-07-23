const APPIUM_HOST = '127.0.0.1';
const APPIUM_PORT = 4723;
export const WDIO_PARAMS = {
  connectionRetryCount: 0,
  hostname: APPIUM_HOST,
  port: APPIUM_PORT,
  path: '/wd/hub/',
  logLevel: 'silent',
};

export const androidCapabilities = {
  platformName: 'Android',
  'appium:uiautomator2ServerInstallTimeout': '50000',
  'appium:automationName': 'UIAutomator2',
  'appium:app': './demo-app/VodQA.apk',
};

export const iOSCapabilities = {
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:iPhoneOnly': true,
  'appium:app': '/Users/saikrisv/Downloads/vodqa.zip',
};
