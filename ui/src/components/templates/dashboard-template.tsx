import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, HashRouter, Routes, useLocation } from 'react-router-dom';
import { getSessionDetailsUrl } from '../../constants/routes';
import { APP_HEADER_HEIGHT } from '../../constants/ui';
import { setSelectedSession } from '../../store/actions/session-actions';
import { getSessions } from '../../store/selectors/entities/sessions-selector';
import ParallelLayout, { Column } from '../UI/layouts/parallel-layout';
import SerialLayout, { Row } from '../UI/layouts/serial-layout';
import AppHeader from '../UI/organisms/app-header';
import SessionDetails from '../UI/organisms/session-details';
import SessionList from '../UI/organisms/session-list';

function extractSessionidFromUrl(url: string): string | null {
  const matches = url.match(new RegExp(/dashboard\/session\/(.*)/));
  return matches?.length ? matches[1] : null;
}

export default function DashboardTemplate() {
  //const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const sessions = useSelector(getSessions);
  const session_id = extractSessionidFromUrl(location.pathname);

  useEffect(() => {
    const SelectedSession = !!session_id
      ? sessions.find((d) => d.session_id === session_id) || sessions[0]
      : sessions[0];

    if (SelectedSession) {
      // if (session_id && session_id != SelectedSession.session_id) {
      //   history.push(getSessionDetailsUrl(SelectedSession.session_id));
      // }
      dispatch(setSelectedSession(SelectedSession));
    }
  }, [session_id, sessions]);

  return (
    <SerialLayout>
      <Row height={`${APP_HEADER_HEIGHT}px`}>
        <AppHeader />
      </Row>
      <Row height={`calc(100vh - ${APP_HEADER_HEIGHT}px)`}>
        <ParallelLayout>
          <Column grid={2.5}>
            <SessionList />
          </Column>
          <Column grid={9.5}>
            <HashRouter>
              <Routes>
                <Route>
                  <SessionDetails />
                </Route>
              </Routes>
            </HashRouter>
          </Column>
        </ParallelLayout>
      </Row>
    </SerialLayout>
  );
}
