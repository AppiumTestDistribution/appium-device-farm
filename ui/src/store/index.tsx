import { applyMiddleware } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from '@redux-devtools/extension';
import initSaga from './sagas';
import rootReducer from './reducers/root-reducer';
import { EntitiesState } from './reducers/entities';
import { UIState } from './reducers/ui';

const sagaMiddleware = createSagaMiddleware();
export default configureStore({
  reducer: rootReducer,
  enhancers: [applyMiddleware(sagaMiddleware)],
});

sagaMiddleware.run(initSaga);

export type AppState = {
  entities: EntitiesState;
  ui: UIState;
};
