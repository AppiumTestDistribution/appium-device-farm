import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Session from '../../../interfaces/session';
import { addPollingTask, removePollingTask } from '../../../store/actions/polling-actions';
import { fetchSessionDebugLogs } from '../../../store/actions/session-actions';
import {
  getDebugLogs,
  getisDebugLogsLoading,
} from '../../../store/selectors/entities/logs-selector';
import { getHeaderStyle } from '../../../utils/ui';
import CheckboxComponent from '../atoms/checkbox';
import Input from '../atoms/input';
import Spinner from '../atoms/spinner';
import ParallelLayout, { Column } from '../layouts/parallel-layout';
import SerialLayout, { Row } from '../layouts/serial-layout';
import { TAB_HEADER_HEIGHT } from '../layouts/tab-layout';
import Centered from '../molecules/centered';
import EmptyMessage from '../molecules/empty-message';
import SessionDebugLogEntry from './session-debug-log-entry';

function useLogs(filterText: string) {
  const logs = useSelector(getDebugLogs);

  return logs
    .filter((log: any) => log.message && log.message.indexOf(filterText) >= 0)
    .map((log: any) => <SessionDebugLogEntry key={log} entry={log} />);
}

const HEADER_HEIGHT = 50;

const Container = styled.div``;

const Header = styled.div`
  ${(props) => getHeaderStyle(props.theme)};
  padding: 10px;
`;

const Content = styled.div``;

//TODO: Refactor this. temporary changes
const StyledInput = styled(Input)`
  background: transparent;
  border-bottom: 1px solid #fff;

  &&& input {
    background: transparent;
    color: #fff;
    border: none;
  }

  &&& path {
    background: #fff;
    stroke: #fff;
  }
`;

type PropsType = {
  session: Session;
  parentHeight: number;
};

export default function SessionDebugLogs(props: PropsType) {
  const { session, parentHeight } = props;
  const [filterText, setFilterText] = useState('');
  const logs = useLogs(filterText);
  const isLoading = useSelector(getisDebugLogsLoading);
  const dispatch = useDispatch();
  const [enablePolling, setEnablePolling] = useState(!session.is_completed);

  useEffect(() => {
    dispatch(fetchSessionDebugLogs(session.session_id));

    if (session.is_completed) {
      togglePolling(false);
    } else if (enablePolling) {
      togglePolling(true);
    }

    return () => {
      togglePolling(false);
    };
  }, [session.session_id, session.is_completed]);

  const togglePolling = useCallback((on: boolean) => {
    if (on) {
      dispatch(addPollingTask(fetchSessionDebugLogs(session.session_id)));
    } else {
      dispatch(removePollingTask(fetchSessionDebugLogs(session.session_id)));
    }
    setEnablePolling(on);
  }, []);

  if (isLoading) {
    return (
      <Centered>
        <Spinner />
      </Centered>
    );
  } else {
    return (
      <Container>
        <SerialLayout>
          <Row height={`${HEADER_HEIGHT}px`}>
            <Header>
              <ParallelLayout>
                <Column grid={4}>
                  <StyledInput
                    name="search"
                    type="text"
                    leftIcon="search"
                    placeholder="Filter logs"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                  />
                </Column>
                {!session.is_completed ? (
                  <Column grid={4} padding="0px 10px">
                    <CheckboxComponent
                      label="Enable Polling"
                      checked={enablePolling}
                      onChange={(checked: boolean) => togglePolling(checked)}
                    />
                  </Column>
                ) : null}
              </ParallelLayout>
            </Header>
          </Row>
          <Row
            height={`calc(100vh - ${HEADER_HEIGHT + TAB_HEADER_HEIGHT + parentHeight}px)`}
            scrollable
          >
            <Content>
              {logs.length ? (
                logs
              ) : (
                <Centered>
                  <EmptyMessage>No Logs available</EmptyMessage>
                </Centered>
              )}
            </Content>
          </Row>
        </SerialLayout>
      </Container>
    );
  }
}
