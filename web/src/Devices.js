import Device from './Device';
import DeviceDetailsDialog from './DeviceDetailsDialog';
import {useState} from 'react';

<<<<<<< HEAD
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
=======
const Devices = ({devices}) => {
        const [showDeviceDetailsDialog, setShowDeviceDetailsDialog] = useState(false);
        const [selectedDevice, setSelectedDevice] = useState({});

        return (
            <>
                <section className="grid-container">
                    {devices.map((device) => (
                        <>
                            <Device device={device}
                                    setSelectedDevice={setSelectedDevice}
                                    setShowDeviceDetailsDialog={setShowDeviceDetailsDialog}
                            />

                        </>
                    ))}
                </section>
                <DeviceDetailsDialog
                    show={showDeviceDetailsDialog}
                    selectedDevice={selectedDevice}
                    onHide={() => setShowDeviceDetailsDialog(false)}
                />
            </>
        );
    }
;
>>>>>>> f969678ce3f3ff39140ecc6974246e53c2522232

export default Devices;
