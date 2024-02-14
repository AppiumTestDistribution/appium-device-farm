import { useState } from 'react';
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

  return (
    <div className="capabilities">
      <video controls src={`${window.location.protocol + '//' + window.location.host}/device-farm/assets/${session.video_recording}`}/>
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
        {activeTab === ActiveTab.DesiredCapabilities && renderKeyValuePairs(session.desired_capabilities)}
        {activeTab === ActiveTab.SessionCapabilities && renderKeyValuePairs(session.session_capabilities)}
      </div>
    </div>
  );
}

export default Capabilities;
