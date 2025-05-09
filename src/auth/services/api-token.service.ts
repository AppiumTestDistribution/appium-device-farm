import { prisma } from '../../prisma';
import { v4 as uuidv4 } from 'uuid';
import { ApiToken } from '@prisma/client';
import log from '../../logger';

export class ApiTokenService {
  /**
   * Create a new API token for a user
   */
  async createApiToken(userId: string, name: string, expiresAt?: Date): Promise<ApiToken> {
    try {
      // Check if token with same name exists for user
      const existingToken = await prisma.apiToken.findFirst({
        where: {
          userId,
          name,
        },
      });

      if (existingToken) {
        throw new Error('Token with this name already exists');
      }

      // Generate a random token
      const token = uuidv4();

      // Create the API token
      const apiToken = await prisma.apiToken.create({
        data: {
          id: uuidv4(),
          name,
          userId,
          token,
          expiresAt,
        },
      });

      return apiToken;
    } catch (error) {
      log.error(`Error creating API token: ${error}`);
      throw error;
    }
  }

  /**
   * Delete an API token
   */
  async deleteApiToken(userId: string, tokenId: string): Promise<void> {
    try {
      // Check if token exists and belongs to user
      const token = await prisma.apiToken.findFirst({
        where: {
          id: tokenId,
          userId,
        },
      });

      if (!token) {
        throw new Error('Token not found');
      }

      // Delete the token
      await prisma.apiToken.delete({
        where: {
          id: tokenId,
        },
      });
    } catch (error) {
      log.error(`Error deleting API token: ${error}`);
      throw error;
    }
  }

  /**
   * List all API tokens for a user
   */
  async listApiTokens(userId: string): Promise<ApiToken[]> {
    try {
      const tokens = await prisma.apiToken.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return tokens;
    } catch (error) {
      log.error(`Error listing API tokens: ${error}`);
      throw error;
    }
  }

  async isTokenValid(userId: string, token: string) {
    const apiToken = await prisma.apiToken.findFirst({
      where: {
        token,
        userId,
      },
    });

    if (!apiToken) {
      throw new Error('Invalid token');
    }

    if (apiToken.expiresAt && new Date(apiToken.expiresAt) < new Date()) {
      throw new Error('Token expired');
    }

    return token;
  }
}

export const apiTokenService = new ApiTokenService();
