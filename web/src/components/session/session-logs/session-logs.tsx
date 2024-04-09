import { useEffect, useState } from 'react';
import './session-logs.css';
import { ISessionLogs } from '../../../interfaces/ISessionLogs';
import TextLogs from './text-logs/text-logs';
import DeviceFarmApiService from '../../../api-service';

enum ActiveTab {
  TextLogs = 'textLogs',
  DeviceLogs = 'deviceLogs',
  DebugLogs = 'debugLogs',
  AppProfiling = 'appProfiling',
}

function SessionLogs({ sessionId }: any) {
  const [url, setBaseUrl] = useState<string>();
  const [sessionLogs, setSessionLogs] = useState<ISessionLogs[]>([]);
  const [showImages, setShowImages] = useState(false);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.TextLogs);

  useEffect(() => {
    async function init() {
      try {
        const sessionLogs = await DeviceFarmApiService.getSessionLogs(sessionId);
        setSessionLogs(sessionLogs);
        const baseURL = window.location.protocol + '//' + window.location.host;
        setBaseUrl(baseURL);
        console.log('Base URL:', url);
      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, []);

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
        <div
          className={`tab-header ${activeTab === ActiveTab.DeviceLogs ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.DeviceLogs)}
        >
          Device Logs
        </div>
        <div
          className={`tab-header ${activeTab === ActiveTab.DebugLogs ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.DebugLogs)}
        >
          Debug Logs
        </div>
        <div
          className={`tab-header ${activeTab === ActiveTab.AppProfiling ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.AppProfiling)}
        >
          App Profiling
        </div>
      </div>
      <div className="tab-filter">
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="show-images"
            checked={showImages}
            onChange={() => setShowImages(!showImages)}
          />
          <label htmlFor="show-images">Show Images</label>
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="show-errors"
            checked={showErrorsOnly}
            onChange={() => setShowErrorsOnly(!showErrorsOnly)}
          />
          <label htmlFor="show-errors">Show Errors Only</label>
        </div>
      </div>
      <div className="tab-content">
        {activeTab === ActiveTab.TextLogs && (
          <TextLogs
            sessionLogs={sessionLogs}
            showImages={showImages}
            showErrorsOnly={showErrorsOnly}
            baseUrl={url}
          />
        )}
      </div>
    </div>
  );
}

export default SessionLogs;
