import { DevicePlugin } from './plugin';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { loadExternalModules, registerErrorHandlers } from './helpers';
import { setDefaultResultOrder } from 'dns';
import { config, getServerMetadata } from './config';
setDefaultResultOrder('ipv4first');

//Add FFMPEG to path for appium to record video of the session
config.serverMetadata = getServerMetadata();
process.env.PATH = process.env.PATH + ':' + ffmpeg.path.replace(/ffmpeg$/g, '');
loadExternalModules();

registerErrorHandlers();

export default DevicePlugin;
export { DevicePlugin };
