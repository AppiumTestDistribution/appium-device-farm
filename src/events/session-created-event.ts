import { IDeviceFarmSessionOptions } from '../interfaces/IDeviceFarmSession';
import { Event } from '../notifier/event';
import { EventListener } from '../notifier/event-listener';
import { EventConsumer } from '../types/event';

export class SessionCreatedEvent extends Event<IDeviceFarmSessionOptions> {
  private static readonly EVENT_NAME: string = 'session-created';

  constructor(session: IDeviceFarmSessionOptions) {
    super(SessionCreatedEvent.EVENT_NAME, session);
  }

  static listener(handler: EventConsumer<IDeviceFarmSessionOptions>) {
    return new EventListener<IDeviceFarmSessionOptions>(SessionCreatedEvent.EVENT_NAME, handler);
  }
}
