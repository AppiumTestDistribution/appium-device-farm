import debounce from 'lodash/debounce';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IDeviceLogs } from '../../../../interfaces/IDeviceLogs';

interface DeviceLogsProps {
  deviceLogs: IDeviceLogs[] | null;
}

function DeviceLogs({ deviceLogs }: DeviceLogsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search update
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedQuery(value);
    }, 300),
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debouncedSetSearch(value);
  };

  const matches = useMemo(() => {
    if (!debouncedQuery.trim() || !deviceLogs) return [];
    return deviceLogs.reduce(
      (acc, log, lineIndex) => {
        const lowerMessage = log.message.toLowerCase();
        const lowerQuery = debouncedQuery.toLowerCase();
        let position = 0;
        let index = lowerMessage.indexOf(lowerQuery, position);
        while (index !== -1) {
          acc.push({ lineIndex, startIndex: index, endIndex: index + debouncedQuery.length });
          position = index + 1;
          index = lowerMessage.indexOf(lowerQuery, position);
        }
        return acc;
      },
      [] as Array<{ lineIndex: number; startIndex: number; endIndex: number }>,
    );
  }, [deviceLogs, debouncedQuery]);

  useEffect(() => {
    setCurrentMatchIndex(0);
  }, [debouncedQuery]);

  useEffect(() => {
    if (matches.length > 0 && containerRef.current) {
      const currentMatch = matches[currentMatchIndex];
      const element = containerRef.current.querySelector(`[data-line="${currentMatch.lineIndex}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentMatchIndex, matches]);

  const highlightText = (text: string, lineIndex: number) => {
    if (!debouncedQuery.trim()) return text;

    const lineMatches = matches.filter((m) => m.lineIndex === lineIndex);
    if (lineMatches.length === 0) return text;

    const parts = [];
    let lastIndex = 0;

    lineMatches.forEach((match, idx) => {
      // Add text before match
      parts.push(text.slice(lastIndex, match.startIndex));
      // Add highlighted match
      const isCurrentMatch = matches.indexOf(match) === currentMatchIndex;
      parts.push(
        <span
          key={idx}
          className={`${
            isCurrentMatch ? 'bg-amber-500/70 text-gray-900' : 'bg-amber-500/40 text-gray-900'
          }`}
        >
          {text.slice(match.startIndex, match.endIndex)}
        </span>,
      );
      lastIndex = match.endIndex;
    });
    // Add remaining text
    parts.push(text.slice(lastIndex));

    return parts;
  };

  const navigateMatches = (direction: 'next' | 'prev') => {
    if (matches.length === 0) return;
    if (direction === 'next') {
      setCurrentMatchIndex((prev) => (prev + 1) % matches.length);
    } else {
      setCurrentMatchIndex((prev) => (prev - 1 + matches.length) % matches.length);
    }
  };

  return (
    <div className="bg-[#1A1B26] rounded-lg border border-gray-800/20 shadow-xl flex flex-col">
      <div className="border-b border-gray-800/20 px-3 py-2 sticky top-0 bg-[#1A1B26] z-10">
        <div className="relative max-w-xs flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
              <Search className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              className="w-full bg-[#1E1F2E] text-gray-100 text-[11.5px] rounded-md pl-9 pr-4 py-1.5 border border-gray-800/30 
                       placeholder:text-gray-600 focus:outline-none focus:border-gray-700/50 focus:ring-1 focus:ring-gray-700/50
                       font-[ui-monospace,SFMono-Regular,SF_Mono,Consolas,Liberation_Mono,Menlo,monospace]"
              placeholder="Search logs"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {matches.length > 0 && (
            <>
              <div className="text-gray-500 text-[11px]">
                {currentMatchIndex + 1}/{matches.length}
              </div>
              <button
                onClick={() => navigateMatches('prev')}
                className="p-1 hover:bg-gray-800/30 rounded transition-colors"
              >
                <ArrowUp className="w-4 h-4 text-gray-500" />
              </button>
              <button
                onClick={() => navigateMatches('next')}
                className="p-1 hover:bg-gray-800/30 rounded transition-colors"
              >
                <ArrowDown className="w-4 h-4 text-gray-500" />
              </button>
            </>
          )}
        </div>
      </div>
      <div
        ref={containerRef}
        className="device-log-container font-[ui-monospace,SFMono-Regular,SF_Mono,Consolas,Liberation_Mono,Menlo,monospace] text-[11.5px] leading-[18px] h-[600px] overflow-auto flex-1"
      >
        {deviceLogs && deviceLogs.length ? (
          <div className="py-3">
            {deviceLogs.map((log, i) => (
              <div
                data-line={i}
                className="flex items-start hover:bg-[#1E1F2E] group"
                key={`log-line-${i}`}
              >
                <span
                  className="text-gray-500 select-none w-[2.5em] pl-4 py-[2px] flex-shrink-0 group-hover:text-gray-400 transition-colors"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {i + 1}
                </span>
                <span className="text-gray-100 pl-4 pr-6 py-[2px] min-w-0 whitespace-pre-wrap break-all border-l border-gray-800/20 text-left">
                  {highlightText(log.message, i)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[600px] text-gray-200 text-sm">
            Device log not available
          </div>
        )}
      </div>
    </div>
  );
}

export default DeviceLogs;
