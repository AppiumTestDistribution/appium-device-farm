export interface PortPair {
  wdaRestPort: number;
  wdaMjpegPort: number;
}

export interface IOSPortAllocatorOptions {
  baseRestPort: number;
  baseMjpegPort: number;
}

export class IOSPortAllocator {
  private byUdid = new Map<string, PortPair>();
  private usedSlots = new Set<number>(); // slot index = port - basePort

  constructor(private readonly options: IOSPortAllocatorOptions) {}

  allocate(udid: string): PortPair {
    const existing = this.byUdid.get(udid);
    if (existing) return existing;

    // Find lowest free slot.
    let slot = 0;
    while (this.usedSlots.has(slot)) slot++;
    this.usedSlots.add(slot);

    const pair: PortPair = {
      wdaRestPort: this.options.baseRestPort + slot,
      wdaMjpegPort: this.options.baseMjpegPort + slot,
    };
    this.byUdid.set(udid, pair);
    return pair;
  }

  release(udid: string): void {
    const pair = this.byUdid.get(udid);
    if (!pair) return;
    const slot = pair.wdaRestPort - this.options.baseRestPort;
    this.usedSlots.delete(slot);
    this.byUdid.delete(udid);
  }

  getAllocated(): Map<string, PortPair> {
    return new Map(this.byUdid);
  }
}
