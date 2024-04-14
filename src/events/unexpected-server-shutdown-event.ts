import { Event } from '../notifier/event';
import { EventListener } from '../notifier/event-listener';
import { EventConsumer } from '../types/event';

export interface IUnexpectedServerShutdownOptions {
  driver: any;
}

export class UnexpectedServerShutdownEvent extends Event<IUnexpectedServerShutdownOptions> {
  private static readonly EVENT_NAME: string = 'unexpected-server-shutdown-event';

  constructor(options: IUnexpectedServerShutdownOptions) {
    super(UnexpectedServerShutdownEvent.EVENT_NAME, options);
  }

  static listener(handler: EventConsumer<IUnexpectedServerShutdownOptions>) {
    return new EventListener<IUnexpectedServerShutdownOptions>(
      UnexpectedServerShutdownEvent.EVENT_NAME,
      handler,
    );
  }
}
