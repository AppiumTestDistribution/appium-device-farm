import _ from 'lodash';
import usbmux from 'usbmux';
export class IosTracker {
  private static instance: any;

  public static getInstance(): any {
    if (!IosTracker.instance) {
      IosTracker.instance = new usbmux.createListener()
    }

    return IosTracker.instance;
  }

  async stop() {
    IosTracker.instance.end();
  }
}
