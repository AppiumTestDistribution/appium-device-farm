import usbmux from '../usbmux';
import GoIosTracker from '../goIOSTracker';
export class IosTracker {
  private static instance: any;

  public static getInstance(): any {
    if (!IosTracker.instance) {
      if (process.env.GO_IOS) {
        IosTracker.instance = new GoIosTracker();
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        IosTracker.instance = new usbmux.createListener();
      }
    }

    return IosTracker.instance;
  }

  async stop() {
    IosTracker.instance.end();
  }
}
