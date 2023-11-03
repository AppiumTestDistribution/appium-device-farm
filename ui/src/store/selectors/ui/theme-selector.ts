import { AppState } from '../..';

export const getSelectedTheme = (state: AppState) => state.ui.theme.config;
