import React from 'react';
import styled from 'styled-components';
import SerialLayout, { Row } from '../layouts/serial-layout';
import ParallelLayout, { Column } from '../layouts/parallel-layout';
import Session from '../../../interfaces/session';
import Icon, { Sizes } from '../atoms/icon';
import Spinner from '../atoms/spinner';
import CommonUtils from '../../../utils/common-utils';
import Centered from '../molecules/centered';
// import { useHistory } from "react-router-dom";
import { getSessionDetailsUrl } from '../../../constants/routes';
import chroma from 'chroma-js';
import { Tooltip } from '@mui/material';

const getStatusIcon = (is_completed: boolean, session_status: string) => {
  if (!is_completed) {
    return <Spinner size="M" />;
  } else if (session_status === 'PASSED') {
    return <Icon name="success" size={Sizes.XXL} />;
  } else if (session_status === 'TIMEOUT') {
    return <Icon name="exclamation" size={Sizes.XXL} />;
  } else {
    return <Icon name="error" size={Sizes.XXL} />;
  }
};

const getTilte = (session: Session) => {
  if (session.name) {
    return session.name;
  } else {
    let title = `${session.platform_name} ${session.platform_version}`.toLowerCase();
    if (session.browser_name) {
      title += `, ${session.browser_name}`;
    }
    return title;
  }
};

const Container = styled.div`
  padding: 10px 15px;
  border-bottom: 1px solid ${(props) => chroma(props.theme.colors.border).brighten(0.7).hex()};
  cursor: pointer;
  background-color: ${(props) => props.theme.colors.components.session_card_default_bg};

  &:hover {
    background-color: ${(props) => props.theme.colors.greyscale[4]};
  }

  &.active {
    background-color: ${(props) => props.theme.colors.components.session_card_active_bg};
  }
`;

const Name = styled.div`
  font-weight: 400;
  font-size: 13px;
  text-transform: capitalize;
`;

const ExecutionTime = styled.div`
  color: ${(props) => props.theme.colors.greyscale[2]};
`;

const StausColor = styled.div<{ status: string }>`
  color: ${(props) => {
    switch (props.status) {
      case 'PASSED':
        return props.theme.colors.success;
      case 'RUNNING':
        return props.theme.colors.components.session_card_running_status;
      case 'FAILED':
      case 'TIMEOUT':
        return props.theme.colors.error;
    }
  }};
`;

const StatusIcon = styled(StausColor)``;

const StatusLabel = styled(StausColor)`
  font-weight: 600;
  font-size: 11px;
`;

const TextWithIcon = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;

  & > span {
    padding-right: 5px;
  }
`;

const DeviceName = styled(TextWithIcon)`
  color: ${(props) => props.theme.colors.greyscale[2]};
  font-weight: 500;
  max-width: 120px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type PropsType = {
  session: Session;
  selected: boolean;
};

// function getPlatformIcon(session: Session) {
//   if (session.platform_name.toLowerCase() == "android") {
//     return <Icon name="android" size={Sizes.XL} />;
//   } else {
//     return <Icon name="ios" size={Sizes.XL} />;
//   }
// }

function getDuration(startDate: Date) {
  return CommonUtils.convertTimeToReadableFormat(new Date(startDate), new Date()).split(' ')[0];
}

export default function SessionCard(props: PropsType) {
  const { session } = props;
  const { session_id, device_name, start_time, session_status, is_completed } = session;

  const formattedStartTime = getDuration(start_time);
  // const history = useHistory();

  return (
    <Container
      className={props.selected ? 'active' : ''}
      onClick={() => {
        // history.push(getSessionDetailsUrl(session_id));
      }}
    >
      <ParallelLayout>
        <Column grid={11}>
          <SerialLayout>
            <Row padding="10px 30px 10px 0">
              <Name>{getTilte(session)}</Name>
            </Row>
            <Row padding="0 0 5px 0">
              <ParallelLayout>
                <Column grid={3}>
                  <StatusLabel status={session_status}>{session_status}</StatusLabel>
                </Column>
                <Column grid={5}>
                  <Tooltip title={device_name} arrow={true}>
                    <DeviceName>
                      <Icon name="mobile" />
                      {device_name}
                    </DeviceName>
                  </Tooltip>
                </Column>
                <Column grid={4}>
                  <ExecutionTime>{formattedStartTime} ago</ExecutionTime>
                </Column>
              </ParallelLayout>
            </Row>
          </SerialLayout>
        </Column>
        <Column grid={1}>
          <Centered>
            <StatusIcon status={session_status}>
              {getStatusIcon(is_completed, session_status)}
            </StatusIcon>
          </Centered>
        </Column>
      </ParallelLayout>
    </Container>
  );
}
