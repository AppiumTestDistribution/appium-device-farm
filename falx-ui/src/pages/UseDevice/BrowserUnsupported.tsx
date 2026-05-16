import { Link } from 'react-router-dom';

export function BrowserUnsupported() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h1 className="text-2xl font-semibold text-gray-900">
        Use Device requires Chrome or Edge
      </h1>
      <p className="text-gray-700 max-w-md text-center">
        This page streams the device screen using H.264 video decoding in your
        browser. Your current browser does not support the required
        <code className="px-1 py-0.5 mx-1 bg-gray-100 rounded">WebCodecs</code>
        API. Please open Falx in Chrome or Edge to use this feature.
      </p>
      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Back to devices
      </Link>
    </div>
  );
}
