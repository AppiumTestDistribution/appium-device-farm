import { Response } from 'express';
import { ApiTokenService } from '../services/api-token.service';
import { JwtPayload, AuthenticatedRequest } from '../middleware/auth.middleware';

const apiTokenService = new ApiTokenService();

export class ApiTokenController {
  /**
   * Create a new API token
   */
  async createApiToken(req: AuthenticatedRequest, res: Response) {
    try {
      const { name, expiresAt } = req.body;
      const user = req.user as JwtPayload;

      if (!name) {
        return res.status(400).json({ error: 'Token name is required' });
      }

      const apiToken = await apiTokenService.createApiToken(
        user.userId,
        name,
        expiresAt ? new Date(expiresAt) : undefined,
      );

      return res.status(201).json(apiToken);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * Delete an API token
   */
  async deleteApiToken(req: AuthenticatedRequest, res: Response) {
    try {
      const { tokenId } = req.params;
      const user = req.user as JwtPayload;

      await apiTokenService.deleteApiToken(user.userId, tokenId);

      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  /**
   * List all API tokens for the current user
   */
  async listApiTokens(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user as JwtPayload;
      const tokens = await apiTokenService.listApiTokens(user.userId);

      return res.status(200).json(tokens);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
