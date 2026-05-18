// src/device-stream/types.ts

export type Platform = 'android' | 'ios';

export type UseDeviceSessionState =
  | 'starting'
  | 'running'
  | 'stopping'
  | 'terminated';

export interface UseDeviceSession {
  /** Appium session ID — reused as the public session identifier. */
  sessionId: string;
  /** Device UDID. */
  udid: string;
  /** Platform. iOS is not yet implemented but the type is in place. */
  platform: Platform;
  /** State machine current value. */
  state: UseDeviceSessionState;
  /** Encoded video width in device pixels (after scrcpy maxSize downscale). */
  deviceWidth: number;
  /** Encoded video height. */
  deviceHeight: number;
  /** Created-at epoch ms. */
  createdAt: number;
}

export interface StartUseDeviceRequest {
  udid: string;
}

export interface StartUseDeviceResponse {
  sessionId: string;
  streamUrl: string;
  platform: Platform;
  deviceWidth: number;
  deviceHeight: number;
  /** iOS only: screen scale factor (typically 2 or 3). Omitted for Android. */
  scale?: number;
}

/** Server → client WS message tags. */
export const SRV_TAG_META = 0x01;
export const SRV_TAG_CONFIG = 0x02;
export const SRV_TAG_DATA = 0x03;

/** Client → server WS message tags. */
export const CLIENT_TOUCH_TAG = 0x10;
export const CLIENT_KEYCODE_TAG = 0x11;

/** Server → client WS message tag (iOS): raw JPEG frame payload. */
export const SRV_TAG_FRAME = 0x04;

/** Client → server WS message tags (iOS). */
export const CLIENT_TAP_TAG = 0x20;
export const CLIENT_SWIPE_TAG = 0x21;
export const CLIENT_INTENT_TAG = 0x22;

/** Intent codes carried by CLIENT_INTENT_TAG (one-byte body). */
export const INTENT_HOME = 0x01;
export const INTENT_APP_SWITCHER = 0x02;

/** Payload types shared across iOS framing + bridge + router. */
export interface IosMetaPayload {
  deviceWidthPoints: number;
  deviceHeightPoints: number;
  deviceWidthPixels: number;
  deviceHeightPixels: number;
  scale: number;
}

export interface IosTapMessage {
  kind: 'tap';
  x: number;
  y: number;
}

export interface IosSwipeMessage {
  kind: 'swipe';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  durationMs: number;
}

export interface IosIntentMessage {
  kind: 'intent';
  intent: 'home' | 'app_switcher';
}

export type IosClientMessage = IosTapMessage | IosSwipeMessage | IosIntentMessage;

/** Android key codes (subset used by the toolbar). */
export const KEYCODE_BACK = 4;
export const KEYCODE_HOME = 3;
export const KEYCODE_APP_SWITCH = 187; // recents

/** Pointer actions matching Android MotionEvent. */
export const ACTION_DOWN = 0;
export const ACTION_UP = 1;
export const ACTION_MOVE = 2;
