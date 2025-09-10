import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import log from '../../logger';
import { User } from '@prisma/client';

/**
 * User controller
 */
export class UserController {
  /**
   * Get all users (admin only)
   * Updated for Express v5 - async errors are automatically handled
   */
  async getAllUsers(req: Request, res: Response) {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  }

  /**
   * Get user by ID
   * Updated for Express v5 - async errors are automatically handled
   */
  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await userService.getUserById(id);
    return res.status(200).json(user);
  }

  /**
   * Delete user (admin only)
   * Updated for Express v5 - async errors are automatically handled
   */
  async deleteUser(req: Request, res: Response) {
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
  }

  /**
   * Update user
   * Updated for Express v5 - async errors are automatically handled
   */
  async updateUser(req: Request, res: Response) {
    const currentUser = (req as AuthenticatedRequest).user;
    const { firstname, lastname, role, password } = req.body as User;
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    /**
     * Only admins can update roles, and users can only update their own profile
     */
    if (
      (currentUser?.role !== 'admin' && id !== currentUser?.userId) ||
      (id == currentUser?.userId && !!role)
    ) {
      return res.status(401).json({ message: 'You do not have permission to update the role' });
    }

    await userService.updateUser(id, { firstname, lastname, role, password });
    return res.status(200).json({ message: 'User details updated successfully' });
  }
}

export const userController = new UserController();
