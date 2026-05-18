import { expect } from 'chai';
import {
  encodeIosMeta,
  encodeIosFrame,
  decodeIosClientMessage,
} from '../../src/device-stream/ios/framing';
import {
  SRV_TAG_META,
  SRV_TAG_FRAME,
  CLIENT_TAP_TAG,
  CLIENT_SWIPE_TAG,
  CLIENT_INTENT_TAG,
  INTENT_HOME,
  INTENT_APP_SWITCHER,
} from '../../src/device-stream/types';

describe('iOS framing', () => {
  describe('encodeIosMeta', () => {
    it('prefixes JSON payload with SRV_TAG_META', () => {
      const buf = encodeIosMeta({
        deviceWidthPoints: 428,
        deviceHeightPoints: 926,
        deviceWidthPixels: 1284,
        deviceHeightPixels: 2778,
        scale: 3,
      });
      expect(buf[0]).to.equal(SRV_TAG_META);
      const json = JSON.parse(buf.slice(1).toString('utf-8'));
      expect(json).to.deep.equal({
        deviceWidthPoints: 428,
        deviceHeightPoints: 926,
        deviceWidthPixels: 1284,
        deviceHeightPixels: 2778,
        scale: 3,
      });
    });
  });

  describe('encodeIosFrame', () => {
    it('prefixes JPEG bytes with SRV_TAG_FRAME and 4-byte BE length', () => {
      const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      const buf = encodeIosFrame(jpeg);
      expect(buf[0]).to.equal(SRV_TAG_FRAME);
      expect(buf.readUInt32BE(1)).to.equal(jpeg.length);
      expect(buf.slice(5)).to.deep.equal(jpeg);
    });
  });

  describe('decodeIosClientMessage', () => {
    it('decodes a tap message', () => {
      const buf = Buffer.alloc(1 + 8);
      buf[0] = CLIENT_TAP_TAG;
      buf.writeFloatBE(263.5, 1);
      buf.writeFloatBE(859.5, 5);
      expect(decodeIosClientMessage(buf)).to.deep.equal({
        kind: 'tap',
        x: 263.5,
        y: 859.5,
      });
    });

    it('decodes a swipe message', () => {
      const buf = Buffer.alloc(1 + 20);
      buf[0] = CLIENT_SWIPE_TAG;
      buf.writeFloatBE(380, 1);
      buf.writeFloatBE(463, 5);
      buf.writeFloatBE(40, 9);
      buf.writeFloatBE(463, 13);
      buf.writeUInt32BE(250, 17);
      expect(decodeIosClientMessage(buf)).to.deep.equal({
        kind: 'swipe',
        x1: 380,
        y1: 463,
        x2: 40,
        y2: 463,
        durationMs: 250,
      });
    });

    it('decodes HOME intent', () => {
      const buf = Buffer.from([CLIENT_INTENT_TAG, INTENT_HOME]);
      expect(decodeIosClientMessage(buf)).to.deep.equal({
        kind: 'intent',
        intent: 'home',
      });
    });

    it('decodes APP_SWITCHER intent', () => {
      const buf = Buffer.from([CLIENT_INTENT_TAG, INTENT_APP_SWITCHER]);
      expect(decodeIosClientMessage(buf)).to.deep.equal({
        kind: 'intent',
        intent: 'app_switcher',
      });
    });

    it('returns null for unknown tag', () => {
      const buf = Buffer.from([0xff, 0x00]);
      expect(decodeIosClientMessage(buf)).to.equal(null);
    });

    it('returns null for truncated tap payload', () => {
      const buf = Buffer.from([CLIENT_TAP_TAG, 0x00, 0x00]);
      expect(decodeIosClientMessage(buf)).to.equal(null);
    });
  });
});
