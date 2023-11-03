import { ListEntityType } from '.';
import { PaginatedResponse } from '../../../interfaces/api';
import { ReduxActionType } from '../../../interfaces/redux';
import Session from '../../../interfaces/session';
import createReducer from '../../../utils/createReducer';
import ReduxActionTypes from '../../redux-action-types';

export type SessionEntityType = ListEntityType<Session>;

const initialState: SessionEntityType = {
  count: 0,
  items: [],
  isLoading: false,
};

export default createReducer(initialState, {
  [ReduxActionTypes.FETCH_SESSIONS_INIT]: (state: SessionEntityType) => ({
    ...state,
    isLoading: true,
  }),
  [ReduxActionTypes.FETCH_SESSIONS_SUCCESS]: (
    state: SessionEntityType,
    action: ReduxActionType<PaginatedResponse<Session>>
  ) => ({
    ...state,
    count: action.payload?.count,
    items: action.payload?.rows,
    isLoading: false,
  }),
});
