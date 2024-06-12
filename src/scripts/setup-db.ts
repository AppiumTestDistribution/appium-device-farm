import { executeCmd } from './initialize-database';

async function main() {
  executeCmd('npm run run-db-migration');
}

(async () => await main())();
