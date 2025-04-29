import generateApiKey from 'generate-api-key';
import { getUserFromToken } from '../auth/middleware/auth.middleware';
import { userService } from '../auth/services/user.service';
import { apiTokenService, ApiTokenService } from '../auth/services/api-token.service';
import debugLog from '../debugLog';

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

export async function getUserFromCapabilities(capabilities: Record<string, any>) {
  debugLog(`Capabilities: ${JSON.stringify(capabilities['df:jwt'])}`);
  if (capabilities['df:jwt']) {
    const token = capabilities['df:jwt'];
    return await getUserFromToken(token);
  } else if (capabilities['df:username'] && capabilities['df:password']) {
    const user = await userService.getUserByAccessKey(capabilities['df:username']);
    if (user && !user.isActive) {
      throw new Error('User is not active');
    }
    if (user && user.id) {
      const token = await apiTokenService.isTokenValid(user.id, capabilities['df:password']);
      if (token) {
        return user;
      }
    }
    throw new Error('Invalid credentials');
  } else {
    throw new Error('Credentials not found. Please provide username and password');
  }
}

export async function sanitizeSessionCapabilities(sessionResponse: Record<string, any>) {
  ['df:jwt', 'df:username', 'df:password'].forEach((key) => {
    delete sessionResponse[key];
    if (sessionResponse['desired']) {
      delete sessionResponse['desired'][key];
    }
  });
  return sessionResponse;
}
