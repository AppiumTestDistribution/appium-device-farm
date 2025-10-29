export type Config = {
  cacheDir: string;
  databasePath: string;
  sessionAssetsPath: string;
  takeScreenshotsFor: Array<string>;
  appsPath: string;
  serverMetadata: {
    id: string;
  };
  goIOSTunnelInfoPort: number;
};
