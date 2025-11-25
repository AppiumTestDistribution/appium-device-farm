/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import * as net from 'net';
import { EventEmitter } from 'events';
import * as Q from 'q';
import * as plist from 'plist';

/**
 * Keep track of connected devices
 *
 * Maps device UDID to device properties, ie:
 * '22226dd59aaac687f555f8521f8ffddac32d394b': {
 *   ConnectionType: 'USB',
 *   DeviceID: 19,
 *   LocationID: 0,
 *   ProductID: 4776,
 *   SerialNumber: '22226dd59aaac687f555f8521f8ffddac32d394b'
 * }
 *
 * Devices are added and removed to this obj only by createListener()
 *
 * @public
 */
const devices: { [udid: string]: any } = {};

/**
 * usbmuxd address
 *
 * OSX usbmuxd listens on a unix socket at /var/run/usbmuxd
 * Windows usbmuxd listens on port 27015
 *
 * libimobiledevice[1] looks like it operates at /var/run/usbmuxd too, but if
 * your usbmuxd is listening somewhere else you'll need to set this manually.
 *
 * [1] github.com/libimobiledevice/usbmuxd
 *
 * @public
 */
let address: { port?: number; path?: string } =
  process.platform === 'win32' ? { port: 27015 } : { path: '/var/run/usbmuxd' };

/**
 * Exposes methods for dealing with usbmuxd protocol messages (send/receive)
 *
 * The usbmuxd message protocol has 2 versions. V1 doesn't look like its used
 * anymore. V2 is a header + plist format like this:
 *
 * Header:
 *   UInt32LE Length  - is the length of the header + plist (16 + plist.length)
 *   UInt32LE Version - is 0 for binary version, 1 for plist version
 *   UInt32LE Request - is always 8, for plist? from rcg4u/iphonessh
 *   UInt32LE Tag     - is always 1, ? from rcg4u/iphonessh
 *
 * Plist:
 *   <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
 *     "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
 *   <plist version="1.0">
 *     <dict>
 *       <key>MessageType</key>
 *       <string>Listen</string>
 *       <key>ClientVersionString</key>
 *       <string>node-usbmux</string>
 *       <key>ProgName</key>
 *       <string>node-usbmux</string>
 *     </dict>
 *   </plist>
 *
 * References:
 * - https://github.com/rcg4u/iphonessh
 * - https://www.theiphonewiki.com/wiki/Usbmux (binary protocol)
 */
const protocol = (() => {
  /**
   * Pack a request object into a buffer for usbmuxd
   *
   * @param  {object} payload_obj
   * @return {Buffer}
   */
  function pack(payload_obj: any): Buffer {
    const payload_plist = plist.build(payload_obj);
    const payload_buf = Buffer.from(payload_plist);

    const header = {
      len: payload_buf.length + 16,
      version: 1,
      request: 8,
      tag: 1,
    };

    const header_buf = Buffer.alloc(16);
    header_buf.fill(0);
    header_buf.writeUInt32LE(header.len, 0);
    header_buf.writeUInt32LE(header.version, 4);
    header_buf.writeUInt32LE(header.request, 8);
    header_buf.writeUInt32LE(header.tag, 12);

    return Buffer.concat([header_buf, payload_buf]);
  }

  /**
   * Swap endianness of a 16bit value
   */
  function byteSwap16(val: number): number {
    return ((val & 0xff) << 8) | ((val >> 8) & 0xff);
  }

  /**
   * Listen request
   * @type {Buffer}
   */
  const listen = pack({
    MessageType: 'Listen',
    ClientVersionString: 'node-usbmux',
    ProgName: 'node-usbmux',
  });

  /**
   * Connect request
   *
   * Note: PortNumber must be network-endian, so it gets byte swapped here
   *
   * @param {integer} deviceID
   * @param {integer} port
   * @return {Buffer}
   */
  function connect(deviceID: number, port: number): Buffer {
    return pack({
      MessageType: 'Connect',
      ClientVersionString: 'node-usbmux',
      ProgName: 'node-usbmux',
      DeviceID: deviceID,
      PortNumber: byteSwap16(port),
    });
  }

  /**
   * Creates a function that will parse messages from data events
   *
   * net.Socket data events sometimes break up the incoming message across
   * multiple events, making it necessary to combine them. This parser function
   * assembles messages using the length given in the message header and calls
   * the onComplete callback as new messages are assembled. Sometime multiple
   * messages will be within a single data buffer too.
   *
   * @param  {makeParserCb} onComplete - Called as new msgs are assembled
   * @return {function}                - Parser function
   *
   * @callback makeParserCb
   * @param {object} - msg object converted from plist
   */
  function makeParser(onComplete: (msg: any) => void): (data: Buffer) => void {
    // Store status (remaining message length & msg text) of partial messages
    // across multiple calls to the parse function
    let len: number, msg: string;

    /**
     * @param {Buffer} data - From a socket's data event
     */
    return function parse(data: Buffer): void {
      // Check if this data represents a new incoming message or is part of an
      // existing partially completed message
      if (!len) {
        // The length of the message's body is the total length (the first
        // UInt32LE in the header) minus the length of the header itself (16)
        len = data.readUInt32LE(0) - 16;
        msg = '';

        // If there is data beyond the header then continue adding data to msg
        data = data.slice(16);
        if (!data.length) return;
      }

      // Add in data until our remaining length is used up
      const body = data.slice(0, len);
      msg += body.toString();
      len -= body.length;

      // If msg is finished, convert plist to obj and run callback
      if (len === 0) onComplete(plist.parse(msg));

      // If there is any data left over that means there is another message
      // so we need to run this parse fct again using the rest of the data
      data = data.slice(body.length);
      if (data.length) parse(data);
    };
  }

  // Exposed methods
  return {
    listen: listen,
    connect: connect,
    makeParser: makeParser,
  };
})();

