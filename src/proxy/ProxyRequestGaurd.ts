function createDeferedPromise() {
  let resolve: any, reject: any;
  const promise: Promise<any> = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return {
    promise,
    resolve,
    reject,
  };
}

export class ProxyRequestGaurd {
  private _map: Map<string, { waitForResponse: any; requestLock: any }> = new Map<string, any>();

  add(requestId: string) {
    const gaurd = {
      waitForResponse: createDeferedPromise(),
      requestLock: createDeferedPromise(),
    };
    this._map.set(requestId, gaurd);
    return gaurd;
  }

  get(requestId: string) {
    return this._map.get(requestId);
  }
}

export default new ProxyRequestGaurd();
