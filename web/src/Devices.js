import Device from './Device';

const Devices = ({devices, platform}) => {
    return (
        <section class="grid-container">
            {devices.filter(device => {
                if (platform.toLowerCase() === "android" || platform === "iOS")
                    return device.platform.toLowerCase() === platform.toLowerCase()
                return device
            })
                .map((device) => (
                    <Device device={device}/>
                ))}
        </section>
    );
};

export default Devices;
