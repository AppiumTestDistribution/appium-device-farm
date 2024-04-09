import { ClickControlMessage } from '../components/streaming/messages/click-message';
import { SwipeControlMessage } from '../components/streaming/messages/swipe-message';
import { Point } from './coordinates';
//import { ControlMessageSender } from '../control-message-sender';
// import { ClickControlMessage } from '../messages/ios/click-control-message';
// import { SwipeControlMessage } from '../messages/ios/swipe-control-message';

export class SimpleInterationHandler {
  private mouseDownPoint!: Point | null;
  private mouseUpPoint!: Point | null;
  private scaleRatio!: number;
  private clickStartTime!: number;

    constructor(
    private videoElement: HTMLElement,
    touchableElement: HTMLCanvasElement,
    containerElement: HTMLDivElement,
    private controlMessageSender: any,
    private displayInfo: { width: number; height: number },
  ) {
    const resizeObserver = new ResizeObserver((changes) => {
      if (touchableElement) {
        containerElement.style.width = changes[0].contentRect.width + 'px';
        containerElement.style.height = changes[0].contentRect.height + 'px';
        if (this.videoElement.offsetWidth > this.videoElement.offsetHeight) {
          /* LANDSCAPE mode */
          this.scaleRatio = this.displayInfo.height / this.videoElement.offsetWidth;
        } else {
          /* PORTRAIT mode */
          this.scaleRatio = this.displayInfo.height / this.videoElement.offsetHeight;
        }
      }
    });

    resizeObserver.observe(videoElement);
    touchableElement.addEventListener('mousedown', this.mouseDownHandler.bind(this));
    touchableElement.addEventListener('mouseup', this.mouseUpHandler.bind(this));
  }

  public getDeviceInfo() {
    return this.displayInfo;
  }

  private getScaleRatio() {
    if (!this.scaleRatio) {
      this.scaleRatio = this.displayInfo.height / this.videoElement.offsetHeight;
    }
    return this.scaleRatio;
  }

  private mouseUpHandler(e: any) {
    const offsetX = e.offsetX;
    const offsetY = e.offsetY;
    const clickEndTime = Date.now();
    this.mouseUpPoint = new Point(offsetX * this.getScaleRatio(), offsetY * this.getScaleRatio());
    if (
      this.mouseDownPoint?.x != this.mouseUpPoint?.x ||
      this.mouseDownPoint?.y != this.mouseUpPoint?.y
    ) {
      //swipe action
      const message = new SwipeControlMessage(this.mouseDownPoint as any, this.mouseUpPoint, Math.ceil(clickEndTime - this.clickStartTime));
      this.controlMessageSender.send(JSON.stringify(message.toJSON()));
      console.log(message.toJSON());
      return;
    } else if (Math.ceil((clickEndTime - this.clickStartTime) / 1000) >= 2) {
      //long press action
      const message = new ClickControlMessage(
        this.mouseUpPoint,
        Math.ceil(clickEndTime - this.clickStartTime),
      );
      this.controlMessageSender.send(JSON.stringify(message.toJSON()));
      console.log(message.toJSON());
    } else {
      //click action
      console.log(this.mouseUpPoint);
      const message = new ClickControlMessage(this.mouseUpPoint);
      this.controlMessageSender.send(JSON.stringify(message.toJSON()));
      console.log(message.toJSON());
    }

    this.mouseUpPoint = null;
    this.mouseDownPoint = null;
  }

  private mouseDownHandler(e: any) {
    this.clickStartTime = Date.now();
    const offsetX = e.offsetX;
    const offsetY = e.offsetY;
    this.mouseDownPoint = new Point(offsetX * this.getScaleRatio(), offsetY * this.getScaleRatio());
  }
}
