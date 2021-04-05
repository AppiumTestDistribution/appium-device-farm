import Device from './Device';

const Devices = ({ devices }) => {
  return (
    <div>
      {devices.map((device) => (
        <Device device={device} />
      ))}
    </div>
  );
};

export default Devices;
