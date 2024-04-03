import { waitForCondition } from 'asyncbox';
import log from './logger';
import { getStreamingServer } from './modules/device-control/streaming-server';
import { getIOSStreamingServer } from './modules/device-control/ios-streaming-server';
import { IPluginArgs } from './interfaces/IPluginArgs';
import { ADB } from 'appium-adb';
export async function waitForWebsocketToBeDeregister(pluginArgs: IPluginArgs, httpServer: any) {
  if (!pluginArgs.cloud && pluginArgs.platform.toLowerCase() === 'android') {
    await waitForCondition(async () => {
      console.log('Waiting for Android websocket handlers to be removed..');
      return !Object.hasOwn(await httpServer.getWebSocketHandlers(), '/android-stream/:udid');
    });
  } else if (!pluginArgs.cloud && pluginArgs.platform.toLowerCase() === 'ios') {
    await waitForCondition(async () => {
      console.log('Waiting for iOS websocket handlers to be removed..');
      return !Object.hasOwn(await httpServer.getWebSocketHandlers(), '/ios-stream/:udid');
    });
  } else {
    await waitForCondition(async () => {
      console.log('Waiting for Android and iOS websocket handlers to be removed..');
      return (
        !Object.hasOwn(await httpServer.getWebSocketHandlers(), '/android-stream/:udid') &&
        !Object.hasOwn(await httpServer.getWebSocketHandlers(), '/ios-stream/:udid')
      );
    });
  }
}

export async function registerAndroidWebSocketHandlers(httpServer: any, adbInstance: ADB) {
  log.info('Registering websocket handler for Android Streaming');
  await httpServer.addWebSocketHandler('/android-stream/:udid', getStreamingServer(adbInstance));
}

export async function registerIOSWebSocketHandlers(httpServer: any) {
  log.info('Registering websocket handler for iOS Streaming');
  await httpServer.addWebSocketHandler('/ios-stream/:udid', getIOSStreamingServer());
}
