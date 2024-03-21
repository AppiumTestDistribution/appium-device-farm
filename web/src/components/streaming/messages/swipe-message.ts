// import { ControlMessage, ControlMessageInterface } from 'appium-grid-common';
import { Point } from '../../../lib/coordinates';

export class SwipeControlMessage {
  constructor(
    readonly startPoint: Point,
    readonly endPoint: Point,
  ) {}

  private getActionJson() {
    return [
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          {
            type: 'pointerMove',
            duration: 0,
            x: this.startPoint.x,
            y: this.startPoint.y,
          },
          { type: 'pointerDown', button: 0 },
          {
            type: 'pointerMove',
            duration: 200,
            origin: 'viewport',
            x: this.endPoint.x,
            y: this.endPoint.y,
          },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ];
  }

  public toJSON() {
    return {
      action: 'swipe',
      args: this.getActionJson(),
    };
  }
}
