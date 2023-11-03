import styled from 'styled-components';
import React, { useCallback, useState } from 'react';
import _ from 'lodash';
import Icon, { Sizes } from '../atoms/icon';
import ParallelLayout, { Column } from '../layouts/parallel-layout';
import HttpLogDetails, { HttpLogs } from './http-log-details';
import chroma from 'chroma-js';
import { ThemeConfig } from '../../../constants/themes';
import { useSelector } from 'react-redux';
import { getSelectedTheme } from '../../../store/selectors/ui/theme-selector';

type propsType = {
  logs: Array<HttpLogs>;
  parentHeight: number;
};

const TABLE_HEADER_HEIGHT = 20;

const Table = styled.table<{ height: string }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  height: ${(props) => props.height};
  border-right: 1px solid ${(props) => props.theme.colors.greyscale[3]};
  background: ${(props) => props.theme.colors.components.http_logs_table_bg};
  color: ${(props) => props.theme.colors.components.http_logs_table_color};
`;

const TableHead = styled.thead`
  color: ${(props) => props.theme.colors.components.http_logs_table_header_color};
  background: ${(props) => props.theme.colors.components.http_logs_table_header_bg};
`;

const TableBody = styled.tbody<{ height: string }>`
  height: ${(props) => props.height};
  overflow: auto;

  & > {
    tr {
      border-bottom: 1px solid ${(props) => props.theme.colors.components.http_logs_table_border};
    }

    tr:hover {
      background: ${(props) => props.theme.colors.components.http_logs_table_row_hover};
    }
  }
`;

const TH = styled.th<{ width: number }>`
  width: ${(props) => props.width}%;
  height: ${TABLE_HEADER_HEIGHT}px;
  display: flex;
  align-content: center;
  justify-content: center;
  border-left: 1px solid ${(props) => props.theme.colors.components.http_logs_table_border};
  font-weight: 600;
`;

const TR = styled.tr<{ failed: boolean; active?: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  height: 25px;

  &:nth-child(even) {
     background :  ${(props) => props.theme.colors.components.http_logs_table_even_row_bg};
  }
 
  color: ${(props) =>
    props.failed ? chroma(props.theme.colors.error).brighten(1).hex() : 'inherit'}}!important ;

   ${(props) =>
     !!props.active &&
     `background: ${props.theme.colors.components.http_logs_table_row_active}!important;`}   
`;

const TD = styled.td<{ width: number }>`
  width: ${(props) => props.width}%;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 1px 4px;
  font-size: 11px;
  height: 21px;
  font-weight: 400;
  cursor: pointer;
  border-left: 1px solid ${(props) => props.theme.colors.components.http_logs_table_border};
`;

const LogDetailsContainer = styled.div<{ height: string }>`
  height: ${(props) => props.height};
`;

const UrlIconContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UrlName = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 5px;
`;

const columns: any = [
  {
    key: 'url',
    label: 'Name',
    width: 65,
    getComponent: (row: HttpLogs, theme: ThemeConfig) => {
      let path: string = row.url;
      try {
        const url = new URL(row.url);
        path = url.pathname == '/' ? row.url : `${url.pathname.split('/').pop()}`;
        const searchParams = row.url.split('?');
        path = `${path}${searchParams.length > 1 ? '?' + searchParams.pop() : ''}`;
      } catch (err) {
        //ignore
      }

      return (
        <UrlIconContainer>
          {getIcon(row.request_type, theme)}
          <UrlName>{path}</UrlName>
        </UrlIconContainer>
      );
    },
  },
  {
    key: 'method',
    label: 'Method',
    width: 10,
  },
  {
    key: 'response_status',
    label: 'Status',
    width: 10,
  },
  {
    key: 'request_type',
    label: 'Type',
    width: 15,
  },
];

function getIcon(logType: string, theme: ThemeConfig) {
  const iconSize = Sizes.S;
  const themeComponent: any = theme.colors.components;
  switch (logType.toLowerCase()) {
    case 'xhr':
    case 'fetch':
      return (
        <Icon name="api" size={iconSize} color={themeComponent.http_logs_table_icon_api}></Icon>
      );
    case 'document':
      return (
        <Icon
          name="document"
          size={iconSize}
          color={themeComponent.http_logs_table_icon_document}
        ></Icon>
      );
    case 'image':
      return <Icon name="image" size={iconSize}></Icon>;
    case 'stylesheet':
      return <Icon name="css" size={iconSize}></Icon>;
    case 'script':
      return (
        <Icon name="code" size={iconSize} color={themeComponent.http_logs_table_icon_script}></Icon>
      );
    default:
      return <Icon name="square" size={iconSize}></Icon>;
  }
}

function getColumns(isLogsSelected: boolean) {
  return isLogsSelected
    ? [
        {
          ...columns[0],
          width: 100,
        },
      ]
    : columns;
}

function getHeader(isLogSelected: boolean) {
  const headers = getColumns(isLogSelected).map((c: any) => {
    return (
      <TH key={`th-${c.key}`} width={c.width}>
        {c.label}
      </TH>
    );
  });
  return (
    <TR key={`tr-header`} failed={false}>
      {headers}
    </TR>
  );
}

function getRows(
  logs: Array<HttpLogs>,
  selectedLog: HttpLogs | null,
  onLogSelected: (log: HttpLogs) => any,
  theme: ThemeConfig
) {
  return logs.map((l: HttpLogs, index: number) => {
    const cells = getColumns(!!selectedLog).map((c: any) => {
      let value: any = l[c.key as keyof HttpLogs];
      if (_.isFunction(c.getComponent)) {
        value = c.getComponent(l, theme);
      } else if (_.isFunction(c.getCellValue)) {
        value = c.getCellValue(l);
      }

      return (
        <TD key={`td-${index}-${c.key}`} width={c.width} onClick={() => onLogSelected(l)}>
          {value}
        </TD>
      );
    });
    const isFailure = l.response_status >= 400 && l.response_status <= 600;
    return (
      <TR key={`tr-${index}`} failed={isFailure} active={selectedLog?.id == l.id}>
        {cells}
      </TR>
    );
  });
}

export default function HttpLogsTable(props: propsType) {
  const { logs, parentHeight } = props;
  const theme = useSelector(getSelectedTheme);
  const [selectedLog, setSelectedLog] = useState<HttpLogs | null>(null);

  const onLogSelected = useCallback((log: HttpLogs | null) => {
    setSelectedLog(log);
  }, []);

  return (
    <ParallelLayout>
      <Column grid={!!selectedLog ? 4 : 12}>
        <Table height={`calc(100vh - ${parentHeight}px)`}>
          <TableHead>{getHeader(!!selectedLog)}</TableHead>
          <TableBody height={`calc(100vh - ${parentHeight + TABLE_HEADER_HEIGHT}px)`}>
            {getRows(logs, selectedLog, (log) => onLogSelected(log), theme)}
          </TableBody>
        </Table>
      </Column>
      {!!selectedLog ? (
        <Column grid={8}>
          <LogDetailsContainer height={`calc(100vh - ${parentHeight}px)`}>
            <HttpLogDetails
              log={selectedLog}
              onClose={() => onLogSelected(null)}
              parentHeight={parentHeight}
            ></HttpLogDetails>
          </LogDetailsContainer>
        </Column>
      ) : null}
    </ParallelLayout>
  );
}
