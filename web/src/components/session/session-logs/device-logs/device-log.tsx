import { IDeviceLogs } from '../../../../interfaces/IDeviceLogs';
import './device-log.css';

interface DeviceLogsProps {
  deviceLogs: IDeviceLogs[] | null;
}

function DeviceLogs({ deviceLogs }: DeviceLogsProps) {
  return (
    <div className="device-logs">
      {deviceLogs?.map((log, i) => (
        <div className="log-line" key={`log-line-${i}`}>
          <span className="log-line-number">{i + 1}</span>
          {log.message}
        </div>
      ))}
    </div>
  );
}

export default DeviceLogs;
