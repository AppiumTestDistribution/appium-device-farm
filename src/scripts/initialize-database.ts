import { execSync } from 'node:child_process';
import { config } from '../config';

const env = {
  ...process.env,
  DATABASE_URL: `file:${config.databasePath}`,
};

function executeCmd(cmd: string) {
  execSync(cmd, {
    env,
    stdio: 'inherit',
  });
}

async function main() {
  console.log('Deploying the database migrations');
  executeCmd('prisma migrate deploy');

  console.log('Generating prims client');
  executeCmd('prisma generate');
}

(async () => await main())();
