import { IAfterSessionDeletedEventOptions } from '../interfaces/IDeviceFarmSession';
import { Event } from '../notifier/event';
import { EventListener } from '../notifier/event-listener';
import { EventConsumer } from '../types/event';

export class AfterSessionDeletedEvent extends Event<IAfterSessionDeletedEventOptions> {
  private static readonly EVENT_NAME: string = 'after-session-deleted';

  constructor(options: IAfterSessionDeletedEventOptions) {
    super(AfterSessionDeletedEvent.EVENT_NAME, options);
  }

  static listener(handler: EventConsumer<IAfterSessionDeletedEventOptions>) {
    return new EventListener<IAfterSessionDeletedEventOptions>(
      AfterSessionDeletedEvent.EVENT_NAME,
      handler,
    );
  }
}
