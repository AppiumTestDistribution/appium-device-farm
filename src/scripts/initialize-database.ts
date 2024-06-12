import { execSync } from 'node:child_process';
import { config } from '../config';

const env = {
  ...process.env,
  DATABASE_URL: `file:${config.databasePath}`,
};

export function executeCmd(cmd: string) {
  try {
    execSync(cmd, {
      env,
      stdio: 'inherit',
    });
  } catch (err) {
    console.log('Error initializing database:');
    console.log(err);
  }
}

async function main() {
  console.log('Deploying the database migrations');
  executeCmd('prisma migrate deploy');

  console.log('Generating prisma client');
  executeCmd('prisma generate');
}

if (require.main === module) {
  (async () => await main())();
}

export default main;
