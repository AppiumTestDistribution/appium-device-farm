import { EventConsumer } from '../types/event';

export class EventListener<T> {
  constructor(
    private readonly eventName: string,
    private readonly handler: EventConsumer<T>,
  ) {}

  public getEventName() {
    return this.eventName;
  }

  public getHandler() {
    return this.handler;
  }
}
