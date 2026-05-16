import { expect } from 'chai';
import {
  encodeMeta,
  encodeConfig,
  encodeData,
  decodeClientTouchMessage,
  decodeClientKeycodeMessage,
} from '../../src/device-stream/android/framing';
import {
  SRV_TAG_META,
  SRV_TAG_CONFIG,
  SRV_TAG_DATA,
  CLIENT_TOUCH_TAG,
  CLIENT_KEYCODE_TAG,
  KEYCODE_HOME,
} from '../../src/device-stream/types';

describe('device-stream framing', () => {
  describe('encodeMeta', () => {
    it('prefixes JSON with SRV_TAG_META', () => {
      const out = encodeMeta({ codec: 'h264', width: 528, height: 1080 });
      expect(out[0]).to.equal(SRV_TAG_META);
      const json = JSON.parse(out.slice(1).toString('utf-8'));
      expect(json).to.deep.equal({ codec: 'h264', width: 528, height: 1080 });
    });
  });

  describe('encodeConfig', () => {
    it('prefixes payload with SRV_TAG_CONFIG', () => {
      const payload = new Uint8Array([1, 2, 3, 4]);
      const out = encodeConfig(payload);
      expect(out[0]).to.equal(SRV_TAG_CONFIG);
      expect([...out.slice(1)]).to.deep.equal([1, 2, 3, 4]);
    });
  });

  describe('encodeData', () => {
    it('prefixes payload with SRV_TAG_DATA + 8-byte LE pts', () => {
      const payload = new Uint8Array([9, 8, 7]);
      const out = encodeData(0x1122334455667788n, payload);
      expect(out[0]).to.equal(SRV_TAG_DATA);
      expect(out.readBigUInt64LE(1)).to.equal(0x1122334455667788n);
      expect([...out.slice(9)]).to.deep.equal([9, 8, 7]);
    });

    it('treats undefined pts as 0', () => {
      const out = encodeData(undefined, new Uint8Array());
      expect(out.readBigUInt64LE(1)).to.equal(0n);
    });
  });

  describe('decodeClientTouchMessage', () => {
    it('returns null for non-touch tag', () => {
      const buf = Buffer.from([0x99, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(decodeClientTouchMessage(buf)).to.be.null;
    });

    it('returns null for too-short buffer', () => {
      const buf = Buffer.from([CLIENT_TOUCH_TAG, 0]);
      expect(decodeClientTouchMessage(buf)).to.be.null;
    });

    it('decodes action + normalised coords', () => {
      const buf = Buffer.alloc(10);
      buf[0] = CLIENT_TOUCH_TAG;
      buf[1] = 0; // ACTION_DOWN
      buf.writeFloatBE(0.5, 2);
      buf.writeFloatBE(0.75, 6);
      const msg = decodeClientTouchMessage(buf);
      expect(msg).to.deep.equal({ action: 0, normX: 0.5, normY: 0.75 });
    });
  });

  describe('decodeClientKeycodeMessage', () => {
    it('returns null for non-keycode tag', () => {
      const buf = Buffer.from([0x99, 0, 0, 0, 0]);
      expect(decodeClientKeycodeMessage(buf)).to.be.null;
    });

    it('returns null for too-short buffer', () => {
      const buf = Buffer.from([CLIENT_KEYCODE_TAG]);
      expect(decodeClientKeycodeMessage(buf)).to.be.null;
    });

    it('decodes a 32-bit BE keycode', () => {
      const buf = Buffer.alloc(5);
      buf[0] = CLIENT_KEYCODE_TAG;
      buf.writeUInt32BE(KEYCODE_HOME, 1);
      expect(decodeClientKeycodeMessage(buf)).to.deep.equal({
        keycode: KEYCODE_HOME,
      });
    });
  });
});
