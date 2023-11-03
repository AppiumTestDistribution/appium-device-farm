import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Session from '../../../interfaces/session';
import { fetchSessionProfilingData } from '../../../store/actions/session-actions';
import {
  getisProfilingLoading,
  getProfilingdata,
} from '../../../store/selectors/entities/logs-selector';
import Spinner from '../atoms/spinner';
import SerialLayout, { Row } from '../layouts/serial-layout';
import Centered from '../molecules/centered';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import CommonUtils from '../../../utils/common-utils';
import { getSelectedTheme } from '../../../store/selectors/ui/theme-selector';
import _ from 'lodash';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type PropsType = {
  session: Session;
  parentHeight: number;
};

const Container = styled.div`
  max-width: 700px !important;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

const ChartRow = styled.div`
  margin: 25px 0 40px 0;
`;

function toMegaByte(value: any) {
  return Math.ceil(Number(value) / 1024);
}

/* Cpu Usage data */
function getCpuChartOptions(session: Session) {
  return {
    responsive: true,
    aspectRatio: 3,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: `CPU [${session.device_info.total_cpu} processors = ${
          session.device_info.total_cpu * 100
        } %]`,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.dataset.label + ' : ' + context.parsed.y;
          },
        },
      },
    },
    parsing: {
      xAxisKey: 'timestamp',
      yAxisKey: 'cpu',
    },
    scales: {
      y: {
        min: -1,
        max: session.device_info.total_cpu * 100,
      },
    },
  };
}

function getCpuChartData(session: Session, profilingData: any[], theme: Record<string, any>) {
  return {
    datasets: [
      {
        label: 'Total CPU Usage %',
        data: profilingData.map((v: any) => {
          return {
            timestamp: v.timestamp,
            cpu: v.total_cpu_used,
          };
        }),
        fill: true,
        borderColor: theme.colors.components.profiling_chart_system_cpu_border,
        backgroundColor: theme.colors.components.profiling_chart_system_cpu_background,
      },
      {
        label: `${session.capabilities.appPackage} %`,
        data: profilingData.map((v: any) => {
          return {
            timestamp: v.timestamp,
            cpu: v.cpu,
          };
        }),
        fill: true,
        borderColor: theme.colors.components.profiling_chart_app_cpu_border,
        backgroundColor: theme.colors.components.profiling_chart_app_cpu_background,
      },
    ],
  };
}

/* Memory usage data */
function getMemoryUsageChartOptions(session: Session) {
  const totalMemoryInMB = toMegaByte(session.device_info.total_memory);
  return {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
        },
      },
      title: {
        display: true,
        text: `MEMORY [${totalMemoryInMB} MB]`,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return context.dataset.label + ' : ' + context.parsed.y;
          },
        },
      },
    },
    parsing: {
      xAxisKey: 'timestamp',
      yAxisKey: 'memory',
    },
    aspectRatio: 3,
    scales: {
      y: {
        min: 0,
        max: Math.ceil(totalMemoryInMB / 500) * 500, //round to nearest five hundred
        ticks: {
          stepSize: 500,
        },
      },
    },
  };
}

function getMemoryChartData(session: Session, profilingData: any[], theme: Record<string, any>) {
  return {
    datasets: [
      {
        label: 'Total Memory Usage (MB)',
        data: profilingData.map((data) => {
          return {
            timestamp: data.timestamp,
            memory: Math.ceil(Number(data.total_memory_used) / 1024),
          };
        }),
        fill: true,
        borderColor: theme.colors.components.profiling_chart_system_memory_border,
        backgroundColor: theme.colors.components.profiling_chart_system_memory_background,
      },
      {
        label: `${session.capabilities.appPackage} (MB)`,
        data: profilingData.map((data) => {
          return {
            timestamp: data.timestamp,
            memory: toMegaByte(data.memory),
          };
        }),
        fill: true,
        borderColor: theme.colors.components.profiling_chart_app_memory_border,
        backgroundColor: theme.colors.components.profiling_chart_app_memory_background,
      },
    ],
  };
}

function useProfiling(session: Session) {
  const profilingData = useSelector(getProfilingdata);
  const processedData = profilingData.map((data: any) => {
    return {
      ...data,
      timestamp:
        CommonUtils.getTimeDiffInSecs(new Date(session.created_at), new Date(data.timestamp)) + 's',
    };
  });
  return _.uniqBy(processedData, 'timestamp');
}

export default function AppProfiling(props: PropsType) {
  const { session, parentHeight } = props;
  const dispatch = useDispatch();
  const theme = useSelector(getSelectedTheme);
  const isLoading = useSelector(getisProfilingLoading);
  const profilingData = useProfiling(session);

  useEffect(() => {
    dispatch(fetchSessionProfilingData(session.session_id));
  }, [session.session_id]);

  if (isLoading) {
    return (
      <Centered>
        <Spinner />
      </Centered>
    );
  } else {
    return (
      <SerialLayout>
        <Row height={`calc(100vh - ${parentHeight}px)`} scrollable>
          <Container>
            <ChartRow>
              <Line
                options={getCpuChartOptions(session)}
                data={getCpuChartData(session, profilingData, theme)}
              ></Line>
            </ChartRow>
            <ChartRow>
              <Line
                options={getMemoryUsageChartOptions(session)}
                data={getMemoryChartData(session, profilingData, theme)}
              ></Line>
            </ChartRow>
          </Container>
        </Row>
      </SerialLayout>
    );
  }
}
