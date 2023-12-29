import _ from 'lodash';
import usbmux from 'usbmux';
export class GoIosTracker {
  private static instance: any;

  public static getInstance(): any {
    if (!GoIosTracker.instance) {
      GoIosTracker.instance = new usbmux.createListener()
    }

    return GoIosTracker.instance;
  }

  async stop() {
    GoIosTracker.instance.end();
  }
}
