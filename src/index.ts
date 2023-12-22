import { DevicePlugin } from './+';
import { path as ffmpeg } from '@ffmpeg-installer/ffmpeg';

//Add FFMPEG to path for appium to record video of the session
process.env.PATH = process.env.PATH + ':' + ffmpeg.replace(/ffmpeg$/g, '');

export default DevicePlugin;
export { DevicePlugin };
