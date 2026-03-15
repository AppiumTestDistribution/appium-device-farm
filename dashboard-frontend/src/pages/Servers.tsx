import {
    Apple,
    DnsRounded,
    FileDownload,
    KeyboardDoubleArrowDown,
    KeyboardDoubleArrowUp,
    OpenInNew,
    Terminal,
} from '@mui/icons-material';
import { Badge } from 'flowbite-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SiLinux, SiWindows } from 'react-icons/si';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import DeviceFarmApiService from '../api-service';
import Avatar from '../components/common/Avatar';
import { useAuth } from '../contexts/AuthContext';

interface Server {
  id: string;
  name: string;
  host: string;
  os: string;
  isHub: boolean;
  isOnline: boolean;
  tags: string;
  addedByUser?: {
    id: string;
    firstname: string;
    lastname: string;
  };
}

const ROW_HEIGHT = 20;

// Exported for reuse
export const getOSIcon = (os: string) => {
  switch (os.toLowerCase()) {
    case 'mac':
    case 'darwin':
      return <Apple fontSize="small" />;
    case 'win32':
    case 'windows':
      return <SiWindows fontSize="small" />;
    case 'linux':
      return <SiLinux fontSize="small" />;
    default:
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 1h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1m0 8h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m0 8h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1M8 5h1V3H8v2m0 8h1v-2H8v2m0 8h1v-2H8v2M5 3v2h2V3H5m0 8v2h2v-2H5m0 8v2h2v-2H5z" />
        </svg>
      );
  }
};

