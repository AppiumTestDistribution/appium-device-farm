import { put } from 'redux-saga/effects';
import ReduxActionTypes from '../redux-action-types';

export default function* () {
  yield put({
    type: ReduxActionTypes.INIT_SESSION_SAGA,
  });
  yield put({
    type: ReduxActionTypes.POLLING_INIT,
  });
}
