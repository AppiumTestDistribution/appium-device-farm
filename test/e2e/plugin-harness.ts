import { fs as appiumFs } from 'appium/support';
import { main as appiumServer } from 'appium';
import getPort from 'get-port';
import { info, success, warning } from 'log-symbols';
import { exec } from 'teen_process';
import { AppiumEnv } from 'appium/types';
import { AppiumServer, ServerArgs } from '@appium/types';
import path from 'path';
import yaml from 'js-yaml';
import fs from 'fs';
import ip from 'ip';
import find from 'find-process';
import waitUntil from 'async-wait-until';

type PluginHarnessServerArgs = { subcommand: string; configFile: string };

type E2ESetupOpts = {
  appiumHome?: string;
  before: Mocha.HookFunction | undefined;
  after: Mocha.HookFunction;
  configFile?: string;
  driverSource: import('appium/types').InstallType & string;
  driverPackage?: string;
  driverName: string;
  driverSpec: string;
  pluginSource: import('appium/types').InstallType & string;
  pluginPackage?: string;
  pluginSpec: string;
  pluginName: string;
  port: number;
  host: string;
  appiumLogFile?: string;
};

/**
 * Creates hooks to install a driver and a plugin and starts an Appium server w/ the given extensions.
 * @param {E2ESetupOpts} opts
 * @returns {void}
 */
