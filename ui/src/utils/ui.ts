import { ThemeConfig } from '../constants/themes';

export const getHeaderStyle = (theme: ThemeConfig) => `
  background: ${theme.colors.primary};
  color: ${theme.colors.greyscale[6]};
`;
