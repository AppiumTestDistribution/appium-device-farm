import { useEffect, useState } from 'react';
import './builds.css';
import { IBuild } from '../../interfaces/IBuild';
import { ISession } from '../../interfaces/ISession';
import BuildContainer from '../../components/build-container/build-container';
import SessionCard from '../../components/build-container/session-card/session-card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DeviceFarmApiService from '../../api-service';

function Builds() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedBuildId = searchParams.get('buildId');
  const [selectedBuild, setSelectedBuild] = useState<IBuild>();
  const [builds, setBuilds] = useState<IBuild[]>([]);
  const [sessions, setSessions] = useState<ISession[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const builds = await DeviceFarmApiService.getBuilds();
        const sessions = await DeviceFarmApiService.getSessions();
        setBuilds(builds);
        setSessions(sessions);
        setSelectedBuild(builds.find((build: any) => build.id === selectedBuildId) ?? builds[0]);
      } catch (error) {
        console.log(error);
      }
    }

    init();
  }, [selectedBuildId]);

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
        {selectedBuild && (
          <div className="build-sessions-container">
            {sessions
              .filter((session) => session.build_id === selectedBuild.id)
              .map((session) => {
                return <SessionCard key={session.id} session={session} />;
              })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Builds;
