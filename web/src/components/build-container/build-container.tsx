import './build-container.css';
import BuildIcon from '../../assets/build-icon.svg';
import { IBuild } from '../../interfaces/IBuild';
import { ISession } from '../../interfaces/ISession';

function BuildContainer({ selectedBuild, handleBuildClick, builds, sessions }: { selectedBuild: IBuild | undefined, handleBuildClick: (build: IBuild) => void, builds: IBuild[], sessions: ISession[] }) {

  function timeAgo(createdAt: string | number | Date) {
    const currentDate = new Date();
    const createdDate = new Date(createdAt);

    const timeDifference = Number(currentDate) - Number(createdDate);
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    }
  }

  return (
    <div className="build-container">
      <div className='build-header'>
        <img src={BuildIcon} alt='build-icon' />
        <h3>All Builds</h3>
      </div>
      <div className='build-list'>
        {builds.map((build) => (
          <div className={`build-item ${selectedBuild?.id === build.id && "build-item_selected"} `} key={build.id} onClick={() => handleBuildClick(build)}>
            <p className='build-item_name'>{build.name}</p>
            <p className='build-item_session'>{sessions.filter((session) => session.build_id === build.id).length} SESSIONS</p>
            <span className='build-item_time'>{timeAgo(build.updatedAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuildContainer;
