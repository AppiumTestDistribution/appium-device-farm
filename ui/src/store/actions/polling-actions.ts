import { ReduxActionType } from '../../interfaces/redux';
import ReduxActionTypes from '../redux-action-types';

export const addPollingTask = (payload: ReduxActionType<any>) => ({
  type: ReduxActionTypes.ADD_POLLING_TASK,
  payload,
});

export const removePollingTask = (payload: ReduxActionType<any>) => ({
  type: ReduxActionTypes.REMOVE_POLLING_TASK,
  payload,
});
