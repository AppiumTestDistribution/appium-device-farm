import { AppState } from '../..';
import { ReduxActionType } from '../../../interfaces/redux';
import createReducer from '../../../utils/createReducer';
import ReduxActionTypes from '../../redux-action-types';

export type LoadersState = {
  delete: {
    isPending: boolean;
    response: Record<string, string> | null;
  };
  state: {
    isPending: boolean;
    response: Record<string, string> | null;
  };
  script: {
    isPending: boolean;
    response: Record<string, any> | null;
  };
};

const initialState: LoadersState = {
  delete: {
    isPending: false,
    response: null,
  },
  state: {
    isPending: false,
    response: null,
  },
  script: {
    isPending: false,
    response: null,
  },
};

export default createReducer(initialState, {
  [ReduxActionTypes.DELETE_SESSION]: (state: AppState) => ({
    ...state,
    delete: {
      isPending: true,
    },
  }),
  [ReduxActionTypes.SESSION_DELETE_FINISH]: (
    state: AppState,
    action: ReduxActionType<Record<string, string>>
  ) => ({
    ...state,
    delete: {
      isPending: false,
      response: action.payload,
    },
  }),
  [ReduxActionTypes.PAUSE_SESSION]: (state: AppState) => ({
    ...state,
    state: {
      isPending: true,
    },
  }),
  [ReduxActionTypes.RESUME_SESSION]: (state: AppState) => ({
    ...state,
    state: {
      isPending: true,
    },
  }),
  [ReduxActionTypes.RESET_SCRIPT_RESPONSE_FOR_SESSION]: (state: AppState) => ({
    ...state,
    script: {
      isPending: false,
      response: null,
    },
  }),
  [ReduxActionTypes.RUN_SCRIPT_FOR_SESSION]: (state: AppState) => ({
    ...state,
    script: {
      isPending: true,
    },
  }),
  [ReduxActionTypes.RUN_SCRIPT_FOR_SESSION_FINISH]: (
    state: AppState,
    action: ReduxActionType<Record<string, string | boolean>>
  ) => ({
    ...state,
    script: {
      isPending: false,
      response: action.payload,
    },
  }),
  [ReduxActionTypes.SESSION_STATE_CHANGE_FINISH]: (
    state: AppState,
    action: ReduxActionType<Record<string, string | boolean>>
  ) => ({
    ...state,
    state: {
      isPending: false,
      response: action.payload,
    },
  }),
});
