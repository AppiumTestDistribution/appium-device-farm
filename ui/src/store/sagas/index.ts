import { all, takeLatest } from 'redux-saga/effects';
import ReduxActionTypes from '../redux-action-types';
import ApplicationSaga from './application-saga';
import PollingSaga from './polling-saga';
import SessionSaga from './session-saga';

export default function* initSaga() {
  yield all([
    takeLatest(ReduxActionTypes.INIT_APP, ApplicationSaga),
    takeLatest(ReduxActionTypes.INIT_SESSION_SAGA, SessionSaga),
    takeLatest(ReduxActionTypes.POLLING_INIT, PollingSaga),
  ]);
}