const Servers: React.FC = () => {
  const getModuleColor = (moduleName: string) => {
    const colors = [
      'text-blue-400',
      'text-green-400',
      'text-purple-400',
      'text-yellow-400',
      'text-pink-400',
      'text-cyan-400',
      'text-orange-400',
      'text-red-400',
    ];

    let hash = 0;
    for (let i = 0; i < moduleName.length; i++) {
      hash = moduleName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const [servers, setServers] = useState<Server[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);
  const streamRef = useRef<Response | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<FixedSizeList>(null);
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchNodes();
    return () => {
      cleanupStream();
    };
  }, []);

  const cleanupStream = async () => {
    if (readerRef.current) {
      try {
        await readerRef.current.cancel();
      } catch (error) {
        console.error('Error canceling reader:', error);
      }
      readerRef.current = null;
    }

    if (streamRef.current && streamRef.current.body) {
      try {
        streamRef.current.body.cancel();
      } catch (error) {
        console.error('Error canceling stream:', error);
      }
      streamRef.current = null;
    }
  };

  const fetchNodes = async () => {
    try {
      const response = await DeviceFarmApiService.getServers();
      setServers(response);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeClick = async (nodeId: string) => {
    if (selectedNode === nodeId) return;

    await cleanupStream();
    setSelectedNode(nodeId);
    setLogs([]); // Clear existing logs
    setLogsLoading(true); // Start loading

    try {
      const response = await DeviceFarmApiService.getAppiumLogForServer(nodeId);
      streamRef.current = response;

      const reader = response.body?.getReader();
      if (!reader) {
        setLogsLoading(false);
        return;
      }

      readerRef.current = reader;
      const decoder = new TextDecoder();
      let buffer = '';

      let done = false;
      while (!done) {
        try {
          const result = await reader.read();
          done = result.done;
          const value = result.value;

          if (done) {
            setLogsLoading(false);
            break;
          }

          const text = decoder.decode(value, { stream: true });
          buffer += text;

          // Split on newlines and process each line
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          const validLines = lines
            .filter((line) => line) // Remove empty lines
            .map((line) => {
              // Remove any standalone numbers at the start of the line
              return line.replace(/^\s*\d+\s*(?=\d{4}-\d{2}-\d{2})/, '');
            })
            .filter((line) => {
              // Filter out lines that are just numbers
              return !/^\s*\d+\s*$/.test(line);
            });

          if (validLines.length > 0) {
            setLogs((prevLogs) => [...prevLogs, ...validLines]);
            setLogsLoading(false);
          }
        } catch (error: any) {
          if (error.name === 'AbortError') {
            console.log('Stream aborted');
            break;
          } else {
            throw error;
          }
        }
      }

      // Process any remaining buffer content
      if (buffer) {
        const cleanedBuffer = buffer.replace(/^\s*\d+\s*(?=\d{4}-\d{2}-\d{2})/, '');
        if (cleanedBuffer && !/^\s*\d+\s*$/.test(cleanedBuffer)) {
          setLogs((prevLogs) => [...prevLogs, cleanedBuffer]);
        }
      }
    } catch (error: any) {
      console.error('Error streaming logs:', error);
      setLogs((prevLogs) => [...prevLogs, `Error: Failed to stream logs - ${error}`]);
      setLogsLoading(false);
    }
  };

  // Memoize the log processing function
  const processLogLine = useCallback((line: string) => {
    const timestampMatch = line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}:\d{3})/);
    const moduleMatch = line.match(/\[(.*?)\]/);

    if (!timestampMatch || !moduleMatch) {
      return {
        type: 'raw' as const,
        content: line,
      };
    }

    return {
      type: 'parsed' as const,
      timestamp: timestampMatch[1],
      moduleText: moduleMatch[0],
      remainingText: line.slice(timestampMatch[1].length + moduleMatch[0].length + 1),
      isDeviceFarmMain: moduleMatch[0].includes('device-farm-'),
    };
  }, []);

  // Memoize the row renderer
  const rowRenderer = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const log = logs[index];
      const processedLog = processLogLine(log);

      if (processedLog.type === 'raw') {
        return (
          <div
            style={{
              ...style,
              paddingBottom: '2px',
              paddingTop: '2px',
              width: 'fit-content',
              minWidth: '100%',
            }}
            className="text-[11px] leading-[18px] font-mono whitespace-pre text-left px-4 text-[#e6edf3] hover:bg-gray-800"
          >
            {processedLog.content}
          </div>
        );
      }

      return (
        <div
          style={{
            ...style,
            paddingBottom: '2px',
            paddingTop: '2px',
            width: 'fit-content',
            minWidth: '100%',
          }}
          className={`text-[11px] leading-[18px] font-mono whitespace-pre text-left px-4 hover:bg-gray-800 ${
            processedLog.isDeviceFarmMain ? 'text-gray-500' : ''
          }`}
        >
          <span className={processedLog.isDeviceFarmMain ? 'text-gray-500' : 'text-gray-400'}>
            {processedLog.timestamp}
          </span>
          <span
            className={
              processedLog.isDeviceFarmMain
                ? 'text-gray-500'
                : getModuleColor(processedLog.moduleText)
            }
          >
            {' ' + processedLog.moduleText}
          </span>
          <span className={processedLog.isDeviceFarmMain ? 'text-gray-500' : 'text-[#e6edf3]'}>
            {processedLog.remainingText}
          </span>
        </div>
      );
    },
    [logs, getModuleColor],
  );

  // Update the FixedSizeList to use the memoized row renderer
  const virtualizedList = useMemo(() => {
    return ({ height, width }: { height: number; width: number }) => (
      <div style={{ height, width }} className="overflow-x-auto">
        <div style={{ minWidth: '100%' }}>
          <FixedSizeList
            ref={listRef}
            height={height}
            width={width}
            itemCount={logs.length}
            itemSize={ROW_HEIGHT}
            overscanCount={5}
            className="scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
          >
            {rowRenderer}
          </FixedSizeList>
        </div>
      </div>
    );
  }, [logs.length, rowRenderer]);

  // Update the AutoSizer section to use the memoized list
  <AutoSizer>{virtualizedList}</AutoSizer>;

  // Add scroll handlers
  const scrollToTop = () => {
    listRef.current?.scrollTo(0);
  };

  const scrollToBottom = () => {
    listRef.current?.scrollTo(logs.length * ROW_HEIGHT);
  };

  const handleOpenInNewTab = () => {
    if (!selectedNode) return;
    const url = `/device-farm/api/dashboard/#/server/${selectedNode}/appium_logs`;
    window.open(url, '_blank');
  };

  const handleDownloadLogs = () => {
    if (!selectedNode || !logs.length) return;

    // Create text content
    const content = logs.join('\n');

    // Create blob
    const blob = new Blob([content], { type: 'text/plain' });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appium-logs-${selectedNode}-${new Date().toISOString()}.txt`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const LoadingAnimation = () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 border-2 border-t-transparent border-[#FDBC2C] rounded-full animate-spin"></div>
        <div className="text-sm text-gray-400 font-medium">Fetching logs...</div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-60px)]">
      {/* Left Panel - Node List */}
      <div className="w-1/4 min-w-[250px] max-w-[350px] p-4 border-r border-gray-700 overflow-y-auto bg-gray-900">
        <div className="flex items-center gap-2 mb-6">
          <DnsRounded className="text-gray-400" />
          <h2 className="text-xl font-bold text-white">Servers</h2>
        </div>

        {loading ? (
          <div className="text-gray-400">Loading Servers...</div>
        ) : (
          <div className="space-y-3">
            {servers
              .filter((server) => server.isOnline)
              .map((server) => (
                <div
                  key={server.id}
                  onClick={() => handleNodeClick(server.id)}
                  className={`
                    relative p-3 rounded-md cursor-pointer
                    border border-gray-700/50
                    transition-all duration-200
                    ${
                      selectedNode === server.id
                        ? 'bg-gray-800 border-blue-500/50'
                        : 'bg-gray-800/50 hover:bg-gray-800 hover:border-gray-600'
                    }
                  `}
                >
                  {/* First Row - Server Name and OS */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 font-mono text-sm">
                        💻 {server.name || server.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="flex items-center text-gray-400">
                        <span className="mr-1 flex items-center">{getOSIcon(server.os)}</span>
                        <span
                          className="text-sm font-normal text-gray-400 align-middle select-none"
                          style={{ lineHeight: 1 }}
                        >
                          {server.os.toLowerCase() === 'darwin' || server.os.toLowerCase() === 'mac'
                            ? 'Mac'
                            : server.os.toLowerCase() === 'win32' ||
                                server.os.toLowerCase() === 'windows'
                              ? 'Windows'
                              : server.os.toLowerCase() === 'linux'
                                ? 'Linux'
                                : server.os}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Second Row - Host URL */}
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-3 h-3 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                      <line x1="6" y1="6" x2="6" y2="6"></line>
                      <line x1="6" y1="18" x2="6" y2="18"></line>
                    </svg>
                    <span className="text-xs font-mono text-gray-400">{server.host}</span>
                  </div>

                  {server.addedByUser && (
                    <div className="flex items-center gap-2 mb-2 text-gray-400">
                      <span className="text-xs">Registered by:</span>
                      <Avatar
                        firstname={server.addedByUser.firstname}
                        lastname={server.addedByUser.lastname}
                        size="sm"
                        variant="text"
                      />
                      <span className="text-xs">
                        {server.addedByUser.firstname} {server.addedByUser.lastname}
                      </span>
                    </div>
                  )}

                  {/* Third Row - Actions and Status */}
                  <div className="flex items-center justify-between">
                    {/* <div className="flex items-center gap-2">
                      {isAdmin && (
                        <a
                          href={`/device-farm/#/servers/${server.id}/terminal`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 border border-blue-500/30 bg-blue-500/5 rounded-md text-blue-500 hover:bg-blue-500/10 hover:text-blue-700 font-medium text-xs transition-all duration-200"
                          aria-label="Open Terminal"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Terminal className="w-4 h-4 mr-1" />
                          Open Terminal
                        </a>
                      )}
                    </div> */}
                    <Badge
                      color={server.isHub ? 'purple' : 'success'}
                      size="sm"
                      className="px-2 py-0.5 text-xs font-medium whitespace-nowrap"
                    >
                      {server.isHub ? 'Hub' : 'Node'}
                    </Badge>
                  </div>

                  {selectedNode === server.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full"></div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Right Panel - Terminal */}
      <div className="flex-1 p-6">
        <div className="h-full border border-gray-700/50 overflow-hidden flex flex-col">
          {!selectedNode ? (
            <div className="flex-1 flex items-center justify-center bg-[#0D1117]">
              <div className="text-center max-w-md mx-auto p-8">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                  <div className="relative">
                    <Terminal className="w-20 h-20 mx-auto text-blue-400/80 mb-2" />
                    <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-blue-400/60">
                      <span className="w-2 h-2 rounded-full bg-blue-400/60 animate-pulse"></span>
                      <span className="w-2 h-2 rounded-full bg-blue-400/60 animate-pulse delay-100"></span>
                      <span className="w-2 h-2 rounded-full bg-blue-400/60 animate-pulse delay-200"></span>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-200 mb-3">Appium Server Logs</h3>

                <p className="text-gray-400 mb-6 leading-relaxed">
                  Select a server from the sidebar to view its Appium server logs in real-time.
                </p>

                <div className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white/5 px-4 py-2 rounded-lg">
                  <DnsRounded className="w-4 h-4" />
                  <span>Available Servers: {servers.length}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-700/80 bg-gradient-to-r from-gray-900 to-[#0D1117] shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)]">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#FDBC2C]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
                    </div>
                    <div className="h-4 w-px bg-gray-700/50"></div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Terminal className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center space-x-2">
                      <h2 className="text-gray-200 font-medium">Appium Logs</h2>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-400 font-medium">
                        {selectedNode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleOpenInNewTab}
                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-white/5 transition-all duration-200 group"
                    title="Open in new tab"
                  >
                    <OpenInNew className="w-5 h-5" />
                  </button>

                  <div className="w-px h-4 bg-gray-700/50"></div>

                  <button
                    onClick={handleDownloadLogs}
                    className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-white/5 transition-all duration-200"
                    title="Download logs"
                    disabled={!logs.length}
                  >
                    <FileDownload className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div ref={terminalRef} className="flex-1 overflow-hidden bg-[#0D1117] relative">
                {logsLoading ? (
                  <LoadingAnimation />
                ) : (
                  <div className="h-full w-full">
                    <AutoSizer>{virtualizedList}</AutoSizer>
                  </div>
                )}

                {/* Floating Scroll Buttons */}
                {logs.length > 0 && (
                  <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
                    <button
                      onClick={scrollToTop}
                      className="p-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-full text-gray-400 hover:text-gray-300 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                      title="Scroll to Top"
                    >
                      <KeyboardDoubleArrowUp className="w-5 h-5" />
                    </button>
                    <button
                      onClick={scrollToBottom}
                      className="p-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-full text-gray-400 hover:text-gray-300 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                      title="Scroll to Bottom"
                    >
                      <KeyboardDoubleArrowDown className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Servers;
