import ADB from 'appium-adb';

export async function getAdbOriginal() {
  return await ADB.createADB({
    sdkRoot: '/Users/saikrishna/Library/Android/sdk',
    udid: null,
    appDeviceReadyTimeout: null,
    useKeystore: null,
    keystorePath: null,
    keystorePassword: null,
    keyAlias: null,
    keyPassword: null,
    executable: {
      path: '/Users/saikrishna/Library/Android/sdk/platform-tools/adb',
      defaultArgs: [Array],
    },
    tmpDir: '/var/folders/fr/l_lyyktd2l3dq2yq3x3qdmbw0000gn/T',
    curDeviceId: null,
    emulatorPort: null,
    logcat: null,
    binaries: { adb: '/Users/saikrishna/Library/Android/sdk/platform-tools/adb' },
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
