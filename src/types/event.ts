export type EventConsumer<T> = (args: T) => void | Promise<void>;
