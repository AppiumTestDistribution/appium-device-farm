import fs from 'fs';
import path from 'path';
import os from 'os';
import ip from 'ip';
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
const availableIpAddresses = ifaceNames.map((device) => {
  return ifaces[device]!.find((iface) => iface.family === 'IPv4')?.address;
}).filter((ip) => ip !== undefined);

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
  bindHostOrIp: localIp
})


export const node_config: IPluginArgs = Object.assign({}, DefaultPluginArgs, {
  hub: `http://${hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}`,
  bindHostOrIp: alternateIp
})

export function ensureTempDir() {
  const tempDir = path.resolve(__dirname + '/../../temp-appium');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  return tempDir;
}

export function ensureAppiumHome(suffix = '', deleteExisting = true) {
  const newHome = path.resolve(path.join(__dirname, `/../../temp-appium`, suffix));
  if (!fs.existsSync(newHome)) {
    fs.mkdirSync(newHome);
  }
  // check if there's already extensions.yaml under node_modules/.cache/appium
  const extensionsYaml = path.join(newHome, 'node_modules', '.cache', 'appium', 'extensions.yaml');
  // log a warning as appium won't be able to install the plugin
  if (fs.existsSync(extensionsYaml)) {
    console.log(`WARNING: ${extensionsYaml} already exists. Appium won't be able to install the plugin`);
    if (deleteExisting) {
      console.log(`Deleting ${extensionsYaml}`);
      fs.unlinkSync(extensionsYaml);
    }
  }
  return newHome;
}

export function ensureHubConfig(platform = 'android') {
  const hub_config_file = ensureTempDir() + '/hub-config.json';
  const config = {
    "server": {
      "port": HUB_APPIUM_PORT,
      "plugin": {
        "device-farm": Object.assign(hub_config, {platform})
      }
    }
  }
  fs.writeFileSync(hub_config_file, JSON.stringify(config));
  return hub_config_file;
}

export function ensureNodeConfig(androidDeviceType: string = 'both', iosDeviceType: string = 'both') {
  const node_config_file = ensureTempDir() + '/node-config.json';
  fs.writeFileSync(node_config_file, JSON.stringify({
    "server": {
      "port": NODE_APPIUM_PORT,
      "plugin": {
        "device-farm": Object.assign(node_config, {androidDeviceType, iosDeviceType})
      }
    }
  }));
  return node_config_file;
}
