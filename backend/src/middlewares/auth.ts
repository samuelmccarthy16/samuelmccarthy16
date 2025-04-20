import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/User';
import {getRepository} from "typeorm";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).userId = (decoded as any).userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authorize = (requiredRole: 'user' | 'staff' | 'admin') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    try {
      // Verifying JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

      // Searching for a user in DB
      const userRepository = getRepository(User);
      const user = await userRepository.findOneBy({ id: decoded.userId });

      if (!user) {
        res.status(401).json({ message: 'User not found' });
        return;
      }

      // Checking a user role
      if (user.role !== requiredRole && user.role !== 'admin') {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        return;
      }

      (req as any).user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
