import chroma from 'chroma-js';
import React, { useCallback, useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Session from '../../../interfaces/session';
import { fetchSessionHttpLogs } from '../../../store/actions/session-actions';
import { getHttpLogs, getisHttpLogsLoading } from '../../../store/selectors/entities/logs-selector';
import Input from '../atoms/input';
import Spinner from '../atoms/spinner';
import ParallelLayout, { Column } from '../layouts/parallel-layout';
import SerialLayout, { Row } from '../layouts/serial-layout';
import Centered from '../molecules/centered';
import HttpLogsTable from './http-logs-table';
import { TAB_HEADER_HEIGHT } from '../layouts/tab-layout';

const HEADER_HEIGHT = 40;

const Container = styled.div``;

const HeaderContainer = styled.div`
  background: ${(props) => props.theme.colors.primary};
  border: 1px solid ${(props) => props.theme.colors.border};
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LogTypeFilterContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  margin: auto;
`;

const LogTypeFilterItem = styled.div<{ isSelected?: boolean }>`
  background: ${(props) =>
    props.isSelected ? chroma(props.theme.colors.primary).brighten(2).hex() : 'transparent'};
  color: ${(props) => props.theme.colors.greyscale[6]};
  padding: 3px 7px 3px 7px;
  border-radius: 12px;
  cursor: pointer;

  ${(props) =>
    !props.isSelected &&
    `&:hover {
      background: ${chroma(props.theme.colors.primary).brighten(1.5).hex()}
    }`};
`;

/*Document, Stylesheet, Image, Media, Font, Script, TextTrack, XHR, Fetch, EventSource, WebSocket, Manifest, SignedExchange, Ping, CSPViolationReport, Preflight, Other */

//TODO: Refactor this. temporary changes
const StyledInput = styled(Input)`
  background: transparent;

  &&& input {
    background: transparent;
    color: #fff;
    background: ${(props) => chroma(props.theme.colors.primary).brighten(0.6).hex()};
    border: 1px solid ${(props) => chroma(props.theme.colors.primary).brighten(1).hex()};
    height: 25px;
    padding: 0 0 0 5px;
    ::placeholder {
      color: ${(props) => chroma(props.theme.colors.primary).brighten(4).hex()};
      opacity: 1;
      line-height: 90px;
    }
  }

  &&& path {
    background: #fff;
    stroke: #fff;
  }
`;

type PropsType = {
  session: Session;
  parentHeight: number;
};

const requestTypeFilters = [
  {
    label: 'All',
    id: 0,
    filterRegex: /xhr|fetch/i,
  },
  {
    label: 'XHR/Fetch',
    id: 1,
    filterRegex: /xhr|fetch/i,
  },
  {
    label: 'JS',
    id: 2,
    filterRegex: /script/i,
  },
  {
    label: 'CSS',
    id: 3,
    filterRegex: /stylesheet/i,
  },
  {
    label: 'Img',
    id: 4,
    filterRegex: /image/i,
  },
  {
    label: 'Media',
    id: 5,
    filterRegex: /media/i,
  },
  {
    label: 'Font',
    id: 6,
    filterRegex: /font/i,
  },
  {
    label: 'Doc',
    id: 7,
    filterRegex: /document/i,
  },
  {
    label: 'Other',
    id: 8,
    filterRegex: /other/i,
  },
];

function useLogs(opts: { textFilter?: string; requestTypeFilterId?: number }) {
  const { textFilter, requestTypeFilterId = 0 } = opts;
  const logs = useSelector(getHttpLogs);
  const filters = [];
  if (textFilter) {
    filters.push((log: any) => log.url && log.url.indexOf(textFilter) >= 0);
  }
  if (requestTypeFilterId > 0) {
    const typeFilter = requestTypeFilters.filter((f) => f.id == requestTypeFilterId)[0];
    filters.push((log: any) => new RegExp(typeFilter.filterRegex).test(log.request_type));
  }
  return filters.reduce(
    (acc, filterFn) => {
      return acc.filter(filterFn);
    },
    [...logs]
  );
}

export default function SessionHttpLogs(props: PropsType) {
  const { session, parentHeight } = props;
  const isLoading = useSelector(getisHttpLogsLoading);
  const dispatch = useDispatch();

  const [selectedRequestTypeFilter, setSelectedRequestTypeFilter] = useState(0);
  const [textFilter, setTextFilter] = useState('');

  const logs = useLogs({
    requestTypeFilterId: selectedRequestTypeFilter,
    textFilter: textFilter,
  });

  /* Event callbacks */
  const onRequestTypeFilterChange = useCallback((index: number) => {
    setSelectedRequestTypeFilter(index);
  }, []);

  const onTextFilterChange = useCallback((text: string) => {
    setTextFilter(text);
  }, []);

  function getRequestTypeFilters() {
    return requestTypeFilters.map((filter) => (
      <LogTypeFilterItem
        key={filter.label}
        isSelected={filter.id == selectedRequestTypeFilter ? true : false}
        onClick={() => onRequestTypeFilterChange(filter.id)}
      >
        {filter.label}
      </LogTypeFilterItem>
    ));
  }

  useEffect(() => {
    dispatch(fetchSessionHttpLogs(session.session_id));
  }, [session.session_id]);

  if (isLoading) {
    return (
      <Centered>
        <Spinner />
      </Centered>
    );
  } else {
    return (
      <Container>
        <SerialLayout>
          <Row height={`${HEADER_HEIGHT}px`}>
            <HeaderContainer>
              <ParallelLayout>
                <Column grid={3}>
                  <StyledInput
                    name="search"
                    type="text"
                    placeholder="Filter logs"
                    leftIcon="filter"
                    width="200px"
                    value={textFilter}
                    onChange={(e) => onTextFilterChange(e.target.value)}
                  />
                </Column>
                <Column grid={9}>
                  <LogTypeFilterContainer>{getRequestTypeFilters()}</LogTypeFilterContainer>
                </Column>
              </ParallelLayout>
            </HeaderContainer>
          </Row>
          {/* Table entry */}
          <Row height={`calc(100vh - ${HEADER_HEIGHT + TAB_HEADER_HEIGHT + parentHeight}px)`}>
            <HttpLogsTable
              logs={logs}
              parentHeight={HEADER_HEIGHT + TAB_HEADER_HEIGHT + parentHeight}
            />
          </Row>
        </SerialLayout>
      </Container>
    );
  }
}
