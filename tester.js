// import * as DevicePlugin from './lib/bundle';

// console.log(DevicePlugin);

(async () => {
  const DevicePlugin = await import(
    '/Users/sselvarj/Documents/git/oss/appium-device-farm/lib/src/main.js'
  );
  console.log(DevicePlugin);

  // const DevicePlugin1 = await import(
  //   '/Users/sselvarj/Documents/git/oss/appium-device-farm/lib/src/index.js'
  // );
  // console.log(DevicePlugin1);
})();
