import { useEffect, useState } from 'react';
import TextLogs from './text-logs/text-logs';
import DeviceFarmApiService from '../../../api-service';
import DeviceLogs from './device-logs/device-log';
import { IDeviceLogs } from '../../../interfaces/IDeviceLogs';
import { ISession } from '../../../interfaces/ISession';
import AppProfiling from './app-profiling/app-profiling';
import { IAppProfilingLogs } from '../../../interfaces/IAppProfilingLogs';

function SessionLogs(props: { session: ISession }) {
  const { session } = props;
  const [url, setBaseUrl] = useState<string>();
  const sessionId = session.id;
  const [sessionLogs, setSessionLogs] = useState([]);
  const [deviceLogs, setDeviceLogs] = useState<IDeviceLogs[]>([]);
  const [showImages, setShowImages] = useState(false);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('text-logs');
  const [appProfilingLogs, setAppProfilingLogs] = useState<IAppProfilingLogs | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const sessionLogs = await DeviceFarmApiService.getSessionLogs(sessionId as string);
        setSessionLogs(sessionLogs);
        const baseURL = window.location.protocol + '//' + window.location.host;
        setBaseUrl(baseURL);
      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, []);

  async function fetchDeviceLogs() {
    if (session.deviceLogs) {
      const deviceLogs = await DeviceFarmApiService.getDeviceLogs(sessionId as string);
      setDeviceLogs(deviceLogs);
    } else {
      setDeviceLogs([]);
    }
  }

  async function fetchAppProfilingLogs() {
    if (session.appProfiling) {
      const appProfiling = await DeviceFarmApiService.getAppProfiling(sessionId as string);
      setAppProfilingLogs(appProfiling);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div aria-label="Tabs" role="tablist" className="flex border-b border-gray-700">
        <button
          type="button"
          onClick={() => setActiveTab('text-logs')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
            ${
              activeTab === 'text-logs'
                ? 'text-gray-200 border-gray-200'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-400'
            }`}
        >
          Text Logs
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('device-logs');
            fetchDeviceLogs();
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
            ${
              activeTab === 'device-logs'
                ? 'text-gray-200 border-gray-200'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-400'
            }`}
        >
          Device Logs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('debug-logs')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
            ${
              activeTab === 'debug-logs'
                ? 'text-gray-200 border-gray-200'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-400'
            }`}
        >
          Debug Logs
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('app-profiling');
            fetchAppProfilingLogs();
          }}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors
            ${
              activeTab === 'app-profiling'
                ? 'text-gray-200 border-gray-200'
                : 'text-gray-400 border-transparent hover:text-gray-300 hover:border-gray-400'
            }`}
        >
          App Profiling
        </button>
      </div>

      {/* Log Controls */}
      {activeTab === 'text-logs' && (
        <div className="flex items-center gap-4 p-4 border-b border-gray-700">
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showImages}
              onChange={() => setShowImages(!showImages)}
              className="w-4 h-4 bg-gray-700 border-gray-600 rounded"
            />
            Show Screenshots
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={showErrorsOnly}
              onChange={() => setShowErrorsOnly(!showErrorsOnly)}
              className="w-4 h-4 bg-gray-700 border-gray-600 rounded"
            />
            Show Errors Only
          </label>
        </div>
      )}

      {/* Log Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'text-logs' && (
          <TextLogs
            sessionLogs={sessionLogs}
            showImages={showImages}
            showErrorsOnly={showErrorsOnly}
            baseUrl={url}
          />
        )}
        {activeTab === 'device-logs' && <DeviceLogs deviceLogs={deviceLogs} />}
        {activeTab === 'app-profiling' && (
          <AppProfiling appProfilingLogs={appProfilingLogs as any} session={session} />
        )}
      </div>
    </div>
  );
}

export default SessionLogs;
