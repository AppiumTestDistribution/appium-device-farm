import { DevicePlugin } from './plugin';
import { path as ffmpeg } from '@ffmpeg-installer/ffmpeg';
import { loadExternalModules } from './helpers';

//Add FFMPEG to path for appium to record video of the session
process.env.PATH = process.env.PATH + ':' + ffmpeg.replace(/ffmpeg$/g, '');
loadExternalModules();

export default DevicePlugin;
export { DevicePlugin };
