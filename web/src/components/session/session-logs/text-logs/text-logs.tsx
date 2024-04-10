import './text-logs.css';
import TimeIcon from '../../../../assets/time-icon.svg';
import UpArrowIcon from '../../../../assets/up-arrow-icon.svg';
import DownArrowIcon from '../../../../assets/down-arrow-icon.svg';
import { ISessionLogs } from '../../../../interfaces/ISessionLogs';
import { useState } from 'react';
import ReactJson from 'react-json-view';

interface TextLogsProps {
  sessionLogs: ISessionLogs[];
  baseUrl: any;
}

function TextLogs({ sessionLogs, baseUrl }: TextLogsProps) {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
  const [showImages, setShowImages] = useState(true);
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);

  return (
    <div>
      <div className="tab-filter">
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="show-images"
            checked={showImages}
            onChange={() => setShowImages(!showImages)}
          />
          <label htmlFor="show-images">Show Images</label>
        </div>
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="show-errors"
            checked={showErrorsOnly}
            onChange={() => setShowErrorsOnly(!showErrorsOnly)}
          />
          <label htmlFor="show-errors">Show Errors Only</label>
        </div>
      </div>
      <div className="text-logs">
        {sessionLogs
          .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
          .filter((sessionLog) => (showErrorsOnly ? !sessionLog.isSuccess : true))
          .map((sessionLog, index, array) => {
            const currentTime = new Date(sessionLog.createdAt);
            const nextTime = index < array.length - 1 ? new Date(array[index + 1].createdAt) : null;
            const timeDifference = nextTime ? nextTime.getTime() - currentTime.getTime() : null;
            const body = JSON.parse(sessionLog.body);
            const formattedResponse = JSON.stringify(
              JSON.parse(sessionLog.response).value,
              null,
              2,
            );
            const formattedBody = JSON.stringify(body, null, 2);

            return (
              <div
                key={sessionLog.id}
                className={`text-log ${sessionLog.isSuccess ? '' : 'failed'}`}
              >
                <div className="text-log-header">
                  <div className="title">{sessionLog.title}</div>
                  <div className="accessibility">
                    {body.using && body.value && `[${body.using}=${body.value}]`}
                  </div>
                  <div className="time-difference">
                    {timeDifference !== null && (
                      <>
                        <img src={TimeIcon} alt="time" />
                        <span>{timeDifference} ms</span>
                      </>
                    )}
                  </div>
                  <button
                    className={`dropdown-button ${formattedBody === '{}' && 'hidden'}`}
                    onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                  >
                    <img
                      src={openDropdownIndex === index ? UpArrowIcon : DownArrowIcon}
                      alt="dropdown"
                    />
                  </button>
                </div>
                {showImages && sessionLog.screenshot && (
                  <img
                    className="text-log-screenshot"
                    src={`${baseUrl}/device-farm/assets/${sessionLog.screenshot}`}
                    alt="screenshot"
                  />
                )}
                <div className="text-log-response">
                  <p>RESPONSE</p>
                  {formattedResponse.startsWith('{') || formattedResponse.startsWith('[') ? (
                    <ReactJson
                      src={JSON.parse(formattedResponse)}
                      theme="rjv-default"
                      displayDataTypes={false}
                      name={null}
                    />
                  ) : (
                    <span className="text-log-response-value">{formattedResponse}</span>
                  )}
                </div>
                {openDropdownIndex === index && (
                  <div className="text-log-response">
                    <p>PARAMS</p>
                    {formattedBody.startsWith('{') || formattedBody.startsWith('[') ? (
                      <ReactJson
                        src={JSON.parse(formattedBody)}
                        theme="rjv-default"
                        displayDataTypes={false}
                        name={null}
                      />
                    ) : (
                      <span>{formattedBody}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default TextLogs;
