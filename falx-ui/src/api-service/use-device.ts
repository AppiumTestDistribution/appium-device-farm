import apiClient from './api-client';

export interface StartUseDeviceResponse {
  sessionId: string;
  streamUrl: string;
  platform: 'android' | 'ios';
  deviceWidth: number;
  deviceHeight: number;
  /** iOS-only screen scale factor (pixels per point). Returned by the backend for iOS sessions. */
  scale?: number;
}

/**
 * Wraps the api-client's "returns Response on non-2xx" quirk so callers see a
 * thrown Error with the backend's message instead of a Response object.
 */
async function unwrap<T>(result: T | Response): Promise<T> {
  if (result instanceof Response) {
    let message = `Request failed: ${result.status}`;
    try {
      const body = await result.json();
      message = body.message ?? body.error ?? message;
    } catch {
      // ignore body-parse failures; fall back to default message
    }
    throw new Error(message);
  }
  return result;
}

export async function createUseDeviceSession(
  udid: string,
): Promise<StartUseDeviceResponse> {
  const result = await apiClient.makePOSTRequest(
    '/dashboard/use-device/start',
    {},
    { udid },
  );
  return unwrap<StartUseDeviceResponse>(result);
}

export async function endUseDeviceSession(sessionId: string): Promise<void> {
  const result = await apiClient.makePOSTRequest(
    `/dashboard/use-device/stop/${sessionId}`,
    {},
    {},
  );
  await unwrap<unknown>(result);
}
