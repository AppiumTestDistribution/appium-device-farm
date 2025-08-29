import { exec } from 'child_process';
import path from 'path';
import util from 'util';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Applesign from 'applesign';
import archiver from 'archiver';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import Listr, { ListrContext } from 'listr';
import { provision } from 'ios-mobileprovision-finder';
import os from 'os';
import { Observable, Subscriber } from 'rxjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { select } from '@inquirer/prompts';

const execAsync = util.promisify(exec);
const WDA_BUILD_PATH = '/appium_wda_ios/Build/Products/Debug-iphoneos';
let bundleIdName: { uuid: string; name: string }[] | null = null;
let freeBundleID: { uuid: string; name: string } | null = null;

async function getXcodeMajorVersion(): Promise<number> {
  const { stdout } = await execAsync('xcodebuild -version');
  const match = stdout.match(/Xcode (\d+)\./);
  if (!match) {
    throw new Error('Unable to determine Xcode version');
  }
  return parseInt(match[1], 10);
}

async function getProvisioningProfilePath(): Promise<string> {
  const xcodeVersion = await getXcodeMajorVersion();

  if (xcodeVersion <= 15) {
    return path.join(os.homedir(), 'Library/MobileDevice/Provisioning Profiles');
  } else {
    return path.join(os.homedir(), 'Library/Developer/Xcode/UserData/Provisioning Profiles');
  }
}

type Context = ListrContext & CliOptions;

interface CliOptions {
  mobileProvisioningFile?: string;
  wdaProjectPath?: string;
  platform?: string;
}

const getOptions = async () => {
  const argv: CliOptions = await yargs(hideBin(process.argv)).options({
    'mobile-provisioning-file': {
      desc: 'Path to the mobile provisioning file which is used to sign the webdriver agent',
      type: 'string',
    },
    'wda-project-path': {
      desc: 'Path to webdriver agent xcode project',
      type: 'string',
    },
    'platform': {
      desc: 'Platform type: ios, tvos, or both (default: ios)',
      type: 'string',
      choices: ['ios', 'tvos', 'both'],
      default: 'ios',
    },
  }).argv;

  return {
    mobileProvisioningFile: argv.mobileProvisioningFile,
    wdaProjectPath: argv.wdaProjectPath,
    platform: argv.platform,
  };
};

const getMobileProvisioningFile = async (mobileProvisioningFile?: string) => {
  if (mobileProvisioningFile) {
    if (!fs.existsSync(mobileProvisioningFile) || !fs.statSync(mobileProvisioningFile).isFile()) {
      throw new Error(`Mobile provisioning file ${mobileProvisioningFile} does not exists`);
    }
    return mobileProvisioningFile;
  } else {
    const provisionFileDir = await getProvisioningProfilePath();

    if (!fs.existsSync(provisionFileDir)) {
      throw new Error(`Provisioning directory does not exist: ${provisionFileDir}`);
    }

    const files = fs
      .readdirSync(provisionFileDir, { encoding: 'utf8' })
      .filter((file) => file.endsWith('.mobileprovision'));

    const provisioningFiles = files.map((file) => {
      const fullPath = path.join(provisionFileDir, file);
      const mp = provision.readFromFile(fullPath);
      return { ...mp, _filePath: fullPath };
    });

    if (!provisioningFiles || !provisioningFiles.length) {
      throw new Error('No mobileprovision file found on the machine');
    }
    const prompt = await select({
      message: 'Select the mobileprovision to use for signing',
      choices: provisioningFiles.map((file) => ({
        value: file.UUID,
        name: `${file.Name.split(':')[1] || file.Name} (Team: ${file.TeamName}) (${file.UUID})`,
      })),
    });

    const isFreeAccount = await select({
      message: 'Is this a free or enterprise account provisioning profile?',
      choices: [
        { value: true, name: 'Free Account' },
        { value: false, name: 'Enterprise Account' },
      ],
    });
    if (isFreeAccount) {
      bundleIdName = provisioningFiles.map((file) => {
        return { uuid: file.UUID, name: `${file.Name.split(':')[1] || file.Name}` };
      });
    }
    freeBundleID =
      bundleIdName?.find((d: any) => {
        return d.uuid === prompt;
      }) || null;

    return path.join(await getProvisioningProfilePath(), `${prompt}.mobileprovision`);
  }
};

const getWdaProject = async (wdaProjectPath?: string) => {
  if (wdaProjectPath) {
    if (!fs.existsSync(wdaProjectPath) || !fs.statSync(wdaProjectPath).isDirectory()) {
      throw new Error(`Unable to find webdriver agent project in path ${wdaProjectPath}`);
    }
    return wdaProjectPath;
  }

  try {
    const { stdout } = await execAsync('find $HOME/.appium -name WebDriverAgent.xcodeproj');
    return path.dirname(stdout.trim().split('\n')[0]);
  } catch (err) {
    throw new Error('Unable to find WebDriverAgent project');
  }
};

