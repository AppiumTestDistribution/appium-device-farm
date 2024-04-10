export interface IAppProfilingLogs {
  device_info: {
    total_cpu: number;
    total_memory: string;
    api_level: number;
    app_package: string;
  };
  profiling_logs: {
    timestamp: string;
    cpu: string;
    memory: string;
    total_cpu_used: string;
    total_memory_used: string;
  }[];
}
