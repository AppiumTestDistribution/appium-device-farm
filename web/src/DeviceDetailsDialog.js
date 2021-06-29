import Modal from 'react-bootstrap/Modal';
import {Button} from 'react-bootstrap';
import './Devices.css';
import './App.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDesktop, faMobileAlt} from '@fortawesome/free-solid-svg-icons';
import {faAndroid, faApple} from '@fortawesome/free-brands-svg-icons';

function DeviceDetailsDialog({show, onHide, selectedDevice}) {
    const {platform, name, udid, busy, sdk, realDevice, brand, model, manufacturer} = selectedDevice;
    return (
        <Modal
            onHide={onHide}
            show={show}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <div className="modalContainer">
                <Modal.Header onClick={onHide}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {selectedDevice.name ?
                            `${name}` :
                            `${udid}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className="mb-2 deviceDetail">SDK - {sdk}
                        <span>
                            {platform === 'android' ? (
                                <FontAwesomeIcon icon={faAndroid}/>
                            ) : (
                                <FontAwesomeIcon icon={faApple}/>
                            )}
                        </span>
                    </h5>
                    <h5 className="deviceDetail">
                        <span className="mr-4 w-25">Manufacturer:</span>
                        <span>&nbsp;{manufacturer}</span>
                    </h5>
                    <h5 className="deviceDetail">
                        <span className="mr-4 w-25">Model:</span>
                        <span className="text-right">&nbsp;{model}</span>
                    </h5>
                    <h5 className="deviceDetail">
                        <span className="mr-4 w-25">Brand:</span>
                        <span>&nbsp;{brand}</span>
                    </h5>
                    <h5 className="deviceDetail">
                        <span className="mr-4 w-25">Status:</span>
                        {busy ? (
                            <span>
                                <FontAwesomeIcon icon={faMobileAlt} color="red"/>
                                <span className="text-danger">&nbsp;Busy</span>
                            </span>
                        ) : (
                            <span>
                                <FontAwesomeIcon icon={faMobileAlt} color="green"/>
                                <span className="text-success">&nbsp;Free</span>
                            </span>
                        )}
                    </h5>
                    <h5 className="deviceDetail">
                        <span className="mr-4 w-25">Type:</span>
                        {realDevice ? (
                            <span>
                                <FontAwesomeIcon icon={faMobileAlt} color="black"/>
                                <span>&nbsp;Mobile</span>
                            </span>
                        ) : (
                            <span>
                                <FontAwesomeIcon icon={faDesktop} color="black"/>
                                <span>&nbsp;Emulated</span>
                            </span>
                        )}
                    </h5>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={onHide} className="deviceDetailsCloseButton">Close</Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

export default DeviceDetailsDialog;