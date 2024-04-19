import { useEffect, useState } from 'react';
import { ISession } from '../../../interfaces/ISession';
import './capabilities.css';

interface CapabilitiesProps {
  session: ISession;
}

enum ActiveTab {
  DesiredCapabilities = 'desiredCapabilities',
  SessionCapabilities = 'sessionCapabilities',
}

function Capabilities({ session }: CapabilitiesProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.DesiredCapabilities);

  useEffect(() => {
    setActiveTab(ActiveTab.DesiredCapabilities);
  }, [session]);

  const renderKeyValuePairs = (data: string) => {
    const parsedData = JSON.parse(data);
    return Object.entries(parsedData).map(([key, value]) => (
      <div key={key} className="key-value-pair">
        <p className="key">{key}:</p>
        <p className="value">{JSON.stringify(value)}</p>
      </div>
    ));
  };

  const handleTabClick = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  function getVideoCompoment() {
    if (session.hasLiveVideo) {
      const source = `${
        window.location.protocol + '//' + window.location.host
      }/device-farm/api/dashboard/session/${session.id}/liveVideo`;
      return (
        <img
          src={source}
          style={{
            width: '250px',
            height: 'auto',
            margin: 'auto',
          }}
        />
      );
    } else if (session.videoRecording) {
      return (
        <video
          style={{
            maxHeight: '400px',
            height: 'auto',
            width: '100%',
          }}
          controls
          src={`${window.location.protocol + '//' + window.location.host}/device-farm/assets/${
            session.videoRecording
          }`}
        />
      );
    } else {
      return (
        <div
          style={{
            width: '100%',
            height: '300px',
            paddingTop: '25%',
            textAlign: 'center',
            fontSize: '18px',
          }}
        >
          <b>Video recording not available</b>
        </div>
      );
    }
  }

  return (
    <div className="capabilities">
      {getVideoCompoment()}
      {/* <div className="download">
        <a
          href={`${window.location.protocol + '//' + window.location.host}/device-farm/assets/${
            session.videoRecording
          }`}
          download={session.videoRecording}
        >
          Download
        </a>
      </div> */}
      <div className="tabs">
        <div
          className={`tab-header ${activeTab === ActiveTab.DesiredCapabilities ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.DesiredCapabilities)}
        >
          Desired Capabilities
        </div>
        <div
          className={`tab-header ${activeTab === ActiveTab.SessionCapabilities ? 'active' : ''}`}
          onClick={() => handleTabClick(ActiveTab.SessionCapabilities)}
        >
          Session Capabilities
        </div>
      </div>
      <div className="tab-content">
        {activeTab === ActiveTab.DesiredCapabilities &&
          renderKeyValuePairs(session.desiredCapabilities)}
        {activeTab === ActiveTab.SessionCapabilities &&
          renderKeyValuePairs(session.sessionCapabilities)}
      </div>
    </div>
  );
}

export default Capabilities;
