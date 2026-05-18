import { Home, Square, X } from 'lucide-react';
import { IOSStreamHandle } from './IOSStreamCanvas';

export interface IOSControlToolbarProps {
  /** Imperative handle exposed by IOSStreamCanvas via handleRef. */
  streamHandle: IOSStreamHandle | null;
  onStop: () => void;
}

export function IOSControlToolbar({ streamHandle, onStop }: IOSControlToolbarProps) {
  return (
    <div className="flex gap-2 p-2 rounded-md bg-white shadow border border-gray-200">
      <button
        title="Home"
        onClick={() => streamHandle?.sendIntent('home')}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <Home size={20} />
      </button>
      <button
        title="App Switcher"
        onClick={() => streamHandle?.sendIntent('app_switcher')}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <Square size={20} />
      </button>
      <div className="flex-1" />
      <button
        title="Stop"
        onClick={onStop}
        className="p-2 hover:bg-red-50 text-red-600 rounded"
      >
        <X size={20} />
      </button>
    </div>
  );
}
