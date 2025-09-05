import fs from 'fs';
import { config } from '../config';
import { executeCmd } from './initialize-database';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function selectiveReset() {
  console.log('Starting selective reset to clear only sessions...');

  try {
    // Connect to database first to check if it exists
    await prisma.$connect();

    // Check if database exists and has tables
    try {
      await prisma.$queryRaw`SELECT 1 FROM Session LIMIT 1`;
      console.log('Database exists, proceeding with selective reset...');

      // For selective reset, we don't clear the entire cache directory
      // as it contains the database we want to preserve
      // We only clear non-database files if needed
    } catch (error) {
      console.log(
        'Database does not exist or is empty. Cannot perform selective reset on empty database.',
      );
      console.log(
        'Please run the full reset command first to initialize the database, then create your teams/users.',
      );
      await prisma.$disconnect();
      process.exit(1);
    }

    // Clear only sessions and related data
    console.log('Clearing sessions and session logs...');
    await prisma.sessionLog.deleteMany();
    await prisma.testEventJournal.deleteMany();
    await prisma.session.deleteMany();
    await prisma.build.deleteMany();

    // Preserve: everything else (teams, users, tokens, device details, apps)
    console.log('Preserving teams, users, tokens, device details, and apps...');

    console.log('Selective reset completed successfully!');
  } catch (error) {
    console.error('Error during selective reset:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

(async () => await selectiveReset())();
