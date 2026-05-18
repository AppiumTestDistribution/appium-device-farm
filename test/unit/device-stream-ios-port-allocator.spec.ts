import { expect } from 'chai';
import { IOSPortAllocator } from '../../src/device-stream/ios/port-allocator';

describe('IOSPortAllocator', () => {
  it('allocates the base ports for the first device', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    expect(a.allocate('udid-A')).to.deep.equal({ wdaRestPort: 8100, wdaMjpegPort: 9100 });
  });

  it('allocates incrementing ports for additional devices', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    a.allocate('udid-A');
    expect(a.allocate('udid-B')).to.deep.equal({ wdaRestPort: 8101, wdaMjpegPort: 9101 });
    expect(a.allocate('udid-C')).to.deep.equal({ wdaRestPort: 8102, wdaMjpegPort: 9102 });
  });

  it('returns the same ports if the same UDID is allocated twice', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    const first = a.allocate('udid-A');
    const second = a.allocate('udid-A');
    expect(second).to.deep.equal(first);
  });

  it('reuses released slots before incrementing', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    a.allocate('udid-A');
    a.allocate('udid-B');
    a.release('udid-A');
    expect(a.allocate('udid-C')).to.deep.equal({ wdaRestPort: 8100, wdaMjpegPort: 9100 });
  });

  it('release is idempotent', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    a.allocate('udid-A');
    a.release('udid-A');
    a.release('udid-A'); // no throw
    expect(a.getAllocated().size).to.equal(0);
  });

  it('getAllocated() returns the current udid→ports map', () => {
    const a = new IOSPortAllocator({ baseRestPort: 8100, baseMjpegPort: 9100 });
    a.allocate('udid-A');
    a.allocate('udid-B');
    const all = a.getAllocated();
    expect(all.size).to.equal(2);
    expect(all.get('udid-A')).to.deep.equal({ wdaRestPort: 8100, wdaMjpegPort: 9100 });
    expect(all.get('udid-B')).to.deep.equal({ wdaRestPort: 8101, wdaMjpegPort: 9101 });
  });
});
