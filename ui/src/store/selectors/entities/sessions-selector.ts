import { AppState } from '../..';

export const getSessions = (state: AppState) => state.entities.sessions.items;

export const getIsSessionsLoading = (state: AppState) => state.entities.sessions.isLoading;

export const getSelectedSession = (state: AppState) => state.ui.selected.session;

export const isSessionDeleting = (state: AppState) => state.ui.loaders.delete.isPending;

export const getSessionDeleteResponse = (state: AppState) => state.ui.loaders.delete.response;

export const isStateChangePending = (state: AppState) => state.ui.loaders.state.isPending;

export const getSessionStateChangeResponse = (state: AppState) => state.ui.loaders.state.response;

export const isDriverScriptExecutionPending = (state: AppState) =>
  state.ui.loaders.script.isPending;

export const getDriverScriptResult = (state: AppState) => state.ui.loaders.script.response;
