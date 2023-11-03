import { combineReducers } from '@reduxjs/toolkit';
import SessionsReducer, { SessionEntityType } from './sessions-reducer';
import LogsReducer, { LogsState } from './logs-reducer';

export type ListEntityType<T> = {
  count: number;
  items: Array<T>;
  isLoading: boolean;
};

export type EntitiesState = {
  sessions: SessionEntityType;
  logs: LogsState;
};

export default combineReducers({
  sessions: SessionsReducer,
  logs: LogsReducer,
});
