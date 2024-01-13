import { ISession } from '../../../interfaces/ISession';
import AndroidIcon from '../../../assets/android-new-icon.svg'
import AppleIcon from '../../../assets/apple-new-icon.svg'
import MobileIcon from '../../../assets/mobile-icon.svg'
import './session-card.css';
import { useNavigate } from 'react-router-dom';

function SessionCard({ session }: { session: ISession }) {
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
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ago`;
    }
  }

  function runningTime(startTime: string | number | Date, endTime?: string | number | Date | null) {
    const startDate = new Date(startTime);
    const endDate = endTime ? new Date(endTime) : new Date();
    const elapsedTime = Number(endDate) - Number(startDate);

    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    return `${hours > 0 ? `${hours}h ` : ''}${minutes > 0 ? `${minutes}m ` : ''}${seconds}s`;
  }



  return (
    <div className="build-session" key={session.id} onClick={() => navigate(`/builds/${session.build_id}/sessions/${session.id}`)}>
      <div className='build-session-column'>
        <div className="build-session_name">{session.name || " Not Available"}</div>
        <div className="build-session-device">
          <div className="build-session-device_name">
            <img src={MobileIcon} alt="device icon" />
            <p>{session.device_name}</p>
          </div>
          <div className="build-session-device_platform">
            <img src={session.device_platform === 'android' ? AndroidIcon : AppleIcon} alt="device platform" />
            <p>{session.device_platform} {session.device_version}</p>
          </div>
          <p className="build-session-device_last_updated">Last updated {timeAgo(session.updatedAt)}</p>
        </div>
      </div>
      <div className="build-session_status">
        <p>{session.status}</p>
      </div>
      <div className="build-session_time">
        <p>{runningTime(session.startTime, session.endTime)}</p>
      </div>
    </div>
  );
}

export default SessionCard;
