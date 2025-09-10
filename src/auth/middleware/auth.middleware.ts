import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import log from '../../logger';
import { userService } from '../services/user.service';
import { IPluginArgs } from '../../interfaces/IPluginArgs';
import { authenticateUserWithAccessKey } from '../../utils/auth';
import { v4 as uuidv4 } from 'uuid';
// JWT secret key - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || uuidv4();
// JWT expiration time
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Interface for the JWT payload
export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
}

// Extend Express Request interface to include user information
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const getUserFromToken = async (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
  const { exp } = jwt.decode(token) as jwt.JwtPayload;
  if (!exp || exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Invalid or Expired JWT token');
  }
  const user = await userService.getUserById(decoded.userId);
  return user;
};

/**
 * Authentication middleware to verify JWT tokens
 * Updated for Express v5 compatibility - async errors are automatically handled
 */
export const authMiddleware = (pluginArgs: IPluginArgs) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!pluginArgs.enableAuthentication) {
      const user = await userService.getDefaultUser();
      if (!user) {
        return res.status(401).json({ message: 'No default user found' });
      }
      (req as AuthenticatedRequest).user = {
        userId: user.id,
        username: user.username,
        role: user.role,
      };
      return next();
    }
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    // Express v5 automatically handles async errors, so we can remove try-catch
    const authType = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    console.log(token);
    if (!authType || !token) {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    let user;
    if (authType.toLowerCase() === 'basic') {
      const [username, password] = Buffer.from(token, 'base64').toString().split(':');
      user = await authenticateUserWithAccessKey(username, password);
    } else {
      user = await getUserFromToken(token);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'User is not active' });
    }
    (req as AuthenticatedRequest).user = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    next();
  };
};

/**
 * Role-based authorization middleware
 * @param roles Array of allowed roles
 * Updated for Express v5 compatibility
 */
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(authReq.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

/**
 * Admin-only authorization middleware
 * Updated for Express v5 compatibility
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  if (!authReq.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (authReq.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

export { JWT_SECRET, JWT_EXPIRES_IN };