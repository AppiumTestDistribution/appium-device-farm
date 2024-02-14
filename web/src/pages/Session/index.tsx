import { useEffect, useState } from 'react';
import './session.css';
import RightArrowIcon from '../../assets/right-arrow-icon.svg';
import { IBuild } from '../../interfaces/IBuild';
import { ISession } from '../../interfaces/ISession';
import BuildContainer from '../../components/build-container/build-container';
import { useNavigate, useParams } from 'react-router-dom';
import SessionInfo from '../../components/session/session-info/session-info';
import Capabilities from '../../components/session/capabilities/capabilities';
import SessionLogs from '../../components/session/session-logs/session-logs';
import DeviceFarmApiService from '../../api-service';

function Session() {
  const { buildId, sessionId } = useParams();
  const navigate = useNavigate();
  const [selectedBuild, setSelectedBuild] = useState<IBuild>();
  const [selectedSession, setSelectedSession] = useState<ISession>();
  const [builds, setBuilds] = useState<IBuild[]>([]);
  const [sessions, setSessions] = useState<ISession[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const builds = await DeviceFarmApiService.getBuilds();
        const sessions = await DeviceFarmApiService.getSessions();
        setBuilds(builds);
        setSessions(sessions);
        if (
          builds.findIndex((build: any) => build.id === buildId) < 0 ||
          sessions.findIndex((session: any) => session.id === sessionId) < 0
        ) {
          navigate('/device-farm/builds');
          return;
        }
        setSelectedBuild(builds.find((build: any) => build.id === buildId));
        setSelectedSession(sessions.find((session: any) => session.id === sessionId));
      } catch (error) {
        console.log(error);
      }
    }
    init();
  }, [buildId, navigate, sessionId]);

  const handleSelectedBuildChange = (buildId: string) => {
    navigate(`/device-farm/builds?buildId=${buildId}`);
  };

  return (
    <div className="app-container">
      <div className="app-body-container">
        <BuildContainer
          selectedBuild={selectedBuild}
          handleBuildClick={handleSelectedBuildChange}
          builds={builds}
          sessions={sessions}
        />
        {selectedSession && (
          <div className="session-container">
            <div className="session-header">
              <button onClick={() => handleSelectedBuildChange(selectedSession.build_id)}>
                Build
              </button>
              <img src={RightArrowIcon} alt="right-arrow" />
              <h3>{selectedSession.name || 'Not Available'}</h3>
            </div>
            <SessionInfo session={selectedSession} />
            <div className="session-body">
              <Capabilities session={selectedSession} />
              <SessionLogs sessionId={selectedSession.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Session;
