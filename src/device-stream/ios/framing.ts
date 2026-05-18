import type { IosMetaPayload, IosClientMessage } from '../types';
import {
  SRV_TAG_META,
  SRV_TAG_FRAME,
  CLIENT_TAP_TAG,
  CLIENT_SWIPE_TAG,
  CLIENT_INTENT_TAG,
  INTENT_HOME,
  INTENT_APP_SWITCHER,
} from '../types';

export function encodeIosMeta(payload: IosMetaPayload): Buffer {
  const json = Buffer.from(JSON.stringify(payload), 'utf-8');
  const out = Buffer.alloc(1 + json.length);
  out[0] = SRV_TAG_META;
  out.set(json, 1);
  return out;
}

export function encodeIosFrame(jpeg: Buffer): Buffer {
  const out = Buffer.alloc(1 + 4 + jpeg.length);
  out[0] = SRV_TAG_FRAME;
  out.writeUInt32BE(jpeg.length, 1);
  out.set(jpeg, 5);
  return out;
}

export function decodeIosClientMessage(buf: Buffer): IosClientMessage | null {
  if (buf.length < 1) return null;
  const tag = buf[0];

  if (tag === CLIENT_TAP_TAG) {
    if (buf.length < 1 + 8) return null;
    return {
      kind: 'tap',
      x: buf.readFloatBE(1),
      y: buf.readFloatBE(5),
    };
  }

  if (tag === CLIENT_SWIPE_TAG) {
    if (buf.length < 1 + 20) return null;
    return {
      kind: 'swipe',
      x1: buf.readFloatBE(1),
      y1: buf.readFloatBE(5),
      x2: buf.readFloatBE(9),
      y2: buf.readFloatBE(13),
      durationMs: buf.readUInt32BE(17),
    };
  }

  if (tag === CLIENT_INTENT_TAG) {
    if (buf.length < 2) return null;
    const code = buf[1];
    if (code === INTENT_HOME) return { kind: 'intent', intent: 'home' };
    if (code === INTENT_APP_SWITCHER) return { kind: 'intent', intent: 'app_switcher' };
    return null;
  }

  return null;
}
