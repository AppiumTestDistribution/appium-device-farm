import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import log from '../../logger';

// JWT secret key - should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'device-farm-secret-key';

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

/**
 * Authentication middleware to verify JWT tokens
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization token provided' });
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Invalid authorization format' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Add user info to request object
    (req as AuthenticatedRequest).user = decoded;

    next();
  } catch (error) {
    log.error(`Authentication error: ${error}`);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

/**
 * Role-based authorization middleware
 * @param roles Array of allowed roles
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
