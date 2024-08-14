import { exec } from 'child_process';
import path from 'path';
import util from 'util';
import fs from 'fs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Applesign from 'applesign';
import archiver from 'archiver';

const readdirAsync = util.promisify(fs.readdir);
const unlinkAsync = util.promisify(fs.unlink);
const statAsync = util.promisify(fs.stat);
const rmdirAsync = util.promisify(fs.rmdir);

const execAsync = util.promisify(exec);

const wdaBuildPath = '/appium_wda_ios/Build/Products/Debug-iphoneos';
async function findWebDriverAgentPath() {
  try {
    console.log('🔍 Searching for WebDriverAgent.xcodeproj...');
    const { stdout } = await execAsync('find $HOME/.appium -name WebDriverAgent.xcodeproj');
    const projectPath = stdout.trim();
    console.log('✅ Found WebDriverAgent.xcodeproj at:', projectPath);
    return path.dirname(projectPath);
  } catch (error) {
    console.error('❌ Error finding WebDriverAgent.xcodeproj:', error);
    process.exit(1);
  }
}

// 2. Run xcodebuild clean build-for-testing
async function buildWebDriverAgent(projectDir: string) {
  try {
    console.log('🏗️ Building WebDriverAgent...');
    const buildCommand =
      'xcodebuild clean build-for-testing -project WebDriverAgent.xcodeproj -derivedDataPath appium_wda_ios -scheme WebDriverAgentRunner -destination generic/platform=iOS CODE_SIGNING_ALLOWED=NO';
    await execAsync(buildCommand, { cwd: projectDir, maxBuffer: undefined });
    console.log('🎉 Successfully built WebDriverAgent!');
  } catch (error) {
    console.error('❌ Error building WebDriverAgent:', error);
    process.exit(1);
  }
}

// 3. Search for iPhoneos path inside "appium_wda_ios/Build/Products/"
async function findiPhoneosPath() {
  try {
    console.log('🔍 Searching for iPhoneos path...');
    const wdaPath = await findWebDriverAgentPath();
    const wdaApp = `${wdaPath}/${wdaBuildPath}/WebDriverAgentRunner-Runner.app`;
    console.log('✅ Found iPhoneos path:', wdaApp);
    return wdaApp;
  } catch (error) {
    console.error('❌ Error finding iPhoneos path:', error);
    process.exit(1);
  }
}

async function deleteFilesInDirectory(directoryPath: string) {
  try {
    const files = await readdirAsync(directoryPath);
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const fileStat = await statAsync(filePath);
      if (fileStat.isFile()) {
        console.log(`🗑️ Deleting file: ${filePath}`);
        await unlinkAsync(filePath);
      } else if (fileStat.isDirectory()) {
        console.log(`🗂️ Deleting directory: ${filePath}`);
        await deleteFilesInDirectory(filePath);
        await rmdirAsync(filePath);
      }
    }
    console.log('✅ All files and folders inside the directory have been deleted.');
  } catch (error) {
    console.error('❌ Error deleting files:', error);
    process.exit(1);
  }
}

async function createPayloadDirectory(path: string) {
  try {
    console.log('📁 Creating Payload directory...');
    console.log(`mkdir -p ${path}/Payload`);
    await execAsync(`mkdir -p ${path}/Payload`);
    console.log('✅ Payload directory created successfully.');
  } catch (error) {
    console.error('❌ Error creating Payload directory:', error);
    process.exit(1);
  }
}

// 2. Move the .app file into the Payload directory
async function moveAppFile(appFilePath: string, payloadPath: string) {
  try {
    console.log('🚚 Moving .app file to Payload directory...');
    const appFileName = path.basename(appFilePath);
    await execAsync(`mv ${appFilePath} ${payloadPath}/Payload`);
    console.log(`✅ Moved ${appFileName} to Payload directory.`);
  } catch (error) {
    console.error('❌ Error moving .app file:', error);
    process.exit(1);
  }
}

// 3. Zip the Payload directory
async function zipPayloadDirectory(outputZipPath: any, folderPath: any) {
  return new Promise<void>((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Zipped ${archive.pointer()} total bytes`);
      console.log(`Archive has been written to ${outputZipPath}`);
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

async function main() {
  try {
    const projectDir = await findWebDriverAgentPath();
    console.log('📁 WebDriverAgent project directory:', projectDir);
    await buildWebDriverAgent(projectDir);
    const iPhoneosPath = await findiPhoneosPath();
    console.log('📂 iPhoneos path found:', iPhoneosPath);
    await deleteFilesInDirectory(`${iPhoneosPath}/Frameworks`);
    await createPayloadDirectory(`${projectDir}${wdaBuildPath}`);
    await moveAppFile(iPhoneosPath, `${projectDir}${wdaBuildPath}`);

    await zipPayloadDirectory(
      `${projectDir}${wdaBuildPath}/wda-resign.zip`,
      `${projectDir}${wdaBuildPath}/Payload`,
    );
    const ipaToResign = `${projectDir}${wdaBuildPath}/wda-resign.zip`;
    if (process.env.MOBILE_PROVISION_PATH) {
      console.log('✅ Mobile provision file path provided');
      const as = new Applesign({
        mobileprovision: process.env.MOBILE_PROVISION_PATH,
        outfile: `${projectDir}${wdaBuildPath}/wda-resigned.ipa`,
      });
      await as.signIPA(ipaToResign);
      console.info(`✅ Successfully signed ${projectDir}${wdaBuildPath}/wda-resigned.ipa`);
    } else {
      console.error(
        '❌ Mobile provision file path not provided, Please set MOBILE_PROVISION_PATH in environment variables',
      );
    }
  } catch (error) {
    console.error('❌ An error occurred:', error);
  }
}

main();