/**
 * Custom usbmuxd error
 *
 * There's no documentation for usbmuxd responses, but I think I've figured
 * out these result numbers:
 * 0 - Success
 * 2 - Device requested isn't connected
 * 3 - Port requested isn't available \ open
 * 5 - Malformed request
 *
 * @param {string}  message  - Error message
 * @param {integer} [number] - Error number given from usbmuxd response
 */
class UsbmuxdError extends Error {
  number?: number;

  constructor(message: string, number?: number) {
    super(message);

    this.name = 'UsbmuxdError';

    if (number) {
      this.number = number;
      this.message += ', Err #' + number;
    }
    if (number === 2) this.message += ': Device is not connected';
    if (number === 3) this.message += ': Port is not available or open';
    if (number === 5) this.message += ': Malformed request';
  }
}

/**
 * Connects to usbmuxd and listens for ios devices
 *
 * This connection stays open, listening as devices are plugged/unplugged and
 * cant be upgraded into a tcp tunnel. You have to start a second connection
 * with connect() to actually make tunnel.
 *
 * @return {net.Socket} - Socket with 2 bolted on events, attached & detached:
 *
 * Fires when devices are plugged in or first found by the listener
 * @event net.Socket#attached
 * @type {string} - UDID
 *
 * Fires when devices are unplugged
 * @event net.Socket#detached
 * @type {string} - UDID
 *
 * @public
 */
function createListener(): net.Socket {
  const conn = net.connect(address);
  const req = protocol.listen;

  /**
   * Handle complete messages from usbmuxd
   * @function
   */
  const parse = protocol.makeParser(function onMsgComplete(msg) {
    // first response always acknowledges / denies the request:
    if (msg.MessageType === 'Result' && msg.Number !== 0) {
      conn.emit('error', new UsbmuxdError('Listen failed', msg.Number));
      conn.end();
    }

    // subsequent responses report on connected device status:
    console.log(msg);
    if (msg.MessageType === 'Attached') {
      devices[msg.Properties.SerialNumber] = msg.Properties;
      conn.emit('attached', msg.Properties.SerialNumber);
    }

    if (msg.MessageType === 'Detached') {
      // given msg.DeviceID, find matching device and remove it
      Object.keys(devices).forEach(function (key) {
        if (devices[key].DeviceID === msg.DeviceID) {
          conn.emit('detached', devices[key].SerialNumber);
          delete devices[key];
        }
      });
    }
  });

  conn.on('data', parse);
  process.nextTick(function () {
    conn.write(req);
  });

  return conn;
}

