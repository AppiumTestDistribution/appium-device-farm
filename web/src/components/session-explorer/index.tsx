import { useEffect, useState } from 'react';
import DeviceFarmApiService from '../../api-service';
import { styled } from 'styled-components';
import { SessionCard } from './session-card';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import FlexContainer from '../../layouts/flex-container';
import SessionDetails from './session-details';

const SessionListContainer = styled.div`
  height: 100vh;
  overflow: scroll;
  width: 400px;
  border-right: 1px solid #ecebf0;
`;

function extractSessionidFromUrl(url: string): string | null {
  const matches = url.match(new RegExp(/sessions\/(.*)/));
  return matches?.length ? matches[1] : null;
}

function extractBuildidFromUrl(url: string): string | null {
  const matches = url.match(new RegExp(/builds\/([^/]*)/));
  return matches?.length ? matches[1] : null;
}
export function SessionExplorer() {
  const [sessions, setSessions] = useState([]);
  const location = useLocation();
  const [selectedSession, setSelectedSession] = useState(null) as any;
  const session_id = extractSessionidFromUrl(location.pathname);
  const buildId = extractBuildidFromUrl(location.pathname);
  const navigate = useNavigate();

  const refreshSessionList = async () => {
    const sessions = await DeviceFarmApiService.getSessions({ buildId: buildId || undefined });
    setSessions(sessions);
  };

  const redirect = (sessionId: string) => {
    const prefix = buildId ? `/builds/${buildId}` : '';
    navigate(`${prefix}/sessions/${sessionId}`);
  };

  useEffect(() => {
    const sessionFromUrl: any = session_id
      ? sessions.find((s: any) => s.id === session_id) || sessions[0]
      : sessions[0];

    if (sessionFromUrl && session_id != sessionFromUrl.id) {
      redirect(sessionFromUrl.id);
    }

    if (sessionFromUrl && sessionFromUrl.id != selectedSession?.id) {
      setSelectedSession(sessionFromUrl);
    }
  }, [session_id, sessions]);

  useEffect(() => {
    refreshSessionList();
    const sessionInterval = setInterval(refreshSessionList, 5000);
    return () => {
      clearInterval(sessionInterval);
    };
  }, [buildId]);

  return (
    <FlexContainer direction="row">
      <SessionListContainer>
        {sessions.map((session: any, i) => (
          <SessionCard
            key={i}
            session={session}
            active={selectedSession != null && selectedSession?.id == session?.id}
            onClick={() => {
              redirect(session.id);
            }}
          />
        ))}
      </SessionListContainer>
      {selectedSession && <SessionDetails session={selectedSession} />}
    </FlexContainer>
  );
}
