import React from 'react';
import Moment from 'react-moment';
import styled from 'styled-components';
import { useState } from 'react';
import ParallelLayout, { Column } from '../layouts/parallel-layout';
import Icon from '../atoms/icon';
import CodeViewer from '../atoms/code-viewer';

const Container = styled.div<{ expandable: boolean }>`
  padding: 10px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  ${(props) => {
    return props.expandable
      ? `
        cursor: pointer;
        &:hover {
          background: ${props.theme.colors.components.log_entry_hover};
        }
      `
      : '';
  }}
`;

const Header = styled.div``;

const Content = styled.div``;

const Time = styled.div`
  color: ${(props) => props.theme.colors.greyscale[3]};
`;

const Message = styled.div`
  font-size: 11px;
  margin-left: 15px;
`;

const Expand = styled.div`
  text-align: right;
`;

const CodeViewerWrapper = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  background: ${(props) => props.theme.colors.greyscale[5]};
  margin: 20px 10px 10px;
  padding: 10px;
  border-radius: ${(props) => props.theme.borderRadius.M};
  max-height: 200px;
  overflow: auto;
`;

type PropsType = {
  entry: any;
};

export default function SessionDebugLogEntry(props: PropsType) {
  const { entry } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Container onClick={() => setIsExpanded(!isExpanded)} expandable={!!entry.args}>
      <Header>
        <ParallelLayout>
          <Column grid={2}>
            <Time>
              <Moment format="DD-MM-YYYY HH:mm:ss">{entry.timestamp}</Moment>
            </Time>
          </Column>
          <Column grid={9}>
            <Message>{entry.message}</Message>
          </Column>
          <Column grid={1}>
            {entry.args && (
              <Expand>{isExpanded ? <Icon name="arrow-up" /> : <Icon name="arrow-down" />}</Expand>
            )}
          </Column>
        </ParallelLayout>
      </Header>
      <Content>
        {entry.args && isExpanded && (
          <CodeViewerWrapper>
            <CodeViewer code={JSON.stringify(entry.args, null, 2)} language={'json'} />
          </CodeViewerWrapper>
        )}
      </Content>
    </Container>
  );
}
