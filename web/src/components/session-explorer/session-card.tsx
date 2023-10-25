import React from 'react';
import { styled } from 'styled-components';
import FlexContainer from '../../layouts/flex-container';
import { spawn } from 'child_process';
import CommonUtils from '../../utils/common-utils';
import Icon from '../icons';
import { access } from 'fs';

const Container = styled.div`
  padding: 10px;
  width: 95%;
  border-bottom: 1px solid #bdbdbd;
  display: flex;
  flex-direction: column;
  gap: 25px;
  background: #f0f4f7;
  cursor: pointer;

  &:hover {
    background-color: #cccccc;
  }

  &.active {
    background-color: #abd2ed;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-tems: flex-start;
`;

const Label = styled.span`
  font-size: 12px;
  color: #57606a;
  margin-right: 2px;
  font-weight: 500;
  display: inline-block;
  min-width: 100px;
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 600;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 95%;
  color: rgb(61, 59, 59);
  display: inline-block;
  padding-bottom: 10px;
`;

const LabelValue = styled.span<{ fontSize?: number }>`
  font-size: ${(props) => props.fontSize || 15}px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 95%;
  color: rgb(61, 59, 59);
  display: inline-block;
`;

const SessionStatus = styled.div`
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  padding: 4px 4px;
  max-width: 70px;
  text-align: center;
  background-color: #e5e5e5;

  &.success,
  &.passed {
    color: #0a5644;
    background-color: #a6efe0;
    border: 1px solid #0a5644;
  }

  &.unmarked {
    color: #6d7a77;
    background-color: #f2f2f2;
    border: 1px solid #6d7a77;
  }

  &.failed {
    color: #ae3c3c;
    background-color: #f9bbbb;
    border: 1px solid #ae3c3c;
  }

  &.timeout {
    color: #6f6e2f;
    background-color: #fcf7bf;
    border: 1px solid #6f6e2f;
  }
`;

function getTitle(session: any) {
  if (session.name) {
    return session.name;
  } else {
    let title = `${session.device_platform} ${session.device_version}`.toLowerCase();
    if (session.browser_name) {
      title += `, ${session.browser_name}`;
    }
    return title;
  }
}

function getDuration(session: any) {
  if (session.status.toLowerCase() == 'running') {
    return `Started ${CommonUtils.convertTimeToReadableFormat(
      new Date(session.startTime),
      new Date()
    )} ago`;
  } else {
    return `Took ${CommonUtils.convertTimeToReadableFormat(
      new Date(session.startTime),
      new Date(session.endTime)
    )}`;
  }
}

export function SessionCard(props: any) {
  const { session, active, onClick } = props;

  return (
    <Container className={`${active ? 'active' : ''}`} onClick={onClick}>
      <Body>
        <Title>{getTitle(session)}</Title>
        <FlexContainer direction="row" justify="flex-start">
          <Label>SessionId:</Label>
          <LabelValue fontSize={12}>{session.id}</LabelValue>
        </FlexContainer>
        <FlexContainer direction="row" justify="flex-start">
          <Label>Device UDID:</Label>
          <LabelValue fontSize={12}>{session.device_udid}</LabelValue>
        </FlexContainer>
      </Body>
      <Footer>
        <SessionStatus className={`${session.status.toLowerCase()}`}>
          {session.status}
        </SessionStatus>
        <FlexContainer direction="row">
          <Icon name="mobile"></Icon>
          <Label>{session.device_name}</Label>
        </FlexContainer>
        <FlexContainer direction="row">
          <Label>{getDuration(session)}</Label>
        </FlexContainer>
      </Footer>
    </Container>
  );
}
