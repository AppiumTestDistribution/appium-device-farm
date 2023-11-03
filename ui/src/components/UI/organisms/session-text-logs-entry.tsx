import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import SerialLayout, { Row } from '../layouts/serial-layout';
import ParallelLayout, { Column } from '../layouts/parallel-layout';
import Icon from '../atoms/icon';
import CommonUtils from '../../../utils/common-utils';
import CodeViewer from '../atoms/code-viewer';
import chroma from 'chroma-js';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ParamsContainer = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.greyscale[5]};
  padding: 15px 15px 5px;
  margin: 20px 0 5px 0px;
  max-height: 200px;
  overflow: auto;
  border-radius: ${(props) => props.theme.borderRadius.M};
`;

const ParamsTitle = styled.div`
  padding-bottom: 10px;
  font-size: 11px;
  color: grey;
  font-weight: 900;
  text-transform: uppercase;
`;

const ErrorContainer = styled(ParamsContainer)`
  border: 1px solid ${(props) => chroma(props.theme.colors.error).hex()};
  border-left: 5px solid ${(props) => chroma(props.theme.colors.error).hex()};
  background: ${(props) => chroma(props.theme.colors.error).brighten(3.5).hex()};

  & .text-log-params-json-entry-key {
    text-transform: capitalize;
  }
`;

const WarningContainer = styled(ErrorContainer)`
  border: 1px solid ${(props) => chroma(props.theme.colors.warning).hex()};
  border-left: 5px solid ${(props) => chroma(props.theme.colors.warning).hex()};
  background: ${(props) => chroma(props.theme.colors.warning).brighten(3.5).hex()};
`;

const StringValue = styled.div`
  font-size: 12px;
  padding-bottom: 10px;
`;

const JsonValue = styled(StringValue)``;

const JsonEntryKey = styled(StringValue)`
  font-weight: 500;
`;

const ErrorNameLabel = styled(JsonEntryKey)`
  text-transform: capitalize;
`;

function getLogBody(logTitle: string, logBody: any) {
  const code =
    typeof logBody.value !== 'string' ? JSON.stringify(logBody.value, null, 2) : logBody.value;
  if (logBody.type == 'error') {
    return (
      <WarningContainer>
        <ErrorNameLabel>{logBody.value.error}:</ErrorNameLabel>
        <JsonValue>{logBody.value.message}</JsonValue>
      </WarningContainer>
    );
  } else {
    return (
      <ParamsContainer>
        <ParamsTitle>{logTitle}</ParamsTitle>
        <JsonValue>
          <CodeViewer code={code} language="json" />
        </JsonValue>
      </ParamsContainer>
    );
  }
}

function getDuration(entry: any) {
  if (!entry.start_time || !entry.end_time) {
    return '';
  } else {
    const time = CommonUtils.convertTimeToReadableFormat(
      new Date(entry.start_time),
      new Date(entry.end_time)
    )
      .replace(/hrs|hr/g, 'h')
      .replace(/mins|min/g, 'm')
      .replace(/secs|sec/g, 's');
    return time;
  }
}

const Container = styled.div<{ expandable: boolean }>`
  padding: 10px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  ${(props) => {
    if (props.expandable) {
      return `
        cursor: pointer;
      `;
    }
  }}
  &:hover {
    background: ${(props) => props.theme.colors.components.log_entry_hover};
  }
`;

const Title = styled.div<{ isError: boolean }>`
    color: ${(props) =>
      props.isError ? chroma(props.theme.colors.warning).brighten(-1).hex() : 'inherit'};
  }
`;

const TitleInfo = styled.div`
  color: ${(props) => props.theme.colors.greyscale[3]};
  font-weight: ${(props) => props.theme.fonts.weight.L};
  letter-spacing: -0.2px;
`;

const Time = styled.div`
  color: ${(props) => props.theme.colors.greyscale[3]};
`;

const TimeText = styled.span`
  margin-left: 10px;
`;

const Expand = styled.div`
  text-align: right;
  cursor: pointer;
`;

const ScreenshotLink = styled.a`
  padding: 15px;
  display: flex;
  margin-right: auto;
  cursor: pointer;
`;

const Screenshot = styled(LazyLoadImage)`
  max-width: 300px;
  max-height: 600px;
  height: auto;
`;

type PropsType = {
  entry: any;
  showScreenShots: boolean;
};

export default function LogEntry(props: PropsType) {
  const [expanded, setExpanded] = useState(false);
  const { entry, showScreenShots } = props;
  return (
    <Container onClick={() => setExpanded(!expanded)} expandable={!!entry.params}>
      <SerialLayout>
        <Row>
          <ParallelLayout>
            <Column grid={4}>
              <Title isError={entry.is_error}>{entry.title}</Title>
            </Column>
            <Column grid={6}>
              <TitleInfo>{entry.title_info}</TitleInfo>
            </Column>
            <Column grid={1}>
              {getDuration(entry) != '' ? (
                <Time>
                  <Icon name="time" />
                  <TimeText>{getDuration(entry)}</TimeText>
                </Time>
              ) : null}
            </Column>
            <Column grid={1}>
              {!!entry.params ? (
                <Expand>
                  {expanded ? (
                    <Icon name="arrow-up" onClick={() => setExpanded(false)} />
                  ) : (
                    <Icon name="arrow-down" onClick={() => setExpanded(true)} />
                  )}
                </Expand>
              ) : null}
            </Column>
          </ParallelLayout>
        </Row>
        {entry.response != null ? <Row>{getLogBody('Response', entry.response)}</Row> : null}
        {entry.params != null && expanded ? <Row>{getLogBody('Params', entry.params)}</Row> : null}

        {showScreenShots && entry.screen_shot != null ? (
          <Row>
            <ScreenshotLink
              target="blank"
              href={CommonUtils.getScreenshotForLog(entry.session_id, entry.log_id)}
            >
              <Screenshot
                src={CommonUtils.getScreenshotForLog(entry.session_id, entry.log_id)}
                effect="opacity"
              />
            </ScreenshotLink>
          </Row>
        ) : null}
      </SerialLayout>
    </Container>
  );
}
