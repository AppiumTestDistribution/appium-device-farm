import { execSync } from 'node:child_process';
import { config } from '../config';

async function main() {
  const env = {
    ...process.env,
    DATABASE_URL: `file:${config.databasePath}`,
  };
  execSync('prisma migrate deploy && prisma generate', {
    env,
    stdio: 'inherit',
  });
}

(async () => await main())();
