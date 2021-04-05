import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './Device.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import { faMobileAlt, faDesktop } from '@fortawesome/free-solid-svg-icons';

const Device = ({ device }) => {
  const { platform, name, udid, busy, sdk, realDevice } = device;
  return (
    <div>
      <div class="d-flex flex-row bd-highlight mb-1 justify-content-between device-row ml-2 mr-2">
        <div class="p-2 bd-highlight">
          {platform === 'android' ? (
            <FontAwesomeIcon icon={faAndroid} color="green" />
          ) : (
            <FontAwesomeIcon icon={faApple} />
          )}
        </div>
        <div class="p-2 bd-highlight flex-fill">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id={`tooltip-bottom`}>{udid}</Tooltip>}
          >
            <div>{name ? `${name} (SDK - ${sdk})` : udid}</div>
          </OverlayTrigger>
        </div>
        <div class="p-2 bd-highlight">
          {realDevice ? (
            <div>
              <FontAwesomeIcon icon={faMobileAlt} color="grey" />
              <span className="text-muted">&nbsp;Mobile</span>
            </div>
          ) : (
            <div>
              <FontAwesomeIcon icon={faDesktop} color="grey" />
              <span className="text-muted">&nbsp;Emulated</span>
            </div>
          )}
        </div>
        <div class="p-2 bd-highlight">
          {busy ? (
            <div>
              <FontAwesomeIcon icon={faMobileAlt} color="red" />
              <span className="text-danger">&nbsp;Busy</span>
            </div>
          ) : (
            <div>
              <FontAwesomeIcon icon={faMobileAlt} color="green" />
              <span className="text-success">&nbsp;Free</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Device;
