import EventEmitter from 'events';
const eventEmitter = new EventEmitter();

export const emitDevices = (platform: any) =>
  eventEmitter.emit('ConnectedDevices', {
    emittedDevices: platform,
  });
export default eventEmitter;
