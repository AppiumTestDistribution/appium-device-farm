import fs from 'fs';
import path from 'path';
import ip from 'ip';
import { DefaultPluginArgs } from '../../src/interfaces/IPluginArgs';

export const HUB_APPIUM_PORT = 4723;
export const NODE_APPIUM_PORT = 4724;
export const PLUGIN_PATH = path.resolve(__dirname + '/../..');

const hub_config = DefaultPluginArgs;
const node_config = Object.assign(DefaultPluginArgs, {
  hub: `http://${ip.address()}:${HUB_APPIUM_PORT}`,
});

export function ensureTempDir() {
  const tempDir = path.resolve(__dirname + '/../../temp-appium');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  return tempDir;
}

export function ensureAppiumHome() {
  const APPIUM_HOME = path.resolve(__dirname + '/../../temp-appium');
  if (!fs.existsSync(APPIUM_HOME)) {
    fs.mkdirSync(APPIUM_HOME);
  }
  return APPIUM_HOME;
}

export function ensureHubConfig() {
  const hub_config_file = ensureTempDir() + '/hub-config.json';
  fs.writeFileSync(
    hub_config_file,
    JSON.stringify({
      server: {
        port: HUB_APPIUM_PORT,
        plugin: {
          'device-farm': hub_config,
        },
      },
    }),
  );
  return hub_config_file;
}

export function ensureNodeConfig() {
  const node_config_file = ensureTempDir() + '/node-config.json';
  fs.writeFileSync(
    node_config_file,
    JSON.stringify({
      server: {
        port: NODE_APPIUM_PORT,
        plugin: {
          'device-farm': node_config,
        },
      },
    }),
  );
  return node_config_file;
}