export function pluginE2EHarness(opts: E2ESetupOpts & { enableGoIos?: boolean }) {
  let {
    appiumHome,
    before,
    after,
    configFile,
    driverSource,
    driverPackage,
    driverName,
    driverSpec,
    pluginSource,
    pluginPackage,
    pluginSpec,
    pluginName,
    port,
    host,
    enableGoIos,
    appiumLogFile,
  } = opts;

  let server: AppiumServer;

  async function goIosPath() {
    const appium_path = path.dirname(require.resolve('appium'));
    console.log(`${info} appium_path: ${appium_path}`);
    const node_modules_root = (await exec('npm', ['root', '-g'])).stdout.trim();
    console.log(`${info} node_modules_root: ${node_modules_root}`);
    const platform_name = process.platform;
    const arch_name = process.arch;
    const go_ios_dir = path.join(node_modules_root, 'go-ios');
    // find ios binary matching platform name
    let go_ios_bin = fs.readdirSync(go_ios_dir, { recursive: true }).find((item) => {
      console.log(`${info} item: ${item}`);
      return item.includes(platform_name);
    });
    console.log(`${info} platform: ${platform_name} arch: ${arch_name} go_ios_bin: ${go_ios_bin}`);
    if (!go_ios_bin) {
      // throw new Error(`go-ios binary not found for platform ${platform_name}`);
      go_ios_bin = '';
      console.log(`${warning} go-ios binary not found for platform ${platform_name}`);
    }
    const full_path = path.join(go_ios_dir, go_ios_bin.toString(), 'ios');
    return full_path;
  }

  // return appium binary path based on APPIUM_HOME
  function getAppiumBin(): string {
    return require.resolve('appium');
  }

  async function startPlugin() {
    const setupAppiumHome = async () => {
      /**
       * @type {AppiumEnv}
       */
      const env = { ...process.env };

      if (appiumHome) {
        env.APPIUM_HOME = appiumHome;
        //env.HOME = appiumHome;
        await appiumFs.mkdirp(appiumHome);
        console.log(`${info} Set \`APPIUM_HOME\` to ${appiumHome}`);
      }

      // find go_ios from npm
      if (!!enableGoIos) env.GO_IOS = await goIosPath();

      return env;
    };

    /**
     *
     * @param {AppiumEnv} env
     */
    const installDriver = async (env: AppiumEnv) => {
      const APPIUM_BIN = getAppiumBin();
      console.log(`${info} Checking if driver "${driverName}" is installed...`);
      const driverListArgs = [APPIUM_BIN, 'driver', 'list', '--json'];
      console.log(`${info} Running: ${process.execPath} ${driverListArgs.join(' ')}`);
      const { stdout: driverListJson } = await exec(process.execPath, driverListArgs, {
        env,
      });
      const installedDrivers = JSON.parse(driverListJson);

      if (!installedDrivers[driverName]?.installed) {
        console.log(`${warning} Driver "${driverName}" not installed; installing...`);
        const driverArgs = [APPIUM_BIN, 'driver', 'install', '--source', driverSource, driverSpec];
        if (driverPackage) {
          driverArgs.push('--package', driverPackage);
        }
        console.log(`${info} Running: ${process.execPath} ${driverArgs.join(' ')}`);
        await exec(process.execPath, driverArgs, {
          env,
        });
      }
      console.log(`${success} Installed driver "${driverName}"`);
    };

    async function removePluginFromExtensionsYaml(env: AppiumEnv) {
      const extensionsYaml = path.join(
        env.APPIUM_HOME!,
        'node_modules',
        '.cache',
        'appium',
        'extensions.yaml',
      );
      console.log(`${info} Removing plugin "${pluginName}" from ${extensionsYaml}`);
      const extensions = yaml.load(fs.readFileSync(extensionsYaml, 'utf8')) as any;
      delete extensions.plugins[pluginName];
      console.log(`${info} Writing back to ${extensionsYaml}`);
      fs.writeFileSync(extensionsYaml, yaml.dump(extensions));
    }

    /**
     *
     * @param {AppiumEnv} env
     */
    const installPlugin = async (env: AppiumEnv) => {
      /*const availablePlugins = await installedPluginsByAppiumCommands(env);
            console.log(`${info} Available plugins: ${JSON.stringify(Object.keys(availablePlugins), null, 2)}`);
            const installedPlugins = Object.keys(availablePlugins).map((item) => availablePlugins[item]).filter((p: any) => p.installed);
            console.log(`${info} Installed plugin: ${JSON.stringify(installedPlugins, null, 2)}`);
            */

      // same plugin maybe installed via different source: npm or local
      // we don't care, just remove it and write it back to the file
      await removePluginFromExtensionsYaml(env);

      // installing our version of plugin
      const pluginArgs = [
        getAppiumBin(),
        'plugin',
        'install',
        '--source',
        pluginSource,
        pluginSpec,
      ];

      // only aplicable for npm
      if (pluginPackage) {
        pluginArgs.push('--package', pluginPackage);
      }

      console.log(`${info} Installing plugin: ${process.execPath} ${pluginArgs.join(' ')}`);
      await exec(process.execPath, pluginArgs, { env });
      console.log(`${success} Installed plugin "${pluginName}"`);
    };

    const createServer = async () => {
      if (!port) {
        port = await getPort();
      }
      console.log(`${info} Will use port ${port} for Appium server`);

      // here we are using CLI (instead of AppiumServer) to prevent schema conflicts
      await runAppiumServerFromCli(env, [pluginName], [driverName], configFile);
      // use axios to wait until port is returning 200 OK
      console.log(`${info} Waiting for Appium server to be ready...`);
    };

    async function runAppiumServerFromCli(
      env: AppiumEnv,
      usePlugins: string[] = [],
      useDrivers: string[] = [],
      configFile = '',
    ) {
      /**
             example:
             appium server -ka 800 \
                --use-plugins=device-farm,appium-dashboard  \
                --relaxed-security \
                --allow-insecure chromedriver_autodownload,execute_driver_script,adb_shell \
                --config ./hub-config.json \
                -pa /wd/hub
             */
      const APPIUM_BIN = getAppiumBin();
      const serverArgs = [APPIUM_BIN, 'server', '-ka', '800'];
      if (usePlugins.length > 0) {
        serverArgs.push(`--use-plugins=${usePlugins.join(',')}`);
      }
      if (useDrivers.length > 0) {
        serverArgs.push(`--use-drivers=${useDrivers.join(',')}`);
      }
      if (configFile) {
        serverArgs.push(`--config=${configFile}`);
      }
      if (appiumLogFile) {
        serverArgs.push(`--log=${appiumLogFile}`);
      }
      console.log(`APPIUM_HOME=${env.APPIUM_HOME} GO_IOS=${env.GO_IOS}`);
      console.log(`${info} Running: ${process.execPath} ${serverArgs.join(' ')}`);

      exec(process.execPath, serverArgs, {
        env,
      });

      return waitServer(host ?? ip.address(), port ?? 4723, 60);
    }

    // Use axios to hit appium endpoint until it returns 200 OK
    async function waitServer(host: string, port: number, timeoutSeconds: number) {
      const axios = require('axios');
      // const basePath = serverArgs.basePath || '';
      const url = `http://${host}:${port}/status`;
      const timeout = timeoutSeconds * 1000;
      const start = Date.now();
      while (Date.now() - start < timeout) {
        try {
          await axios.get(url);
          return;
        } catch (ign: any) {
          // ignore
          console.log(`${info} url: ${url} error: ${ign.message}`);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      throw new Error(`Appium server did not start after ${timeoutSeconds} seconds`);
    }

    const env = await setupAppiumHome();
    await installDriver(env);
    await installPlugin(env);
    await createServer();
  }

  async function stopPlugin() {
    console.log(`${info} Stopping plugin "${pluginName}"`);

    // find process with name "appium" and the right config param argument, and wait until exit
    await waitUntil(
      async () => {
        const processes = await find('name', 'appium');
        console.log(`${info} Found ${processes.length} appium processes`);
        const myProcess = processes.find((p: any) => {
          return p.cmd.includes(`--config=${configFile}`);
        });
        console.log(`myProcess: ${JSON.stringify(myProcess, null, 2)}`);

        // send SIGTERM to the process
        if (myProcess) {
          process.kill(myProcess.pid, 'SIGTERM');
        }
        return myProcess === undefined;
      },
      60000,
      1000,
    );
  }

  // clean it after test
  after(stopPlugin);

  // have an option to start the plugin before the test manually
  // this is useful to start multiple plugins in a single test
  if (before) {
    console.log("Adding plugin startup into mocha's before hook");
    before(startPlugin);
  } else {
    console.log(`Please start plugin ${pluginName} manually using "startPlugin()" function`);
  }

  return {
    startPlugin,
    stopPlugin,
  };
}
