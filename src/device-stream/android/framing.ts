import {
  SRV_TAG_META,
  SRV_TAG_CONFIG,
  SRV_TAG_DATA,
  CLIENT_TOUCH_TAG,
  CLIENT_KEYCODE_TAG,
} from '../types';

export function encodeMeta(meta: unknown): Buffer {
  const json = Buffer.from(JSON.stringify(meta), 'utf-8');
  const out = Buffer.alloc(1 + json.length);
  out[0] = SRV_TAG_META;
  out.set(json, 1);
  return out;
}

export function encodeConfig(data: Uint8Array): Buffer {
  const out = Buffer.alloc(1 + data.length);
  out[0] = SRV_TAG_CONFIG;
  out.set(data, 1);
  return out;
}

export function encodeData(
  pts: bigint | undefined,
  data: Uint8Array,
): Buffer {
  const out = Buffer.alloc(1 + 8 + data.length);
  out[0] = SRV_TAG_DATA;
  out.writeBigUInt64LE(pts ?? 0n, 1);
  out.set(data, 9);
  return out;
}

export interface ClientTouchMessage {
  action: number;
  normX: number;
  normY: number;
}

export function decodeClientTouchMessage(
  raw: Buffer,
): ClientTouchMessage | null {
  if (raw.length < 1 + 1 + 4 + 4) return null;
  if (raw[0] !== CLIENT_TOUCH_TAG) return null;
  return {
    action: raw[1]!,
    normX: raw.readFloatBE(2),
    normY: raw.readFloatBE(6),
  };
}

export interface ClientKeycodeMessage {
  keycode: number;
}

export function decodeClientKeycodeMessage(
  raw: Buffer,
): ClientKeycodeMessage | null {
  if (raw.length < 1 + 4) return null;
  if (raw[0] !== CLIENT_KEYCODE_TAG) return null;
  return { keycode: raw.readUInt32BE(1) };
}
