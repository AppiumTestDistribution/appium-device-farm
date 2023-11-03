import { ReduxActionType } from '../../../interfaces/redux';
import createReducer from '../../../utils/createReducer';
import ReduxActionTypes from '../../redux-action-types';

export type SessionFilterType = {
  name: string;
  os: Array<string>;
  status: Array<string>;
  device_udid: string;
};

export type FilterState = {
  session: SessionFilterType;
};

const initialState: FilterState = {
  session: {
    name: '',
    os: [],
    status: [],
    device_udid: '',
  },
};

export default createReducer(initialState, {
  [ReduxActionTypes.SET_SESSION_FILTER]: (
    state: FilterState,
    action: ReduxActionType<SessionFilterType>
  ) => ({
    ...state,
    session: action.payload,
  }),
});
