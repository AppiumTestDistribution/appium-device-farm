import { DevicePlugin } from './plugin';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { loadExternalModules, registerErrorHandlers } from './helpers';

//Add FFMPEG to path for appium to record video of the session
process.env.PATH = process.env.PATH + ':' + ffmpeg.path.replace(/ffmpeg$/g, '');
loadExternalModules();

registerErrorHandlers();

export default DevicePlugin;
export { DevicePlugin };
