import { PaginatedResponse } from '../../interfaces/api';
import { ReduxActionType } from '../../interfaces/redux';
import Session from '../../interfaces/session';
import ReduxActionTypes from '../redux-action-types';

export const fetchSessionInit = (payload?: any) => ({
  type: ReduxActionTypes.FETCH_SESSIONS_INIT,
  payload,
});

export const fetchSessionsSuccess = (payload: PaginatedResponse<Session>) => ({
  type: ReduxActionTypes.FETCH_SESSIONS_SUCCESS,
  payload,
});

export const fetchSessionSuccess = (payload: Session) => ({
  type: ReduxActionTypes.FETCH_SESSION_SUCCESS,
  payload,
});

export const setSelectedSession = (payload: Session | null) => ({
  type: ReduxActionTypes.SELECT_SESSION,
  payload,
});

export const fetchSessionTextLogs = (payload: string): ReduxActionType<string> => ({
  type: ReduxActionTypes.FETCH_SESSION_TEXT_LOG,
  payload,
});

export const fetchSessionTextLogsSuccess = (payload: any) => ({
  type: ReduxActionTypes.FETCH_SESSION_TEXT_LOG_SUCCESS,
  payload,
});

export const fetchSessionDeviceLogs = (payload: any) => ({
  type: ReduxActionTypes.FETCH_SESSION_DEVICE_LOG,
  payload,
});

export const fetchSessionDeviceLogsSuccess = (payload: any) => ({
  type: ReduxActionTypes.FETCH_SESSION_DEVICE_LOG_SUCCESS,
  payload,
});

export const fetchSessionDebugLogs = (payload: any) => ({
  type: ReduxActionTypes.FETCH_SESSION_DEBUG_LOG,
  payload,
});

export const fetchSessionDebugLogsSuccess = (payload: any) => ({
  type: ReduxActionTypes.FETCH_SESSION_DEBUG_LOG_SUCCESS,
  payload,
});

export const fetchSessionHttpLogs = (payload: any) => ({
  type: ReduxActionTypes.FETCH_SESSION_HTTP_LOG,
  payload,
});

export const fetchSessionHttpLogsSuccess = (payload: any) => ({
  type: ReduxActionTypes.FETCH_SESSION_HTTP_LOG_SUCCESS,
  payload,
});

export const fetchSessionProfilingData = (payload: any) => ({
  type: ReduxActionTypes.FETCH_SESSION_PROFILING_DATA,
  payload,
});

export const fetchSessionProfilingDataSuccess = (payload: any) => ({
  type: ReduxActionTypes.FETCH_SESSION_PROFILING_DATA_SUCCESS,
  payload,
});

export const setSessionFilter = (payload: any) => ({
  type: ReduxActionTypes.SET_SESSION_FILTER,
  payload,
});

export const deleteSession = (payload: string) => ({
  type: ReduxActionTypes.DELETE_SESSION,
  payload,
});

export const deleteAllSession = () => ({
  type: ReduxActionTypes.DELETE_ALL_SESSION,
});

export const deleteSessionFinish = (payload: any) => ({
  type: ReduxActionTypes.SESSION_DELETE_FINISH,
  payload,
});

export const pauseSession = (payload: string) => ({
  type: ReduxActionTypes.PAUSE_SESSION,
  payload,
});

export const resumeSession = (payload: string) => ({
  type: ReduxActionTypes.RESUME_SESSION,
  payload,
});

export const sessionStateChangeFinish = (payload: any) => ({
  type: ReduxActionTypes.SESSION_STATE_CHANGE_FINISH,
  payload,
});

export const runDriverScript = (payload: any) => ({
  type: ReduxActionTypes.RUN_SCRIPT_FOR_SESSION,
  payload,
});

export const sessionScriptExecutionFinish = (payload: any) => ({
  type: ReduxActionTypes.RUN_SCRIPT_FOR_SESSION_FINISH,
  payload,
});

export const sessionScriptExecutionReset = (payload: any) => ({
  type: ReduxActionTypes.RESET_SCRIPT_RESPONSE_FOR_SESSION,
  payload,
});
