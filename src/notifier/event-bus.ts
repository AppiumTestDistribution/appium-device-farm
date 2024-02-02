import { EventListener } from './event-listener';
import { Event } from './event';
import Emittery from 'emittery';

export class EventBus {
  private delegate: Emittery = new Emittery();

  addListener<T>(listener: EventListener<T>) {
    this.delegate.on(listener.getEventName(), listener.getHandler());
  }

  async fire<T>(event: Event<T>) {
    await this.delegate.emit(event.getEventName(), event.getData());
  }
}

export default new EventBus();