/**
 * Connects to a device through usbmuxd for a tunneled tcp connection
 *
 * @param  {string}  deviceID   - Target device's usbmuxd ID
 * @param  {integer} devicePort - Port on ios device to connect to
 * @return {Q.promise}
 * - resolves {net.Socket} - Tunneled tcp connection to device
 * - rejects  {Error}
 */
function connectToDevice(deviceID: string, devicePort: number): Q.Promise<net.Socket> {
  return Q.Promise(function (resolve, reject) {
    const conn = net.connect(address);
    const req = protocol.connect(parseInt(deviceID), devicePort);

    /**
     * Handle complete messages from usbmuxd
     * @function
     */
    const parse = protocol.makeParser(function onMsgComplete(msg) {
      debug.connect('Response: \n%o', msg);

      if (msg.MessageType === 'Result' && msg.Number === 0) {
        conn.removeListener('data', parse);
        resolve(conn);
        return;
      }

      // anything other response means it failed
      reject(new UsbmuxdError('Tunnel failed', msg.Number));
      conn.end();
    });

    debug.connect('Request: \n%s', req.slice(16).toString());

    conn.on('data', parse);
    process.nextTick(function () {
      conn.write(req);
    });
  });
}

/**
 * Creates a new tcp relay to a port on connected usb device
 *
 * @constructor
 * @param {integer} devicePort          - Port to connect to on device
 * @param {integer} relayPort           - Local port that will listen as relay
 * @param {object}  [opts]              - Options
 * @param {integer} [opts.timeout=1000] - Search time (ms) before warning
 * @param {string}  [opts.udid]         - UDID of specific device to connect to
 *
 * @public
 */
class Relay extends EventEmitter {
  private _devicePort: number;
  private _relayPort: number;
  private _udid?: string;

  private _listener: net.Socket | null = null;
  private _server: net.Server | null = null;

  constructor(devicePort: number, relayPort: number, opts?: { timeout?: number; udid?: string }) {
    super();

    this._devicePort = devicePort;
    this._relayPort = relayPort;

    opts = opts || {};
    this._udid = opts.udid;

    this._startListener(opts.timeout);
    this._startServer();
  }

  /**
   * Stops the relay
   */
  stop(): void {
    if (this._listener) this._listener.end();
    if (this._server) this._server.close();
  }

  /**
   * Debugging wrapper for emits
   *
   * @param {string} event
   * @param {*}      [data]
   */
  private _emit(event: string, data?: any): void {
    debug.relay('Emit: %s', event + (data ? ', Data: ' + data : ''));
    this.emit(event, data);
  }

  /**
   * Starts a usbmuxd listener
   *
   * Relay will start searching for connected devices and issue a warning if a
   * device is not found within the timeout. If/when a device is found, it will
   * emit a ready event.
   *
   * Listener events (attach, detach, error) are passed through as relay events.
   *
   * @param {integer} [timeout=1000] - Search time (ms) before warning
   */
  private _startListener(timeout?: number): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;

    const timer = setTimeout(function () {
      // no UDID was given and no devices found yet
      if (!_this._udid && !Object.keys(devices).length) {
        _this._emit('warning', new Error('No devices connected'));
      }
      // UDID was given, but that device is not connected
      if (_this._udid && !devices[_this._udid]) {
        _this._emit('warning', new Error('Requested device not connected'));
      }
    }, timeout || 1000);

    function readyCheck(udid: string): void {
      if (_this._udid && _this._udid !== udid) return;
      _this._emit('ready', udid);
      if (_this._listener) _this._listener.removeListener('attached', readyCheck);
      clearTimeout(timer);
    }

