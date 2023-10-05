import { execSync } from 'node:child_process';
import { config } from '../config';

async function main() {
  const env = {
    ...process.env,
    DATABASE_URL: `file:${config.databasePath}`,
  };
  execSync('npm run run-db-migration', {
    env,
    stdio: 'inherit',
  });
}

(async () => await main())();
