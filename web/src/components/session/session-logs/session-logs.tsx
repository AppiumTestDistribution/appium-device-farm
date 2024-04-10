import { useEffect, useState } from 'react';
import './session-logs.css';
import { ISessionLogs } from '../../../interfaces/ISessionLogs';
import TextLogs from './text-logs/text-logs';
import DeviceFarmApiService from '../../../api-service';
import DeviceLogs from './device-logs/device-log';
import { IDeviceLogs } from '../../../interfaces/IDeviceLogs';
import { useParams } from 'react-router-dom';
import { ISession } from '../../../interfaces/ISession';
import { IAppProfilingLogs } from '../../../interfaces/IAppProfilingLogs';
import AppProfiling from './app-profiling/app-profiling';

enum ActiveTab {
  TextLogs = 'textLogs',
  DeviceLogs = 'deviceLogs',
  DebugLogs = 'debugLogs',
  AppProfiling = 'appProfiling',
}

function SessionLogs(props: { session: ISession }) {
  const { session } = props;
  const [url, setBaseUrl] = useState<string>();
  const { sessionId } = useParams();
  const [sessionLogs, setSessionLogs] = useState<ISessionLogs[]>([]);
  const [deviceLogs, setDeviceLogs] = useState<IDeviceLogs[]>([]);
  const [appProfilingLogs, setAppProfilingLogs] = useState<IAppProfilingLogs | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.TextLogs);

  useEffect(() => {
    async function init() {
      try {
        const sessionLogs = await DeviceFarmApiService.getSessionLogs(sessionId as string);
        setSessionLogs(sessionLogs);
        if (session.deviceLogs) {
          const deviceLogs = await DeviceFarmApiService.getDeviceLogs(sessionId as string);
          setDeviceLogs(deviceLogs);
        } else {
          setDeviceLogs([]);
        }
        if (session.appProfiling) {
          const appProfiling = await DeviceFarmApiService.getAppProfiling(sessionId as string);
          setAppProfilingLogs(appProfiling);
        }
        const baseURL = window.location.protocol + '//' + window.location.host;
        setBaseUrl(baseURL);
        console.log('Base URL:', url);
      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, [sessionId, url]);

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  return (
    <div className="session-logs">
      <div className="tabs">
        <div
          className={`tab-header ${activeTab === ActiveTab.TextLogs ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.TextLogs)}
        >
          Text Logs
        </div>
        {session.deviceLogs && (
          <div
            className={`tab-header ${activeTab === ActiveTab.DeviceLogs ? 'active' : ''}`}
            onClick={() => handleTabClick(ActiveTab.DeviceLogs)}
          >
            Device Logs
          </div>
        )}
        {/* <div
          className={`tab-header ${activeTab === ActiveTab.DebugLogs ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.DebugLogs)}
        >
          Debug Logs
        </div> */}
        {session.appProfiling && (
          <div
            className={`tab-header ${activeTab === ActiveTab.AppProfiling ? 'active' : ''}`}
            onClick={() => handleTabClick(ActiveTab.AppProfiling)}
          >
            App Profiling
          </div>
        )}
      </div>
      <div className="tab-content">
        {activeTab === ActiveTab.TextLogs && <TextLogs sessionLogs={sessionLogs} baseUrl={url} />}
        {activeTab === ActiveTab.DeviceLogs && <DeviceLogs deviceLogs={deviceLogs} />}
        {activeTab === ActiveTab.AppProfiling && (
          <AppProfiling appProfilingLogs={appProfilingLogs as any} session={session} />
        )}
      </div>
    </div>
  );
}

export default SessionLogs;