/* Task definintions */
async function buildWebDriverAgent(projectDir: string, logger: any) {
  try {
    const buildCommand =
      'xcodebuild clean build-for-testing -project WebDriverAgent.xcodeproj -derivedDataPath appium_wda_ios -scheme WebDriverAgentRunner -destination generic/platform=iOS CODE_SIGNING_ALLOWED=NO';
    logger(buildCommand);
    await execAsync(buildCommand, { cwd: projectDir, maxBuffer: undefined });
    return `${projectDir}/${WDA_BUILD_PATH}/WebDriverAgentRunner-Runner.app`;
  } catch (error) {
    console.log(error);
    throw new Error(`❌ Error building WebDriverAgent: ${(error as any)?.message}`);
  }
}

async function zipPayloadDirectory(
  outputZipPath: any,
  folderPath: any,
  observer: Subscriber<string>,
) {
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      observer.next(`Zipped ${archive.pointer()} total bytes`);
      observer.next(`Archive has been written to ${outputZipPath}`);
      resolve();
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);
    archive.directory(folderPath, 'Payload');
    archive.finalize();
  });
}

(async () => {
  const cliOptions = await getOptions();
  const mobileProvisioningFile = await getMobileProvisioningFile(cliOptions.mobileProvisioningFile);

  const tasks = new Listr(
    [
      {
        title: '🔍 Searching for WebDriverAgent.xcodeproj',
        task: async (context: Context, task) => {
          context.wdaProjectPath = await getWdaProject(cliOptions.wdaProjectPath);
          task.title = `Found WebDriverAgent.xcodeproj at: ${context.wdaProjectPath}`;
        },
      },
      {
        title: '🏗️ Building WebDriverAgent',
        task: (context: Context, task) => {
          return new Observable((observer) => {
            buildWebDriverAgent(context.wdaProjectPath, observer.next.bind(observer)).then(
              (wdaAppPath) => {
                context.wdaAppPath = wdaAppPath;
                task.title = 'Successfully built WebDriverAgent';
                observer.complete();
              },
            );
          });
        },
      },
      {
        title: 'Preparing webdrivergaent ipa',
        task: (context) => {
          return new Observable((observer) => {
            const wdaBuildPath = path.join(context.wdaProjectPath, WDA_BUILD_PATH);
            const payloadDirectory = path.join(wdaBuildPath, 'Payload');
            observer.next('Removing framework directory');
            fs.readdirSync(`${context.wdaAppPath}/Frameworks`).forEach((f) =>
              fs.rmSync(`${context.wdaAppPath}/Frameworks/${f}`, { recursive: true }),
            );

            observer.next('Creating Payload directory');
            execAsync(`mkdir -p ${payloadDirectory}`)
              .then(() => {
                observer.next('Payload directory created successfully');
              })
              .then(() => {
                observer.next('🚚 Moving .app file to Payload directory...');
                return execAsync(`mv ${context.wdaAppPath} ${payloadDirectory}`);
              })
              .then(() => {
                observer.next('Packing Payload directory...');
                return zipPayloadDirectory(
                  `${wdaBuildPath}/wda-resign.zip`,
                  payloadDirectory,
                  observer,
                );
              })
              .then(() => observer.complete());
          });
        },
      },
      {
        title: 'Signing WebDriverAgent ipa',
        task: async (context, task) => {
          const wdaBuildPath = path.join(context.wdaProjectPath, WDA_BUILD_PATH);
          
          if (cliOptions.platform === 'both') {
            // Hem iOS hem tvOS için dosya oluştur
            const platforms = ['ios', 'tvos'];
            const results = [];
            
            for (const platform of platforms) {
              const wdaFileName = platform === 'tvos' ? 'wda-resign_tvos.ipa' : 'wda-resign.ipa';
              const ipaPath = `${wdaBuildPath}/${wdaFileName}`;
              
              let appleOptions: any;
              if (freeBundleID) {
                appleOptions = {
                  mobileprovision: mobileProvisioningFile,
                  outfile: ipaPath,
                  bundleId: freeBundleID.name.replace(/^\s+|\s+$/g, ''),
                };
              } else {
                appleOptions = {
                  mobileprovision: mobileProvisioningFile,
                  outfile: ipaPath,
                };
              }
              
              const as = new Applesign(appleOptions);
              await as.signIPA(path.join(wdaBuildPath, 'wda-resign.zip'));
              results.push(`${platform}: ${ipaPath}`);
            }
            
            task.title = `Successfully signed WebDriverAgent files for both platforms: ${results.join(', ')}`;
          } else {
            // Tek platform için dosya oluştur
            const wdaFileName = cliOptions.platform === 'tvos' ? 'wda-resign_tvos.ipa' : 'wda-resign.ipa';
            const ipaPath = `${wdaBuildPath}/${wdaFileName}`;

            let appleOptions: any;
            if (freeBundleID) {
              appleOptions = {
                mobileprovision: mobileProvisioningFile,
                outfile: ipaPath,
                bundleId: freeBundleID.name.replace(/^\s+|\s+$/g, ''),
              };
            } else {
              appleOptions = {
                mobileprovision: mobileProvisioningFile,
                outfile: ipaPath,
              };
            }
            const as = new Applesign(appleOptions);
            await as.signIPA(path.join(wdaBuildPath, 'wda-resign.zip'));
            task.title = `Successfully signed WebDriverAgent file for ${cliOptions.platform}: ${ipaPath}`;
          }
        },
      },
    ],
    { exitOnError: true },
  );
  await tasks.run();
})();
