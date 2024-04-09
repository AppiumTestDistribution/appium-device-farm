import './build-container.css';
import ToolsIcon from '../../assets/tools-icon.svg';
import TimeIcon from '../../assets/time-icon.svg';
import AndroidIcon from '../../assets/android-new-icon.svg';
import AppleIcon from '../../assets/apple-new-icon.svg';
import { IBuild } from '../../interfaces/IBuild';
import { ISession } from '../../interfaces/ISession';
import { useNavigate } from 'react-router-dom';

function BuildContainer({
  selectedBuild,
  handleBuildClick,
  builds,
  sessions,
}: {
  selectedBuild: IBuild | undefined;
  handleBuildClick: (buildId: string) => void;
  builds: IBuild[];
  sessions: ISession[];
}) {
  const path = window.location.pathname;
  const navigate = useNavigate();

  function timeAgo(createdAt: string | number | Date) {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);

    const timeDifference = Number(currentDate) - Number(createdDate);
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'}`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    } else {
      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
    }
  }

  const buildId = path.match(/builds\/(.+?)\//)?.[1];
  const sessionId = path.match(/session\/(.+?)$/)?.[1];
  console.log({ buildId, sessionId });

  return (
    <div className="build-container">
      <div className="build-header">
        <img src={ToolsIcon} alt="build-icon" />
        <h3>All Builds</h3>
      </div>
      <div className="build-list">
        {builds.map((build) => (
          <>
            <div
              className={`build-item ${
                selectedBuild?.id === build.id && !sessionId && 'build-item_selected'
              } `}
              key={build.id}
              onClick={() => handleBuildClick(build.id)}
            >
              <p className="build-item_name">{build.name}</p>
              <div className="build-item_details">
                <div className="build-item_details_item">
                  <img src={TimeIcon} className="details-item_icon" />
                  <span>
                    {sessions.filter((session) => session.buildId === build.id).length} sessions
                  </span>
                </div>
                <div className="build-item_details_item">
                  <img src={TimeIcon} className="details-item_icon" />
                  <span>{timeAgo(build.updatedAt)} ago</span>
                </div>
              </div>
            </div>
            {selectedBuild?.id === build.id && (
              <div className="build-item_sessions">
                {sessions
                  .filter((session) => session.buildId === build.id)
                  .map((session) => (
                    <div
                      key={session.buildId}
                      className={`build-item_session ${
                        sessionId === session.id && 'build-item_session_selected'
                      }`}
                      onClick={() => navigate(`/builds/${session.buildId}/session/${session.id}`)}
                    >
                      <div className="build-item_session_name">
                        {session.name || 'Not Available'}
                      </div>
                      <div className="build-item_session_details">
                        <div className="build-item_session_details_item">
                          <img
                            src={session.devicePlatform === 'android' ? AndroidIcon : AppleIcon}
                            alt="device platform"
                          />
                          <span>{session.deviceName}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default BuildContainer;
