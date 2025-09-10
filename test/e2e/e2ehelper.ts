import fs from 'fs';
import ip from 'ip';
import os from 'os';
import path from 'path';
import { DefaultPluginArgs, IPluginArgs } from '../../src/interfaces/IPluginArgs';

const ifaces = os.networkInterfaces();
/**
 {
  lo0: [
    {
      address: '127.0.0.1',
      netmask: '255.0.0.0',
      family: 'IPv4',
      mac: '00:00:00:00:00:00',
      internal: true,
      cidr: '127.0.0.1/8'
    }
  ]
}
 */

const localIp = ip.address();
const ifaceNames = Object.keys(ifaces);

// find first ip address coming from device other than localIp
const availableIpAddresses = ifaceNames
  .map((device) => {
    return ifaces[device]!.find((iface) => iface.family === 'IPv4')?.address;
  })
  .filter((ip) => ip !== undefined);

// find first ip address coming from device other than localIp

let alternateIp: string | undefined = availableIpAddresses.find((ip) => ip !== localIp);

if (alternateIp === undefined) alternateIp = localIp;

console.log(`Using localIp: ${localIp}`);
console.log(`Using alternateIp: ${alternateIp}`);

export const HUB_APPIUM_PORT = 4723;
export const NODE_APPIUM_PORT = 4724;
export const PLUGIN_PATH = path.resolve(__dirname + '/../..');

export const hub_config: IPluginArgs = Object.assign({}, DefaultPluginArgs, {
  hub: undefined,
  bindHostOrIp: localIp,
});

export const node_config: IPluginArgs = Object.assign({}, DefaultPluginArgs, {
  hub: `http://${hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}`,
  bindHostOrIp: alternateIp,
});

export function ensureTempDir() {
  const tempDir = path.resolve(__dirname + '/../../temp-appium');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  return tempDir;
}

export function ensureAppiumHome(suffix = '', deleteExisting = true) {
  const newHome = path.resolve(path.join(__dirname, '/../../temp-appium', suffix));
  if (!fs.existsSync(newHome)) {
    fs.mkdirSync(newHome);
  }
  // check if there's already extensions.yaml under node_modules/.cache/appium
  const extensionsYaml = path.join(newHome, 'node_modules', '.cache', 'appium', 'extensions.yaml');
  // log a warning as appium won't be able to install the plugin
  if (fs.existsSync(extensionsYaml)) {
    console.log(
      `WARNING: ${extensionsYaml} already exists. Appium won't be able to install the plugin`,
    );
    if (deleteExisting) {
      console.log(`Deleting ${extensionsYaml}`);
      fs.unlinkSync(extensionsYaml);
    }
  }
  return newHome;
}

export function ensureHubConfig(
  platform: 'android' | 'ios' | 'both' | 'none' = 'android',
  iosDeviceType: 'real' | 'simulated' | 'both' = 'both',
  androidDeviceType: 'real' | 'simulated' | 'both' = 'both',
  moreConfig: Partial<IPluginArgs> = {},
) {
  return ensureConfig('hub-config.json', {
    server: {
      port: HUB_APPIUM_PORT,
      plugin: {
        'device-farm': Object.assign(
          {
            platform,
            androidDeviceType,
            iosDeviceType,
          },
          moreConfig,
        ),
      },
    },
  });
}

export function ensureNodeConfig(
  platform: 'android' | 'ios' | 'both' = 'android',
  iosDeviceType: 'real' | 'simulated' | 'both' = 'both',
  androidDeviceType: 'real' | 'simulated' | 'both' = 'both',
  moreConfig: Partial<IPluginArgs> = {},
) {
  return ensureConfig('node-config.json', {
    server: {
      port: NODE_APPIUM_PORT,
      plugin: {
        'device-farm': Object.assign(node_config, {
          platform,
          androidDeviceType,
          iosDeviceType,
        }),
      },
    },
  });
}

function ensureConfig(filename: string, config: any) {
  const config_file = ensureTempDir() + '/' + filename;
  fs.writeFileSync(config_file, JSON.stringify(config));
  return config_file;
}
