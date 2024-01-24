import EventEmitter2 from 'eventemitter2';
import { EventListener } from './event-listener';
import { Event } from './event';

export class EventBus {
  private delegate: EventEmitter2 = new EventEmitter2();

  addListener<T>(listener: EventListener<T>) {
    this.delegate.addListener(listener.getEventName(), listener.getHandler());
  }

  fire<T>(event: Event<T>) {
    this.delegate.emit(event.getEventName(), event.getData());
  }

  removeAll() {
    this.delegate.removeAllListeners();
  }
}

export default new EventBus();
