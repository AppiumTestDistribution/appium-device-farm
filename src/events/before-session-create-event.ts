import { IBeforeSessionCreateEventOptions } from '../interfaces/IDeviceFarmSession';
import { Event } from '../notifier/event';
import { EventListener } from '../notifier/event-listener';
import { EventConsumer } from '../types/event';

export class BeforeSessionCreatedEvent extends Event<IBeforeSessionCreateEventOptions> {
  private static readonly EVENT_NAME: string = 'before-session-create';

  constructor(session: IBeforeSessionCreateEventOptions) {
    super(BeforeSessionCreatedEvent.EVENT_NAME, session);
  }

  static listener(handler: EventConsumer<IBeforeSessionCreateEventOptions>) {
    return new EventListener<IBeforeSessionCreateEventOptions>(
      BeforeSessionCreatedEvent.EVENT_NAME,
      handler,
    );
  }
}
