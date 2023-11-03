import { all, put, takeEvery, takeLatest } from 'redux-saga/effects';
import SessionApi from '../../api/sessions';
import { ApiResponse, PaginatedResponse } from '../../interfaces/api';
import { ReduxActionType } from '../../interfaces/redux';
import Session from '../../interfaces/session';
import {
  fetchSessionSuccess,
  fetchSessionTextLogsSuccess,
  fetchSessionDeviceLogsSuccess,
  fetchSessionDebugLogsSuccess,
  deleteSessionFinish,
  sessionStateChangeFinish,
  fetchSessionProfilingDataSuccess,
  fetchSessionHttpLogsSuccess,
  sessionScriptExecutionFinish,
} from '../actions/session-actions';
import ReduxActionTypes from '../redux-action-types';
import { omitBy } from 'lodash';

function* fetchSessions(action?: ReduxActionType<Record<string, string>>) {
  const payload = omitBy(action?.payload, (d) => !d);
  const sessions: ApiResponse<PaginatedResponse<Session>> = yield SessionApi.getAllSessions(
    payload
  );
  if (sessions.success) {
    yield put(
      fetchSessionSuccess({
        count: sessions.result.count,
        rows: sessions.result.rows,
      })
    );
  }
}

function* fetchSession(action: ReduxActionType<string>) {
  if (action.payload) {
    const sessions: ApiResponse<Session> = yield SessionApi.getSessionById(action.payload);
    if (sessions.success) {
      yield put(fetchSessionSuccess(sessions.result));
    }
  }
}

function* fetchSessionTextLog(action: ReduxActionType<string>) {
  if (action.payload) {
    const logs: ApiResponse<any> = yield SessionApi.getTextLogsForSession(action.payload);
    if (logs.success) {
      yield put(fetchSessionTextLogsSuccess(logs.result));
    }
  }
}

function* fetchSessionDeviceLog(action: ReduxActionType<string>) {
  if (action.payload) {
    const logs: ApiResponse<any> = yield SessionApi.getDeviceLogsForSession(action.payload);
    if (logs.success) {
      yield put(fetchSessionDeviceLogsSuccess(logs.result));
    }
  }
}

function* fetchSessionDebugLog(action: ReduxActionType<string>) {
  if (action.payload) {
    const logs: ApiResponse<any> = yield SessionApi.getDebugLogsForSession(action.payload);
    if (logs.success) {
      yield put(fetchSessionDebugLogsSuccess(logs.result));
    }
  }
}

function* fetchSessionHttpLog(action: ReduxActionType<string>) {
  if (action.payload) {
    const logs: ApiResponse<any> = yield SessionApi.getHttpLogsForSession(action.payload);
    if (logs.success) {
      yield put(fetchSessionHttpLogsSuccess(logs.result));
    }
  }
}

function* deleteSession(action: ReduxActionType<string>) {
  if (action.payload) {
    const response: ApiResponse<any> = yield SessionApi.deleteSessionById(action.payload);
    yield put(deleteSessionFinish(response));
  }
}

function* deleteAllSession() {
  const response: ApiResponse<any> = yield SessionApi.deleteAllSessions();
  yield put(deleteSessionFinish(response));
}

function* pauseSession(action: ReduxActionType<string>) {
  if (action.payload) {
    const response: ApiResponse<any> = yield SessionApi.pauseSession(action.payload);
    yield put(sessionStateChangeFinish(response));
  }
}

function* resumeSession(action: ReduxActionType<string>) {
  if (action.payload) {
    const response: ApiResponse<any> = yield SessionApi.resumeSession(action.payload);
    yield put(sessionStateChangeFinish(response));
  }
}

function* fetchSessionProfileData(action: ReduxActionType<string>) {
  if (action.payload) {
    const response: ApiResponse<any> = yield SessionApi.getAppProfilingForSession(action.payload);
    yield put(
      fetchSessionProfilingDataSuccess({
        count: response.result.length,
        rows: response.result,
      })
    );
  }
}

function* runDriverScript(
  action: ReduxActionType<{
    sessionId: string;
    script: string;
    timeoutMs?: number;
  }>
) {
  if (action.payload) {
    const response: ApiResponse<any> = yield SessionApi.runDriverScript(action.payload);
    yield put(sessionScriptExecutionFinish(response.result));
  }
}

export default function* () {
  yield all([
    takeEvery(ReduxActionTypes.FETCH_SESSIONS_INIT, fetchSessions),
    takeLatest(ReduxActionTypes.FETCH_SESSION, fetchSession),
    takeLatest(ReduxActionTypes.FETCH_SESSION_TEXT_LOG, fetchSessionTextLog),
    takeLatest(ReduxActionTypes.FETCH_SESSION_DEVICE_LOG, fetchSessionDeviceLog),
    takeLatest(ReduxActionTypes.FETCH_SESSION_DEBUG_LOG, fetchSessionDebugLog),
    takeLatest(ReduxActionTypes.FETCH_SESSION_HTTP_LOG, fetchSessionHttpLog),
    takeLatest(ReduxActionTypes.FETCH_SESSION_PROFILING_DATA, fetchSessionProfileData),
    takeLatest(ReduxActionTypes.DELETE_SESSION, deleteSession),
    takeLatest(ReduxActionTypes.DELETE_ALL_SESSION, deleteAllSession),
    takeLatest(ReduxActionTypes.SET_SESSION_FILTER, fetchSessions),
    takeLatest(ReduxActionTypes.PAUSE_SESSION, pauseSession),
    takeLatest(ReduxActionTypes.RESUME_SESSION, resumeSession),
    takeLatest(ReduxActionTypes.RUN_SCRIPT_FOR_SESSION, runDriverScript),
  ]);
}
