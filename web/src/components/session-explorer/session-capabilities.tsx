import React from 'react';
import styled from 'styled-components';
import TabsLayout, { Tab, TAB_HEADER_HEIGHT } from '../../layouts/tab-layout';

const Container = styled.div`
  word-break: break-word;
  padding: 10px;
`;

const TabChildContainer = styled.div`
  overflow: scroll;
  height: 300px;
`;

const Entry = styled.div`
  width: 100%;
  display: flex;
  padding: 5px;
  margin-top: 10px;
  &:hover {
    background: grey;
  }
`;

const Label = styled.div`
  min-width: 230px;
  font-weight: 600;
`;

const Value = styled.div`
  flex-wrap: wrap;
`;

const getCapabilityEntries = (tab: string, session: any) => {
  const capabilityObject =
    tab == 'Capabilities'
      ? JSON.parse(session.session_capabilities)
      : JSON.parse(session.desired_capabilities);
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
  session: any;
};

export default function SessionCapabilityDetails(props: Propstype) {
  const { session } = props;

  return (
    <Container>
      <TabsLayout selected="Capabilities">
        <Tab name="Capabilities">
          <TabChildContainer>{getCapabilityEntries('Capabilities', session)}</TabChildContainer>
        </Tab>
        <Tab name="Desired Capabilities">
          <TabChildContainer>
            {getCapabilityEntries('Desired Capabilities', session)}
          </TabChildContainer>
        </Tab>
      </TabsLayout>
    </Container>
  );
}
