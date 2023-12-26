import { PrismaClient } from '@prisma/client';
import { config } from './config';
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${config.databasePath}`,
    },
  },
});
