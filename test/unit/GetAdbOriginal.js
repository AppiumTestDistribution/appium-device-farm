import ADB from 'appium-adb';

export async function getAdbOriginal() {
  return await ADB.createADB({
    udid: null,
    appDeviceReadyTimeout: null,
    useKeystore: null,
    keystorePath: null,
    keystorePassword: null,
    keyAlias: null,
    keyPassword: null,
    curDeviceId: null,
    emulatorPort: null,
    logcat: null,
    instrumentProc: null,
    suppressKillServer: null,
    jars: {},
    adbPort: 5037,
    adbHost: null,
    adbExecTimeout: 20000,
    remoteAppsCacheLimit: 10,
    buildToolsVersion: null,
    allowOfflineDevices: false,
    allowDelayAdb: true,
  });
}
