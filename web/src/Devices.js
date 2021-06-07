import Device from './Device';

const Devices = ({ devices }) => {
  return (
    <section class="grid-container">
      {devices.map((device) => (
        <Device device={device} />
      ))}
    </section>
  );
};

export default Devices;
