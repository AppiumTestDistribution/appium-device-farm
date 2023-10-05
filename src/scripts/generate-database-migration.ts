import { execSync } from 'node:child_process';
import { config } from '../config';

async function main() {
  execSync('prisma migrate dev', {
    env: {
      ...process.env,
      DATABASE_URL: `file:${config.databasePath}`,
    },
    stdio: 'inherit',
  });
}

(async () => await main())();
