import Device from './Device';
import DeviceDetailsDialog from './DeviceDetailsDialog';
import {useState} from 'react';

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

export default Devices;
