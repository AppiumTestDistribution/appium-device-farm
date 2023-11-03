import React from 'react';
import styled from 'styled-components';
import TabsLayout, { Tab, TAB_HEADER_HEIGHT } from '../layouts/tab-layout';
import Session from '../../../interfaces/session';

const Container = styled.div`
  word-break: break-word;
  padding: 10px;
`;

const TabChildContainer = styled.div<{
  height: string;
  responsiveWidth: number;
}>`
  height: ${(props) => props.height};
  overflow: auto;

  @media (max-width: ${(props) => props.responsiveWidth}px) {
    height: 100%;
  } ;
`;

const Entry = styled.div`
  width: 100%;
  display: flex;
  padding: 5px;
  margin-top: 10px;
  &:hover {
    background: ${(props) => props.theme.colors.greyscale[5]};
  }
`;

const Label = styled.div`
  min-width: 230px;
  font-weight: 600;
`;

const Value = styled.div`
  flex-wrap: wrap;
`;

const getCapabilityEntries = (tab: string, session: Session) => {
  const capabilityObject =
    tab == 'Capabilities' ? session.capabilities : session.capabilities.desired;
  if (!capabilityObject) {
    return null;
  }

  return Object.keys(capabilityObject)
    .filter((k) => k != 'desired' && capabilityObject[k] != '')
    .map((k) => {
      return (
        <Entry key={k}>
          <Label>{k}</Label>
          <Value>
            {typeof capabilityObject[k] == 'object' || typeof capabilityObject[k] == 'boolean'
              ? JSON.stringify(capabilityObject[k], null, 2)
              : capabilityObject[k]}
          </Value>
        </Entry>
      );
    });
};

type Propstype = {
  session: Session;
  height: number;
  responsiveWidth: number;
};

export default function SessionCapabilityDetails(props: Propstype) {
  const { session, height, responsiveWidth } = props;
  const childHeight = `calc(100vh - ${height + TAB_HEADER_HEIGHT}px)`;
  return (
    <Container>
      <TabsLayout selected="Capabilities">
        <Tab name="Capabilities">
          <TabChildContainer height={childHeight} responsiveWidth={responsiveWidth}>
            {getCapabilityEntries('Capabilities', session)}
          </TabChildContainer>
        </Tab>
        <Tab name="Desired Capabilities">
          <TabChildContainer height={childHeight} responsiveWidth={responsiveWidth}>
            {getCapabilityEntries('Desired Capabilities', session)}
          </TabChildContainer>
        </Tab>
      </TabsLayout>
    </Container>
  );
}
