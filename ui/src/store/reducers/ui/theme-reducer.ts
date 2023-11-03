import createReducer from '../../../utils/createReducer';
import themes, { ThemeConfig, DEFAULT_THEME } from '../../../constants/themes';

export type ThemeState = {
  name: string;
  config: ThemeConfig;
};

const initialState: ThemeState = {
  name: DEFAULT_THEME,
  config: themes[DEFAULT_THEME],
};

export default createReducer(initialState, {});
