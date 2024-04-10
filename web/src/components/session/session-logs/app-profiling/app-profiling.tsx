import './app-profiling.css';
import { IAppProfilingLogs } from '../../../../interfaces/IAppProfilingLogs';
import { ISession } from '../../../../interfaces/ISession';
import _ from 'lodash';
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

const colors = {
  profiling_chart_system_cpu_border: 'rgb(194, 230, 153)',
  profiling_chart_system_cpu_background: 'rgba(194, 230, 153, 0.5)',
  profiling_chart_app_cpu_border: 'rgb(49, 163, 84)',
  profiling_chart_app_cpu_background: 'rgba(49, 163, 84, 0.5)',
  profiling_chart_system_memory_border: 'rgb(65, 182, 196)',
  profiling_chart_system_memory_background: 'rgba(65, 182, 196, 0.5)',
  profiling_chart_app_memory_border: 'rgb(34, 94, 168)',
  profiling_chart_app_memory_background: 'rgba(34, 94, 168, 0.5)',
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function toMegaByte(value: any) {
  return Math.ceil(Number(value) / 1024);
}

function getTimeDiffInSecs(startDate: Date, endDate: Date) {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / 1000);
}

/* Cpu Usage data */
function getCpuChartOptions(appProfilingLogs: IAppProfilingLogs) {
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
        text: `CPU [${appProfilingLogs.device_info.total_cpu} processors = ${
          appProfilingLogs.device_info.total_cpu * 100
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
        max: appProfilingLogs.device_info.total_cpu * 100,
      },
    },
  };
}

function getCpuChartData(appProfilingLogs: IAppProfilingLogs) {
  return {
    datasets: [
      {
        label: 'Total CPU Usage %',
        data: appProfilingLogs.profiling_logs.map((v: any) => {
          return {
            timestamp: v.timestamp,
            cpu: v.total_cpu_used,
          };
        }),
        fill: true,
        borderColor: colors.profiling_chart_system_cpu_border,
        backgroundColor: colors.profiling_chart_system_cpu_background,
      },
      {
        label: `${appProfilingLogs.device_info.app_package} %`,
        data: appProfilingLogs.profiling_logs.map((v: any) => {
          return {
            timestamp: v.timestamp,
            cpu: v.cpu,
          };
        }),
        fill: true,
        borderColor: colors.profiling_chart_app_cpu_border,
        backgroundColor: colors.profiling_chart_app_cpu_background,
      },
    ],
  };
}

/* Memory usage data */
function getMemoryUsageChartOptions(appProfilingLogs: IAppProfilingLogs) {
  const totalMemoryInMB = toMegaByte(appProfilingLogs.device_info.total_memory);
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

function getMemoryChartData(appProfilingLogs: IAppProfilingLogs) {
  return {
    datasets: [
      {
        label: 'Total Memory Usage (MB)',
        data: appProfilingLogs.profiling_logs.map((data) => {
          return {
            timestamp: data.timestamp,
            memory: Math.ceil(Number(data.total_memory_used) / 1024),
          };
        }),
        fill: true,
        borderColor: colors.profiling_chart_system_memory_border,
        backgroundColor: colors.profiling_chart_system_memory_background,
      },
      {
        label: `${appProfilingLogs.device_info.app_package} (MB)`,
        data: appProfilingLogs.profiling_logs.map((data) => {
          return {
            timestamp: data.timestamp,
            memory: toMegaByte(data.memory),
          };
        }),
        fill: true,
        borderColor: colors.profiling_chart_app_memory_border,
        backgroundColor: colors.profiling_chart_app_memory_background,
      },
    ],
  };
}

function useProfiling(session: ISession, appProfiling: IAppProfilingLogs): IAppProfilingLogs {
  const processedData = appProfiling.profiling_logs.map((data: any) => {
    return {
      ...data,
      timestamp: getTimeDiffInSecs(new Date(session.createdAt), new Date(data.timestamp)) + 's',
    };
  });
  return {
    device_info: appProfiling.device_info,
    profiling_logs: _.uniqBy(processedData, 'timestamp'),
  };
}

export default function AppProfiling(props: {
  session: ISession;
  appProfilingLogs: IAppProfilingLogs;
}) {
  const { appProfilingLogs, session } = props;

  const processedData = useProfiling(session, appProfilingLogs);
  return (
    <div className="app-profiling-container">
      <div className="chart-row">
        <Line
          options={getCpuChartOptions(processedData)}
          data={getCpuChartData(processedData)}
        ></Line>
      </div>
      <div className="chart-row">
        <Line
          options={getMemoryUsageChartOptions(processedData)}
          data={getMemoryChartData(processedData)}
        ></Line>
      </div>
    </div>
  );
}
