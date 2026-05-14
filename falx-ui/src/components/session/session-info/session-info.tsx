import { ISession } from '../../../interfaces/ISession';

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
    return capabilitiesObject?.app?.split('/').pop();
  }

  const infoItems = [
    { label: 'Device', value: session.deviceName },
    { label: 'Platform', value: session.devicePlatform },
    { label: 'OS Version', value: session.deviceVersion },
    { label: 'Status', value: session.status, type: 'status' },
    { label: 'Start Time', value: new Date(session.startTime).toLocaleString() },
    { label: 'Duration', value: runningTime(session.startTime, session.endTime) },
  ];

  return (
    <div className="bg-gray-800/30 border border-gray-700/50">
      <div className="grid grid-cols-3 gap-x-12 gap-y-3 p-3">
        {infoItems.map((item) => (
          <div key={item.label} className="flex items-center">
            <div className="text-sm text-gray-500 w-[120px]">{item.label}</div>
            {item.type === 'status' ? (
              <div className="text-sm">
                <span
                  className={`px-1.5 py-0.5 text-xs font-medium rounded ${
                    item.value === 'passed'
                      ? 'text-emerald-400 bg-emerald-400/10'
                      : item.value === 'failed'
                        ? 'text-red-400 bg-red-400/10'
                        : 'text-amber-400 bg-amber-400/10'
                  }`}
                >
                  {item.value.toUpperCase()}
                </span>
              </div>
            ) : (
              <div className="text-sm text-gray-300 truncate" title={item.value}>
                {item.value}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionInfo;
