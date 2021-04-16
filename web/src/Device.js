import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAndroid, faApple } from '@fortawesome/free-brands-svg-icons';
import { faMobileAlt, faDesktop } from '@fortawesome/free-solid-svg-icons';

const Device = ({ device }) => {
  const { platform, name, udid, busy, sdk, realDevice } = device;
  return (
    <div>
      <div class="d-flex flex-row bd-highlight mb-1 justify-content-between device-row">
        <div class="p-2 bd-highlight">
          {platform === 'android' ? (
            <FontAwesomeIcon icon={faAndroid} />
          ) : (
            <FontAwesomeIcon icon={faApple} />
          )}
        </div>
        <div class="p-2 bd-highlight flex-fill">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id={`tooltip-bottom`}>{udid}</Tooltip>}
          >
            <div class="names">{name ? `${name} (SDK - ${sdk})` : `${udid} (SDK - ${sdk})`}</div>
          </OverlayTrigger>
        </div>
        <div class="p-2 bd-highlight">
          {realDevice ? (
            <div>
              <FontAwesomeIcon icon={faMobileAlt} color="black" />
              <span>&nbsp;Mobile</span>
            </div>
          ) : (
            <div>
              <FontAwesomeIcon icon={faDesktop} color="black" />
              <span>&nbsp;Emulated</span>
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
