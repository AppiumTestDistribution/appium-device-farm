import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useEffect, useState} from 'react';
import {
    faTruckLoading,
    faSkullCrossbones,
} from '@fortawesome/free-solid-svg-icons';
import Devices from './Devices';

<<<<<<< HEAD
const DevicesContainer = ({platform}) => {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState('');
=======
const DevicesContainer = () => {
    const [loading, setLoading] = useState(true);
    const [devices, setDevices] = useState([]);
    const [error, setError] = useState(false);
>>>>>>> f969678ce3f3ff39140ecc6974246e53c2522232

    useEffect(() => {
        fetch('/sample.json')
            .then((res) => res.json())
            .then(
                (devices) => {
                    setLoading(false);
                    setDevices(devices);
                }).catch((_) => {
                setLoading(false);
                setError(true);
            }
        );
    }, []);

<<<<<<< HEAD
  if (loading) {
    return (
      <div class="d-flex flex-column bd-highlight mt-4 text-center">
        <div class="p-2 bd-highlight">
          <FontAwesomeIcon icon={faTruckLoading} size="9x" color="green" />
        </div>
        <div class="p-2 bd-highlight">Loading your devices</div>
      </div>
    );
  } else if (error) {
    return (
      <div class="d-flex flex-column bd-highlight mb-4 text-center">
        <div class="p-2 bd-highlight">
          <FontAwesomeIcon icon={faSkullCrossbones} size="9x" color="red" />
        </div>
        <div class="p-2 bd-highlight">Muhahahah Something went wrong</div>
      </div>
    );
  } else {
    return <Devices devices={devices} platform ={platform} />;
  }
=======
    if (loading) {
        return (
            <div className="d-flex flex-column bd-highlight mt-4 text-center">
                <div className="p-2 bd-highlight">
                    <FontAwesomeIcon icon={faTruckLoading} size="9x" color="green"/>
                </div>
                <div className="p-2 bd-highlight">Loading your devices</div>
            </div>
        );
    } else if (error) {
        return (
            <div className="d-flex flex-column bd-highlight mb-4 text-center">
                <div className="p-2 bd-highlight">
                    <FontAwesomeIcon icon={faSkullCrossbones} size="9x" color="red"/>
                </div>
                <div className="p-2 bd-highlight">Muhahahah Something went wrong</div>
            </div>
        );
    } else {
        return <Devices devices={devices}/>;
    }
>>>>>>> f969678ce3f3ff39140ecc6974246e53c2522232
};

export default DevicesContainer;
