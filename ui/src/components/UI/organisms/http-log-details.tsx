import chroma from 'chroma-js';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import Icon, { Sizes } from '../atoms/icon';
import CodeViewer from '../atoms/code-viewer';
import Centered from '../molecules/centered';
import EmptyMessage from '../molecules/empty-message';
import CommonUtils from '../../../utils/common-utils';

export type HttpLogs = {
  id: number;
  url: string;
  method: string;
  request_type: string;
  response_status: number;
  response_status_text: string;
  start_time: Date;
  request_headers: Record<string, any>;
  response_headers: Record<string, any>;
  response_body: any;
  response_content_type: string;
  request_post_data: any;
  request_content_type: string;
};

export type propsType = {
  log: HttpLogs;
  onClose?: () => void;
  parentHeight: number;
};

const Container = styled.div<{ height: string }>`
  height: ${(props) => props.height};
`;

const Header = styled.div`
  display: flex;
  flex-drirection: column;
  align-items: center;
  align-content: center;
  gap: 5px;
  border: 1px solid ${(props) => props.theme.colors.components.http_logs_table_border};
  border-top: none;
  background: ${(props) => props.theme.colors.components.http_logs_table_header_bg};
  color: ${(props) => props.theme.colors.components.http_logs_table_header_color};
  padding-top: 5px;

  .icon {
    cursor: pointer;
  }
`;

const HeaderTab = styled.div<{ active?: boolean }>`
  padding: 5px 5px 0 5px;
  background: ${(props) =>
    props.active ? chroma(props.theme.colors.primary).brighten(2).hex() : 'transparent'};
  border-radius: 1px;
  cursor: pointer;
  font-weight: 600;
  padding-bottom: 5px;
`;

const LogBody = styled.div<{ height: string }>`
  height: ${(props) => props.height};
  overflow: auto;
  background: ${(props) => props.theme.colors.components.http_logs_table_bg};
  color: ${(props) => props.theme.colors.components.http_logs_table_color};
`;

const HttpHeaderTabAccordionContainer = styled.div<{ expanded?: boolean }>`
  padding: 10px 5px 10px 5px;

  ${(props) =>
    props.expanded &&
    `border-bottom: 1px solid ${props.theme.colors.components.http_logs_table_border}`}
`;

const HttpHeaderTabAccordionTitleContainer = styled.div<{ active: boolean }>`
  display: flex;
  padding: 5px;
  display-direction: row;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors.components.http_logs_table_row_hover};
  }
`;

const HttpHeaderTabAccordionTitle = styled.span`
  font-weight: 500;
  font-size: 12px;
`;
const HttpHeaderTabAccordionBody = styled.div`
  padding: 10px 10px 10px 20px;
`;

const JsonRow = styled.div`
  padding-bottom: 7px;
`;

const JsonKey = styled.span`
  color: ${(props) =>
    chroma(props.theme.colors.components.http_logs_table_color).brighten(0.9).hex()};
  font-weight: 600;
  padding-right: 2px;
`;

const JsonValue = styled.span`
  font-size: 11px;
  white-space: break-space;
  word-break: break-all;
  padding-left: 2px;
`;

const StyledEmptyMessage = styled(EmptyMessage)`
  color: ${(props) => props.theme.colors.components.http_logs_table_color};
  font-size: 14px;
`;

function HttpHeadersTab(props: {
  header: string;
  expand: boolean;
  details: Record<string, any>;
  showCount?: boolean;
}) {
  const { header, expand, details, showCount = false } = props;
  const [expanded, setExpanded] = useState(expand);

  const toggleAccordion = () => setExpanded(!expanded);

  const rows = useMemo(() => {
    const rows = Object.keys(details)
      .filter((k) => !!details[k])
      .map((k, index) => {
        return (
          <JsonRow key={index}>
            <JsonKey>{k}:</JsonKey>
            <JsonValue>{details[k]}</JsonValue>
          </JsonRow>
        );
      });
    return <HttpHeaderTabAccordionBody>{rows}</HttpHeaderTabAccordionBody>;
  }, [details]);

  return (
    <HttpHeaderTabAccordionContainer expanded={expanded}>
      <HttpHeaderTabAccordionTitleContainer active={expanded} onClick={toggleAccordion}>
        <Icon name={expanded ? 'collapse-arrow' : 'expand-arrow'} onClick={toggleAccordion} />
        <HttpHeaderTabAccordionTitle>{`${header} ${
          showCount ? `(${Object.keys(details).length})` : ''
        }`}</HttpHeaderTabAccordionTitle>
      </HttpHeaderTabAccordionTitleContainer>
      {!!expanded && rows}
    </HttpHeaderTabAccordionContainer>
  );
}

enum LogTabs {
  HEADERS = 'Headers',
  RESPONSE = 'Response',
  PAYLOAD = 'Payload',
}

const FORM_URL_ENCODED_CONTENT_TYPE = new RegExp(/form-urlencoded/g);

function getPayloadElement(type: string, data: any) {
  if (!FORM_URL_ENCODED_CONTENT_TYPE.test(type)) {
    return <CodeViewer code={CommonUtils.parseJson(data)} language={'json'} lineNumber />;
  } else {
    return data;
  }
}

export default function HttpLogDetails(props: propsType) {
  {
    const { log, onClose, parentHeight } = props;
    const [activeTab, setActiveTab] = useState(LogTabs.HEADERS);
    const [headers] = useState([LogTabs.HEADERS, LogTabs.PAYLOAD, LogTabs.RESPONSE]);
    const onTabChange = useCallback((tabHeader: LogTabs) => {
      setActiveTab(tabHeader);
    }, []);

    const header = useMemo(() => {
      const tabs = headers.map((header) => (
        <HeaderTab key={header} onClick={() => onTabChange(header)} active={activeTab == header}>
          {header}
        </HeaderTab>
      ));
      return (
        <Header>
          <Icon name="close" onClick={onClose} size={Sizes.L}></Icon>
          {tabs}
        </Header>
      );
    }, [headers, activeTab]);

    const getBody = (header: LogTabs) => {
      let bodyContent;
      switch (header) {
        case LogTabs.HEADERS:
          bodyContent = (
            <LogBody height={`calc(100vh - ${parentHeight + 20}px)`}>
              <HttpHeadersTab
                header="General"
                details={{
                  'Request URL': log.url,
                  Method: log.method,
                  'Status Code': log.response_status,
                  'Status Text': log.response_status_text,
                }}
                expand
              />
              <HttpHeadersTab
                header="Request Headers"
                details={log.request_headers}
                showCount
                expand
              />
              <HttpHeadersTab
                header="Response Headers"
                details={log.response_headers}
                showCount
                expand
              />
            </LogBody>
          );
          break;

        case LogTabs.RESPONSE:
          if (log.response_body) {
            bodyContent = getPayloadElement(log.response_content_type, log.response_body);
          } else {
            bodyContent = (
              <Centered>
                <StyledEmptyMessage>Response not available</StyledEmptyMessage>
              </Centered>
            );
          }
          break;
        case LogTabs.PAYLOAD:
          if (log.request_post_data) {
            bodyContent = getPayloadElement(log.request_content_type, log.request_post_data);
          } else {
            bodyContent = (
              <Centered>
                <StyledEmptyMessage>Payload not available</StyledEmptyMessage>
              </Centered>
            );
          }
          break;
      }
      return <LogBody height={`calc(100vh - ${parentHeight + 20}px)`}>{bodyContent}</LogBody>;
    };

    return (
      <Container height={`calc(100vh - ${parentHeight}px)`}>
        {header}
        {getBody(activeTab)}
      </Container>
    );
  }
}
