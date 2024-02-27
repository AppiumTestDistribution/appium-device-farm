import usbmux from '../usbmux';
export class IosTracker {
  private static instance: any;

  public static getInstance(): any {
    if (!IosTracker.instance) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      IosTracker.instance = new usbmux.createListener();
    }

    return IosTracker.instance;
  }

  async stop() {
    IosTracker.instance.end();
  }
}
