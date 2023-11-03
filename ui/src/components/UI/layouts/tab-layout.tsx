import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';

const TabsContainer = styled.div``;

type TabPropsType = {
  name: string;
  children: JSX.Element | null;
};

export function Tab(props: TabPropsType) {
  const { children } = props;
  return <TabsContainer>{children}</TabsContainer>;
}

export const TAB_HEADER_HEIGHT = 40;

const TabsLayoutContainer = styled.div`
  overflow: auto;
  height: 100%;
`;

const Header = styled.div`
  height: ${TAB_HEADER_HEIGHT}px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
`;

const TabName = styled.div<{ active: boolean }>`
  display: inline-block;
  border-bottom: 3px solid
    ${(props) => (props.active ? props.theme.colors.tab_active_header : 'transparent')};
  padding: 10px;
  cursor: ${(props) => (props.active ? 'default' : 'pointer')};
  color: ${(props) => (props.active ? props.theme.colors.tab_active_header : 'inherit')};
  margin-right: 20px;
  font-weight: 600;
  font-size: 13px;
`;

const Body = styled.div``;

type TabType = TabPropsType;

const useTabs = (children: JSX.Element[]) => {
  const tabs: TabType[] = [];
  React.Children.forEach(children, (children) => {
    if (children) {
      const props: TabType = children.props as TabType;

      tabs.push({
        name: props.name,
        children: props.children,
      });
    }
  });

  return tabs;
};

type TabsLayoutPropsType = {
  selected: string;
  children: JSX.Element[];
};

export default function TabsLayout(props: TabsLayoutPropsType) {
  const { selected } = props;
  const tabs = useTabs(props.children);
  const defaultTab = tabs.find((tab) => tab.name === selected);
  const [selectedTabName, setSelectedTabName] = useState<string | undefined>(defaultTab?.name);
  const selectedTab = tabs.find((tab) => tab.name === selectedTabName) || tabs[0];

  return (
    <TabsLayoutContainer>
      <Header>
        {tabs.map((tab: TabType) => (
          <TabName
            active={selectedTab?.name === tab.name}
            onClick={() => setSelectedTabName(tab.name)}
            key={tab.name}
          >
            {tab.name}
          </TabName>
        ))}
      </Header>
      <Body>{selectedTab?.children}</Body>
    </TabsLayoutContainer>
  );
}
