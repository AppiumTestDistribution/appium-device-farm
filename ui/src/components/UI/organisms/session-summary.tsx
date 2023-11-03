import React from 'react';
import Moment from 'react-moment';
import CommonUtils from '../../../utils/common-utils';
import Session from '../../../interfaces/session';
import styled from 'styled-components';
import ParallelLayout, { Column } from '../layouts/parallel-layout';
import Icon, { Sizes } from '../atoms/icon';

const SUMMARY_CONFIG: any[] = [
  {
    label: 'Session ID',
    key: 'session_id',
  },
  {
    label: 'OS',
    key: 'platform_name',
    icon: (session: any) => {
      const icons: any = {
        android: <Icon name="android" size={Sizes.XL} />,
        ios: <Icon name="ios" size={Sizes.XL} />,
      };
      return icons[session.platform_name.toLowerCase()];
    },
  },
  {
    label: 'Os Version',
    key: 'platform_version',
  },
  {
    label: 'Start Time',
    formatValue: (session: any) => {
      return <Moment format="DD-MMM-YYYY HH:mm:ss">{session.start_time}</Moment>;
    },
  },
  {
    label: 'End Time',
    formatValue: (session: any) => {
      return session.end_time ? (
        <Moment format="DD-MMM-YYYY HH:mm:ss">{session.end_time}</Moment>
      ) : (
        '-'
      );
    },
  },
  {
    label: 'Duration',
    formatValue: (session: any) => {
      return CommonUtils.getReadableDuration(
        new Date(session.start_time),
        session.end_time ? new Date(session.end_time) : new Date()
      );
    },
  },
  {
    label: 'Device Name',
    key: 'device_name',
  },
  {
    label: 'UDID',
    key: 'udid',
  },
  {
    or: [
      {
        label: 'App',
        key: 'app',
        formatValue: (session: any) => {
          return session.app.split('/').pop();
        },
      },
      {
        label: 'Browser',
        key: 'browser_name',
        icon: (session: any) => {
          const icons: any = {
            safari: <Icon name="safari" size={Sizes.M} />,
            chrome: <Icon name="chrome" size={Sizes.M} />,
          };
          return icons[session.browser_name];
        },
      },
    ],
  },
];

const Container = styled.div`
  background: ${(props) => props.theme.colors.greyscale[5]};
  padding: 10px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const Entry = styled.div`
  display: inline-block;
  width: 33%;
  padding: 5px 0px;
`;

const Label = styled.div`
  margin-right: 20px;
  font-size: 13px;
  font-weight: 600;
  color: rgb(116, 114, 114);
  min-width: 95px;
  text-overflow: ellipsis;
`;

const Value = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis !important;

  & > span {
    margin-right: 5px;
  }
`;

const getEntry = (session: Session, entry: any) => {
  if (entry.or) {
    entry = entry.or.filter((e: any) => !!session[e.key])[0];
  }
  if (!entry) {
    return;
  }
  if (entry.formatValue && typeof entry.template == 'function') {
    return entry.formatValue(session);
  }
  return (
    <ParallelLayout>
      <Column grid={3}>
        <Label>{entry.label}:</Label>
      </Column>
      <Column grid={9}>
        <Value>
          {entry.icon && entry.icon(session)}
          {entry.formatValue ? entry.formatValue(session) : session[entry.key]}
        </Value>
      </Column>
    </ParallelLayout>
  );
};

type PropsType = {
  session: Session;
};

export default function SessionSummary(props: PropsType) {
  const { session } = props;
  return (
    <Container>
      {SUMMARY_CONFIG.map((entry, index) => (
        <Entry key={index}>{getEntry(session, entry)}</Entry>
      ))}
    </Container>
  );
}
