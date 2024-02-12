export class Event<T> {
  constructor(
    private readonly eventName: string,
    private readonly data: T,
  ) {}

  public getEventName() {
    return this.eventName;
  }

  public getData() {
    return this.data;
  }
}
