import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import log from '../../logger';

/**
 * User controller
 */
export class UserController {
  /**
   * Get all users (admin only)
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      log.error(`Error getting users: ${error}`);
      return res.status(400).json({ message: error.message || 'Error getting users' });
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      const user = await userService.getUserById(id);
      return res.status(200).json(user);
    } catch (error: any) {
      log.error(`Error getting user: ${error}`);
      return res.status(400).json({ message: error.message || 'Error getting user' });
    }
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
      }

      // Prevent deleting the authenticated user
      const authReq = req as AuthenticatedRequest;
      if (authReq.user && authReq.user.userId === id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      await userService.deleteUser(id);
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error: any) {
      log.error(`Error deleting user: ${error}`);
      return res.status(400).json({ message: error.message || 'Error deleting user' });
    }
  }
}

export const userController = new UserController();
