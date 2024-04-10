import { ISession } from '../../../interfaces/ISession';
import AndroidIcon from '../../../assets/android-new-icon.svg';
import AppleIcon from '../../../assets/apple-new-icon.svg';
import MobileIcon from '../../../assets/mobile-icon.svg';
import './session-info.css';

function SessionInfo({ session }: { session: ISession }) {
  function runningTime(startTime: string | number | Date, endTime?: string | number | Date | null) {
    const startDate = new Date(startTime);
    const endDate = endTime ? new Date(endTime) : new Date();
    const elapsedTime = Number(endDate) - Number(startDate);

    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
  }

  function getAppName(capabilities: string) {
    const capabilitiesObject = JSON.parse(capabilities);
    return capabilitiesObject.appPackage || '-';
  }

  return (
    <div className="session-info-container">
      <div className="session-info">
        <div className="session-info-column">
          <div className="session-info-item">
            <p className="session-info-item_title">Session Id:</p>
            <p className="session-info-item_value">{session.id}</p>
          </div>
          <div className="session-info-item">
            <p className="session-info-item_title">Start Time:</p>
            <p className="session-info-item_value">{session.startTime}</p>
          </div>
          <div className="session-info-item">
            <p className="session-info-item_title">Device Name:</p>
            <div className="session-info-item_value">
              <img src={MobileIcon} alt="device icon" />
              <p>{session.deviceName}</p>
            </div>
          </div>
        </div>
        <div className="session-info-column">
          <div className="session-info-item">
            <p className="session-info-item_title">OS:</p>
            <div className="session-info-item_value">
              <img
                src={session.devicePlatform === 'android' ? AndroidIcon : AppleIcon}
                alt="device platform"
              />
              <p>{session.devicePlatform}</p>
            </div>
          </div>
          <div className="session-info-item">
            <p className="session-info-item_title">End Time:</p>
            <p className="session-info-item_value">{session.endTime || session.status}</p>
          </div>
          <div className="session-info-item">
            <p className="session-info-item_title">UDID:</p>
            <p className="session-info-item_value">{session.deviceUDID}</p>
          </div>
        </div>
        <div className="session-info-column">
          <div className="session-info-item">
            <p className="session-info-item_title">OS Version:</p>
            <p className="session-info-item_value">{session.deviceVersion}</p>
          </div>
          <div className="session-info-item">
            <p className="session-info-item_title">Duration:</p>
            <p className="session-info-item_value">
              {runningTime(session.startTime, session.endTime)}
            </p>
          </div>
          <div className="session-info-item">
            <p className="session-info-item_title">App:</p>
            <p className="session-info-item_value">{getAppName(session.sessionCapabilities)}</p>
          </div>
        </div>
      </div>
      {session.status?.toLowerCase() == 'running' && (
        <div className="session-running-indicator"></div>
      )}
    </div>
  );
}

export default SessionInfo;
