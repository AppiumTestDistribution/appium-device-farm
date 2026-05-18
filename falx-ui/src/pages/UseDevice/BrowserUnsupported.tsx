import { Link } from 'react-router-dom';

type Props = {
  platform?: 'android' | 'ios';
};

export function BrowserUnsupported({ platform }: Props) {
  const needsWebCodecs = platform !== 'ios'; // Android (or unknown) needs VideoDecoder.

  const heading = needsWebCodecs
    ? 'Use Device requires Chrome or Edge'
    : 'Browser not supported for iOS streaming';

  const message = needsWebCodecs
    ? 'This Android device requires Chrome or Edge (WebCodecs / VideoDecoder).'
    : 'This browser does not support iOS streaming (missing createImageBitmap).';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">{heading}</h1>
      <p className="text-gray-700 max-w-md text-center">{message}</p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to devices
      </Link>
    </div>
  );
}

export function isBrowserSupportedForPlatform(
  platform: 'android' | 'ios',
): boolean {
  if (platform === 'ios') {
    return typeof (globalThis as any).createImageBitmap === 'function';
  }
  return typeof (globalThis as any).VideoDecoder !== 'undefined';
}
