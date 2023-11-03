import { AppState } from '../..';
import { ReduxActionType } from '../../../interfaces/redux';
import Session from '../../../interfaces/session';
import createReducer from '../../../utils/createReducer';
import ReduxActionTypes from '../../redux-action-types';

export type SelectedState = {
  session: Session | null;
};

const initialState: SelectedState = {
  session: null,
};

export default createReducer(initialState, {
  [ReduxActionTypes.SELECT_SESSION]: (state: AppState, action: ReduxActionType<Session>) => ({
    ...state,
    session: action.payload,
  }),
  [ReduxActionTypes.DESELECT_SESSION]: (state: AppState) => ({
    ...state,
    session: null,
  }),
});
