import fs from 'fs';
import { config } from '../config';
import { executeCmd } from './initialize-database';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ResetOptions {
  skipTeams?: boolean;
  skipUsers?: boolean;
  skipTokens?: boolean;
  skipDeviceDetails?: boolean;
  skipApps?: boolean;
  skipSessions?: boolean;
}

async function parseCommandLineArgs(): Promise<ResetOptions> {
  const args = process.argv.slice(2);
  const options: ResetOptions = {};

  for (const arg of args) {
    switch (arg) {
      case '--skip-teams':
        options.skipTeams = true;
        break;
      case '--skip-users':
        options.skipUsers = true;
        break;
      case '--skip-tokens':
        options.skipTokens = true;
        break;
      case '--skip-device-details':
        options.skipDeviceDetails = true;
        break;
      case '--skip-apps':
        options.skipApps = true;
        break;
      case '--skip-sessions':
        options.skipSessions = true;
        break;
      case '--help':
        console.log(`
Device Farm Selective Reset Options:
  --skip-teams          Skip clearing teams and team-related data
  --skip-users          Skip clearing users and user accounts
  --skip-tokens         Skip clearing API tokens
  --skip-device-details Skip clearing device details and assignments
  --skip-apps           Skip clearing uploaded applications
  --skip-sessions       Skip clearing test sessions and logs
  --help                Show this help message

Examples:
  appium plugin run device-farm reset --skip-teams --skip-users
  appium plugin run device-farm reset --skip-sessions --skip-apps
        `);
        process.exit(0);
    }
  }

  return options;
}

async function selectiveReset(options: ResetOptions) {
  console.log('Starting selective reset with options:', options);

  try {
    // Clear cache directory (this is always done)
    if (fs.existsSync(config.cacheDir)) {
      fs.rmSync(config.cacheDir, { recursive: true, force: true });
    }
    fs.mkdirSync(config.cacheDir, { recursive: true });

    // Connect to database first
    await prisma.$connect();

    // Check if database exists and has tables, if not initialize it
    try {
      await prisma.$queryRaw`SELECT 1 FROM Session LIMIT 1`;
      console.log('Database exists, proceeding with selective reset...');
    } catch (error) {
      console.log('Database does not exist or is empty, initializing...');
      await prisma.$disconnect();
      executeCmd('npm run run-db-migration');
      await prisma.$connect();
    }

    // Clear sessions and related data (unless skipped)
    if (!options.skipSessions) {
      console.log('Clearing sessions and session logs...');
      await prisma.sessionLog.deleteMany();
      await prisma.testEventJournal.deleteMany();
      await prisma.session.deleteMany();
      await prisma.build.deleteMany();
    }

    // Clear uploaded apps (unless skipped)
    if (!options.skipApps) {
      console.log('Clearing uploaded applications...');
      await prisma.appInformation.deleteMany();
    }

    // Clear device details (unless skipped)
    if (!options.skipDeviceDetails) {
      console.log('Clearing device details and assignments...');
      await prisma.deviceTags.deleteMany();
      await prisma.teamDevice.deleteMany();
      await prisma.device.deleteMany();
    }

    // Clear API tokens (unless skipped)
    if (!options.skipTokens) {
      console.log('Clearing API tokens...');
      await prisma.apiToken.deleteMany();
    }

    // Clear teams and team members (unless skipped)
    if (!options.skipTeams) {
      console.log('Clearing teams and team members...');
      await prisma.teamMember.deleteMany();
      await prisma.team.deleteMany();
    }

    // Clear users (unless skipped)
    if (!options.skipUsers) {
      console.log('Clearing users...');
      await prisma.node.deleteMany(); // Nodes are related to users
      await prisma.user.deleteMany();
    }

    console.log('Selective reset completed successfully!');
  } catch (error) {
    console.error('Error during selective reset:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const options = await parseCommandLineArgs();

  // If no selective options are provided, do a full reset
  const hasSelectiveOptions = Object.values(options).some((value) => value === true);

  if (!hasSelectiveOptions) {
    console.log('No selective options provided, performing full reset...');
    if (fs.existsSync(config.cacheDir)) {
      fs.rmSync(config.cacheDir, { recursive: true, force: true });
    }
    fs.mkdirSync(config.cacheDir, { recursive: true });
    executeCmd('npm run run-db-migration');
  } else {
    console.log('Selective options detected, performing selective reset...');
    await selectiveReset(options);
  }
}

(async () => await main())();
