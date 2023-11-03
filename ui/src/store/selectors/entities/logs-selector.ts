import { AppState } from '../..';

export const getTextLogs = (state: AppState) => state.entities.logs.text.items;

export const getisTextLogsLoading = (state: AppState) => state.entities.logs.text.isLoading;

export const getDeviceLogs = (state: AppState) => state.entities.logs.device.items;

export const getisDeviceLogsLoading = (state: AppState) => state.entities.logs.device.isLoading;

export const getDebugLogs = (state: AppState) => state.entities.logs.debug.items;

export const getisDebugLogsLoading = (state: AppState) => state.entities.logs.debug.isLoading;

export const getHttpLogs = (state: AppState) => state.entities.logs.http.items;

export const getisHttpLogsLoading = (state: AppState) => state.entities.logs.http.isLoading;

export const getProfilingdata = (state: AppState) => state.entities.logs.profiling.items;

export const getisProfilingLoading = (state: AppState) => state.entities.logs.profiling.isLoading;
