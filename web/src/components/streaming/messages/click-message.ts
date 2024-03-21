import { Point } from '../../../libs/coordinates';

export class ClickControlMessage {
  constructor(
    readonly point: Point,
    readonly duration: number = 100,
  ) {}

  public toJSON() {
    return {
      action: 'click',
      args: [
        {
          type: 'pointer',
          id: 'finger1',
          parameters: { pointerType: 'touch' },
          actions: [
            {
              type: 'pointerMove',
              duration: 0,
              x: this.point.x,
              y: this.point.y,
            },
            { type: 'pointerDown', button: 0 },
            { type: 'pause', duration: this.duration },
            { type: 'pointerUp', button: 0 },
          ],
        },
      ],
    };
  }
}
