import { useLocation } from 'react-router-dom';

const TITLE_BY_PATH: Array<[RegExp, string]> = [
  [/^\/(device-farm)?\/?$/, 'Devices'],
  [/^\/builds(\/|$)/, 'Builds'],
  [/^\/device-farm\/builds(\/|$)/, 'Builds'],
  [/^\/apps(\/|$)/, 'Apps'],
  [/^\/stats(\/|$)/, 'Stats'],
  [/^\/servers(\/|$)/, 'Servers'],
  [/^\/admin(\/|$)/, 'Admin'],
  [/^\/users(\/|$)/, 'Users'],
  [/^\/teams(\/|$)/, 'Teams'],
  [/^\/devices(\/|$)/, 'Device administration'],
  [/^\/profile(\/|$)/, 'Profile'],
];

export function useCurrentPageTitle(): string {
  const { pathname } = useLocation();
  for (const [pattern, title] of TITLE_BY_PATH) {
    if (pattern.test(pathname)) return title;
  }
  return 'Falx';
}
