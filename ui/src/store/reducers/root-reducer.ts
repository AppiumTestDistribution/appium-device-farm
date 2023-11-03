import { combineReducers } from '@reduxjs/toolkit';
import EntitiesReducer from './entities';
import UiReducer from './ui';

export default combineReducers({
  entities: EntitiesReducer,
  ui: UiReducer,
});
