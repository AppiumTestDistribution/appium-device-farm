import { ArrowLeft, Home, Square, X } from 'lucide-react';

const KEYCODE_BACK = 4;
const KEYCODE_HOME = 3;
const KEYCODE_APP_SWITCH = 187;

interface Props {
  onKey(keycode: number): void;
  onStop(): void;
}

export function ControlToolbar(props: Props) {
  return (
    <div className="flex gap-2 p-2 rounded-md bg-white shadow border border-gray-200">
      <button
        title="Back"
        onClick={() => props.onKey(KEYCODE_BACK)}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <ArrowLeft size={20} />
      </button>
      <button
        title="Home"
        onClick={() => props.onKey(KEYCODE_HOME)}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <Home size={20} />
      </button>
      <button
        title="Recents"
        onClick={() => props.onKey(KEYCODE_APP_SWITCH)}
        className="p-2 hover:bg-gray-100 rounded"
      >
        <Square size={20} />
      </button>
      <div className="flex-1" />
      <button
        title="Stop"
        onClick={props.onStop}
        className="p-2 hover:bg-red-50 text-red-600 rounded"
      >
        <X size={20} />
      </button>
    </div>
  );
}
