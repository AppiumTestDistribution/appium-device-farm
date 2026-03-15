import { ISession } from '../../../interfaces/ISession';
import { useNavigate } from 'react-router-dom';
import { Clock, Smartphone, Timer } from 'lucide-react';

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

  const getStatusColor = (status: string): string => {
    if (status === 'passed') return 'text-emerald-400 bg-emerald-400/10';
    if (status === 'failed') return 'text-red-400 bg-red-400/10';
    return 'text-amber-400 bg-amber-400/10';
  };

  const getPlatformIcon = (platform: string): JSX.Element => {
    if (platform === 'ios' || platform === 'tvos') {
      return (
        <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.537 12.625a4.421 4.421 0 0 0 2.684 4.047 10.96 10.96 0 0 1-1.384 2.845c-.834 1.218-1.7 2.432-3.062 2.457-1.34.025-1.77-.794-3.3-.794-1.531 0-2.01.769-3.275.82-1.316.049-2.317-1.318-3.158-2.532-1.72-2.484-3.032-7.017-1.27-10.077A4.9 4.9 0 0 1 8.91 6.884c1.292-.025 2.51.869 3.3.869.789 0 2.27-1.075 3.828-.917a4.67 4.67 0 0 1 3.66 1.984 4.524 4.524 0 0 0-2.16 3.805m-2.52-7.432A4.4 4.4 0 0 0 16.06 2a4.482 4.482 0 0 0-2.945 1.516 4.185 4.185 0 0 0-1.061 3.093 3.708 3.708 0 0 0 2.967-1.416Z" />
        </svg>
      );
    }
    return <Smartphone className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="relative group">
      <button
        onClick={() => navigate(`/builds/${session.buildId}/session/${session.id}`)}
        className="w-full text-left transition-all duration-200 hover:bg-gray-700/50 relative"
      >
        <div className="flex items-center px-3 py-2 gap-4">
          {/* Status indicator */}
          <div className="w-[3px] h-12 rounded-full bg-gray-600 group-hover:bg-yellow-400 transition-colors duration-200" />

          {/* Status badge */}
          <div className="w-24 flex-shrink-0">
            <span
              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}
            >
              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
            </span>
          </div>

          {/* Session name */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white truncate">{session.name || 'Not Available'}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {getPlatformIcon(session.devicePlatform)}
              <span className="text-xs text-gray-400 truncate">{session.deviceName}</span>
            </div>
          </div>

          {/* Platform version */}
          <div className="w-24 flex-shrink-0">
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300">
              {session.devicePlatform} {session.deviceVersion}
            </span>
          </div>

          {/* Duration */}
          <div className="w-32 flex-shrink-0 flex items-center gap-2 text-gray-400">
            <Timer className="w-4 h-4 flex-shrink-0 text-yellow-400" />
            <span className="text-sm">{runningTime(session.startTime, session.endTime)}</span>
          </div>

          {/* Last updated */}
          <div className="w-32 flex-shrink-0 flex items-center gap-2 text-gray-400">
            <Clock className="w-4 h-4 flex-shrink-0 text-yellow-400" />
            <span className="text-sm">{timeAgo(session.updatedAt)}</span>
          </div>
        </div>
      </button>
    </div>
  );
}

export default SessionCard;
