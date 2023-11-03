import React from 'react';
import styled from 'styled-components';
import Session from '../../../interfaces/session';
import TabsLayout, { Tab } from '../layouts/tab-layout';
import SessionDebugLogs from './session-debug-logs';
import SessionDeviceLogs from './session-device-logs';
import SessionTextLogs from './session-text-logs';
import Profiling from './session-app-profiling';
import SessionHttpLogs from './session-http-logs';

type PropsType = {
  session: Session;
  parentHeight: number;
};

const Container = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  border-bottom: none;
  margin: 20px;
  overflow: hidden;
`;

enum TAB_HEADERS {
  TEXTLOGS = 'Text Logs',
  DEVICELOGS = 'Device Logs',
  DEBUGLOGS = 'Debug Logs',
  PROFILING = 'App profiling',
  NETWORK = 'Network Logs',
}

export default function SessionLogs(props: PropsType) {
  const { session, parentHeight } = props;

  return (
    <Container>
      <TabsLayout selected={TAB_HEADERS.TEXTLOGS}>
        <Tab name={TAB_HEADERS.TEXTLOGS}>
          <SessionTextLogs session={session} parentHeight={parentHeight} />
        </Tab>
        <Tab name={TAB_HEADERS.DEVICELOGS}>
          <SessionDeviceLogs session={session} parentHeight={parentHeight} />
        </Tab>
        <Tab name={TAB_HEADERS.DEBUGLOGS}>
          <SessionDebugLogs session={session} parentHeight={parentHeight} />
        </Tab>
        {session.is_completed && session.is_profiling_available && (
          <Tab name={TAB_HEADERS.PROFILING}>
            <Profiling session={session} parentHeight={parentHeight} />
          </Tab>
        )}
        {session.is_completed && session.is_http_logs_available && (
          <Tab name={TAB_HEADERS.NETWORK}>
            <SessionHttpLogs session={session} parentHeight={parentHeight} />
          </Tab>
        )}
      </TabsLayout>
    </Container>
  );
}
