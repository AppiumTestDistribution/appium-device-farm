import generateApiKey from 'generate-api-key';
import { getUserFromToken, JWT_SECRET, JWT_EXPIRES_IN } from '../auth/middleware/auth.middleware';
import { userService } from '../auth/services/user.service';
import { apiTokenService, ApiTokenService } from '../auth/services/api-token.service';
import debugLog from '../debugLog';
import { prisma } from '../prisma';
import { SignOptions } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const KEY_POOL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRSTUVWXYZ1234567890';

export function generateAccessKey(prefix: string) {
  const accessKeyPrefix = `${prefix}`.substring(0, 12) + '_';

  const randomKey = generateApiKey({
    method: 'string',
    length: 20 - accessKeyPrefix.length,
    pool: KEY_POOL,
  });
  return `${accessKeyPrefix}${randomKey}`;
}

export function generateSecretKey() {
  const secretKey = generateApiKey({
    method: 'string',
    min: 25,
    max: 30,
    pool: KEY_POOL,
  });

  return secretKey;
}

export async function authenticateUserWithAccessKey(accessKey: string, secretToken: string) {
  const user = await userService.getUserByAccessKey(accessKey);
  if (user && !user.isActive) {
    throw new Error('User is not active');
  }
  if (user && user.id) {
    const token = await apiTokenService.isTokenValid(user.id, secretToken);
    if (token) {
      return user;
    }
  }
  throw new Error('Invalid credentials');
}

export async function getUserFromCapabilities(
  capabilities: Record<string, any>,
): Promise<Omit<User, 'password'>> {
  debugLog(`Capabilities: ${JSON.stringify(capabilities['df:jwt'])}`);
  if (capabilities['df:jwt']) {
    const token = capabilities['df:jwt'];
    return await getUserFromToken(token);
  } else if (capabilities['df:accesskey'] && capabilities['df:token']) {
    return await authenticateUserWithAccessKey(
      capabilities['df:accesskey'],
      capabilities['df:token'],
    );
  } else {
    throw new Error('Credentials not found. Please provide username and password');
  }
}

export async function sanitizeSessionCapabilities(sessionResponse: Record<string, any>) {
  ['df:jwt', 'df:accesskey', 'df:token'].forEach((key) => {
    delete sessionResponse[key];
    if (sessionResponse['desired']) {
      delete sessionResponse['desired'][key];
    }
  });
  return sessionResponse;
}

export async function generateTokenForNode(nodeId: string, userId: string) {
  const node = await prisma.node.findFirst({
    where: {
      id: nodeId,
    },
  });
  if (node && node.jwtSecretToken) {
    return jwt.sign({ userId }, node.jwtSecretToken, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
  }
  return '';
}

export async function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
