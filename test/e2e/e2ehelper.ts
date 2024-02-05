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

export const default_hub_config: IPluginArgs = Object.assign({}, DefaultPluginArgs, {
  hub: undefined,
  bindHostOrIp: localIp,
});

export const default_node_config: IPluginArgs = Object.assign({}, DefaultPluginArgs, {
  hub: `http://${default_hub_config.bindHostOrIp}:${HUB_APPIUM_PORT}`,
  bindHostOrIp: alternateIp,
});

function ensureTempDir() {
  const tempDir = path.resolve(__dirname + '/../../temp-appium');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  return tempDir;
}

function ensureAppiumHome(suffix = '', deleteExisting = true) {
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

function ensureHubConfig(moreConfig: Partial<IPluginArgs> = {}, configPrefix = 'hub') {
  const finalConfig = Object.assign({}, default_hub_config, moreConfig);

  // make sure there's no hub defined
  delete finalConfig.hub;

  return ensureConfig(`${configPrefix}-config.json`, {
    server: {
      port: HUB_APPIUM_PORT,
      plugin: {
        'device-farm': finalConfig,
      },
    },
  });
}

function ensureNodeConfig(moreConfig: Partial<IPluginArgs> = {}, configPrefix = 'node') {
  const finalConfig = Object.assign({}, default_node_config, moreConfig);

  // bail when hub is not defined
  if (!finalConfig.hub) {
    throw new Error('Hub is not defined in node config');
  }

  return ensureConfig(`${configPrefix}-config.json`, {
    server: {
      port: NODE_APPIUM_PORT,
      plugin: {
        'device-farm': finalConfig,
      },
    },
  });
}

function ensureConfig(filename: string, config: any) {
  const config_file = ensureTempDir() + '/' + filename;
  // delete existing config file
  if (fs.existsSync(config_file)) fs.unlinkSync(config_file);
  fs.writeFileSync(config_file, JSON.stringify(config));
  return config_file;
}

function configReader(config_file: string) {
  const config = JSON.parse(fs.readFileSync(config_file, 'utf8'));
  return config.server.plugin['device-farm'];
}

// wait until condition is true or timeout
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeoutMs: number,
  intervalMs: number = 1000,
) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    console.log(`Waiting for condition to be true`);
    if (await condition()) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  throw new Error(`Timeout waiting for condition`);
}

export { ensureHubConfig, ensureNodeConfig, ensureAppiumHome, ensureTempDir, configReader };
