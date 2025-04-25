import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import log from '../../logger';

/**
 * Authentication controller
 */
export class AuthController {
  /**
   * Register a new user (admin only)
   */
  async register(req: Request, res: Response) {
    try {
      const { username, password, role, firstname, lastname } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const user = await userService.createUser({
        username,
        password,
        role,
        firstname,
        lastname,
      });

      return res.status(201).json(user);
    } catch (error: any) {
      log.error(`Error registering user: ${error}`);
      return res.status(400).json({ message: error.message || 'Error registering user' });
    }
  }

  /**
   * Login user
   */
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      const result = await userService.login(username, password);

      return res.status(200).json(result);
    } catch (error) {
      log.error(`Error logging in: ${error}`);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = await userService.getUserById(req.user.userId);

      return res.status(200).json(user);
    } catch (error: any) {
      log.error(`Error getting current user: ${error}`);
      return res.status(400).json({ message: error.message || 'Error getting current user' });
    }
  }

  /**
   * Change password
   */
  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Current password and new password are required' });
      }

      await userService.changePassword(req.user.userId, currentPassword, newPassword);

      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error: any) {
      log.error(`Error changing password: ${error}`);
      return res.status(400).json({ message: error.message || 'Error changing password' });
    }
  }
}

export const authController = new AuthController();
