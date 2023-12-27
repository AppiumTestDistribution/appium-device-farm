import { execSync } from 'node:child_process';
import { config } from '../config';
import * as fs from 'fs';

async function main() {
  if (!fs.existsSync(config.cacheDir)) {
    fs.mkdirSync(config.cacheDir, { recursive: true });
  }
  execSync(`prisma migrate dev ${process.argv.slice(2)}`, {
    env: {
      ...process.env,
      DATABASE_URL: `file:${config.databasePath}`,
    },
    stdio: 'inherit',
  });
}

(async () => await main())();
