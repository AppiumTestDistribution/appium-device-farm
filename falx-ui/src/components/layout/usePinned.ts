import { useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'falx.sidebar.pinned';

function readInitial(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function usePinned(): [boolean, (next: boolean) => void] {
  const [pinned, setPinnedState] = useState<boolean>(readInitial);

  const setPinned = useCallback((next: boolean) => {
    setPinnedState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // localStorage may be disabled; silent.
    }
  }, []);

  // Keyboard shortcut: `[` toggles pin.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== '[') return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      setPinned(!pinned);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pinned, setPinned]);

  return [pinned, setPinned];
}