    this._listener = createListener()
      .on('attached', readyCheck)
      .on('attached', _this._emit.bind(this, 'attached'))
      .on('detached', _this._emit.bind(this, 'detached'))
      .on('error', _this._emit.bind(this, 'error'));
  }

  /**
   * Start local TCP server that will pipe to the usbmuxd tunnel
   *
   * Server events (close and error) are passed through as relay events.
   */
  private _startServer(): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    this._server = net
      .createServer(this._handler.bind(this))
      .on('close', _this._emit.bind(this, 'close'))
      .on('error', function (err) {
        if (_this._listener) _this._listener.end();
        _this._emit('error', err);
      })
      .listen(this._relayPort);
  }

  /**
   * Handle & pipe connections from local server
   *
   * Fires error events and connection begin / disconnect events
   *
   * @param {net.Socket} conn - The local connection socket
   */
  private _handler(conn: net.Socket): void {
    // emit error if there are no devices connected
    if (!Object.keys(devices).length) {
      this._emit('error', new Error('No devices connected'));
      conn.end();
      return;
    }

    // emit error if a udid was specified but that device isn't connected
    if (this._udid && !devices[this._udid]) {
      this._emit('error', new Error('Requested device not connected'));
      conn.end();
      return;
    }

    // Use specified device or choose one from available devices
    const udid = this._udid || Object.keys(devices)[0];
    const deviceID = devices[udid].DeviceID;

    connectToDevice(deviceID.toString(), this._devicePort)
      .then(function (tunnel) {
        // pipe connection & tunnel together
        conn.pipe(tunnel).pipe(conn);

        _this._emit('connect');

        conn.on('end', function () {
          _this._emit('disconnect');
          tunnel.end();
          conn.end();
        });

        conn.on('error', function () {
          tunnel.end();
          conn.end();
        });
      })
      .catch(function (err) {
        _this._emit('error', err);
        conn.end();
      });
  }
}

/**
 * Find a device (specified or not) within a timeout
 *
 * Usbmuxd has IDs it assigned to devices as they are plugged in. The IDs
 * change as devices are unplugged and plugged back in, so even if we have a
 * UDID we need to get the current ID from usbmuxd before we can connect.
 *
 * @param  {object}  [opts]              - Options
 * @param  {integer} [opts.timeout=1000] - Search time (in ms) before failing
 * @param  {string}  [opts.udid]         - UDID of a specific device to find
 * @return {Q.promise}
 * - resolves {integer} - DeviceID from usbmuxd needed for a connect request
 * - rejects  {Error}
 */
function findDevice(opts?: { timeout?: number; udid?: string }): Q.Promise<number> {
  return Q.Promise(function (resolve, reject) {
    const listener = createListener();
    opts = opts || {};

    const timer = setTimeout(function () {
      listener.end();
      opts && opts.udid
        ? reject(new Error('Requested device not connected'))
        : reject(new Error('No devices connected'));
    }, opts.timeout || 1000);

    listener.on('attached', function (udid: string) {
      if (opts && opts.udid && opts.udid !== udid) return;
      listener.end();
      clearTimeout(timer);
      resolve(devices[udid].DeviceID);
    });
  });
}

/**
 * Get a tunneled connection to a device (specified or not) within a timeout
 *
 * @param  {integer} devicePort          - Port to connect to on device
 * @param  {object}  [opts]              - Options
 * @param  {integer} [opts.timeout=1000] - Search time (in ms) before failing
 * @param  {string}  [opts.udid]         - UDID of specific device to connect to
 * @return {Q.promise}
 * - resolves {net.Socket} - Tunneled connection to device
 * - rejects  {Error}
 *
 * @public
 */
function getTunnel(
  devicePort: number,
  opts?: { timeout?: number; udid?: string },
): Q.Promise<net.Socket> {
  opts = opts || {};
  let udid, deviceID;

  // If UDID was specified and that device's DeviceID is known, connect to it
  if (opts.udid && devices[opts.udid]) {
    deviceID = devices[opts.udid].DeviceID;
    return connectToDevice(deviceID.toString(), devicePort);
  }

  // If no UDID given, connect to any known device
  // (random because no key order, but there's probably only 1 option anyways)
  if (!opts.udid && Object.keys(devices).length) {
    udid = Object.keys(devices)[0];
    deviceID = devices[udid].DeviceID;
    return connectToDevice(deviceID.toString(), devicePort);
  }

  // - Try to find and connect to requested the device (given opts.UDID),
  // - or find and connect to any device (no opts.UDID given)
  return findDevice(opts).then(function (deviceID) {
    return connectToDevice(deviceID.toString(), devicePort);
  });
}

//
// EXPORTS
//

export = {
  devices: devices,
  Relay: Relay,
  getTunnel: getTunnel,
  createListener: createListener,
};

// getter and setter for usbmuxd address
Object.defineProperty(module.exports, 'address', {
  get: function () {
    return address;
  },
  set: function (newAddress: { port?: number; path?: string }) {
    if (newAddress.port !== undefined || newAddress.path !== undefined) {
      address = newAddress;
    }
  },
});
