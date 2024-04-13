import { Event } from '../notifier/event';
import { EventListener } from '../notifier/event-listener';
import { EventConsumer } from '../types/event';

export class UnexpectedServerShutdownEvent extends Event<null> {
  private static readonly EVENT_NAME: string = 'unexpected-server-shutdown-event';

  constructor() {
    super(UnexpectedServerShutdownEvent.EVENT_NAME, null);
  }

  static listener(handler: EventConsumer<null>) {
    return new EventListener<null>(UnexpectedServerShutdownEvent.EVENT_NAME, handler);
  }
}
