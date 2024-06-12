import fs from 'fs';
import { config } from '../config';
import { executeCmd } from './initialize-database';

async function main() {
  if (fs.existsSync(config.cacheDir)) {
    fs.rmdirSync(config.cacheDir, { recursive: true });
  }
  fs.mkdirSync(config.cacheDir, { recursive: true });

  executeCmd('npm run run-db-migration');
}

(async () => await main())();
