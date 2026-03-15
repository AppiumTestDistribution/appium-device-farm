import { useEffect, useState } from 'react';
import { ISession } from '../../../interfaces/ISession';
import './capabilities.css';
import '../style.css';

interface CapabilitiesProps {
  session: ISession;
}

enum ActiveTab {
  DesiredCapabilities = 'desiredCapabilities',
  SessionCapabilities = 'sessionCapabilities',
}

function Capabilities({ session }: CapabilitiesProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.DesiredCapabilities);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    setActiveTab(ActiveTab.DesiredCapabilities);
  }, [session]);

  // Add fullscreen handlers
  const toggleFullScreen = (element: HTMLDivElement) => {
    if (!document.fullscreenElement) {
      element.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const renderKeyValuePairs = (data: string) => {
    const parsedData = JSON.parse(data);
    return (
      <div className="relative overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs font-medium text-gray-400 bg-gray-800/50">
            <tr>
              <th className="px-3 py-2 border-b border-gray-700 w-1/3">Key</th>
              <th className="px-3 py-2 border-b border-gray-700">Value</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {Object.entries(parsedData).map(([key, value]) => (
              <tr key={key} className="border-b border-gray-700/50">
                <td className="px-3 py-2 align-top font-medium text-gray-400">{key}</td>
                <td className="px-3 py-2 text-gray-300">
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  function getVideoComponent() {
    if (session.hasLiveVideo) {
      return (
        <div className="relative group">
          <div
            className="aspect-video bg-gray-800 border border-gray-700/50 rounded-sm overflow-hidden"
            ref={(el) => {
              if (el) {
                el.onfullscreenchange = () => setIsFullScreen(!!document.fullscreenElement);
              }
            }}
          >
            <img
              src={`${window.location.protocol}//${window.location.host}/device-farm/api/dashboard/session/${session.id}/liveVideo`}
              className="w-full h-full object-contain"
              alt="Live Video"
            />
            <button
              onClick={(e) => toggleFullScreen(e.currentTarget.parentElement as HTMLDivElement)}
              className="absolute bottom-2 right-2 p-1.5 bg-gray-800/70 rounded-md hover:bg-gray-700/70 transition-colors"
              title={isFullScreen ? 'Exit full screen' : 'Enter full screen'}
            >
              {isFullScreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19v-2m-6 2v-2M15 5v2m-6-2v2M5 15h2m-2-6h2m12 6h-2m2-6h-2"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 3h6v6M9 3H3v6m12 12h6v-6M3 15v6h6"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      );
    }

    if (session.videoRecording) {
      return (
        <div className="aspect-video bg-gray-800 border border-gray-700/50 rounded-sm overflow-hidden">
          <video
            controls
            className="w-full h-full"
            src={`${window.location.protocol}//${window.location.host}/device-farm/assets/${session.videoRecording}`}
          />
        </div>
      );
    }

    return (
      <div className="aspect-video bg-gray-800 border border-gray-700/50 rounded-sm flex items-center justify-center">
        <span className="text-sm text-gray-400 font-medium">Video recording not available</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {getVideoComponent()}

      <div className="border border-gray-700/50 rounded-sm overflow-hidden">
        <div className="flex border-b border-gray-700/50">
          {[
            { id: ActiveTab.DesiredCapabilities, label: 'Desired Capabilities' },
            { id: ActiveTab.SessionCapabilities, label: 'Session Capabilities' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors
                ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-gray-200'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="h-[calc(100vh-32rem)] overflow-y-auto">
          {activeTab === ActiveTab.DesiredCapabilities &&
            renderKeyValuePairs(session.desiredCapabilities)}
          {activeTab === ActiveTab.SessionCapabilities &&
            renderKeyValuePairs(session.sessionCapabilities)}
        </div>
      </div>
    </div>
  );
}

export default Capabilities;
