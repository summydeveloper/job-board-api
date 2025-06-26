import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User, { IUser } from '../models/user.model';
 
interface AuthenticatedRequest extends Request {
  user?: Partial<IUser> & { id: string };  
}

 
export const authenticate = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      const user = await User.findById(decoded.id).select('-password').lean().exec();
      if (!user) {
        res.status(401).json({ error: 'Unauthorized: User not found' });
        return;
      }

      // Since `.lean()` returns a plain object, you need to manually attach `id`
      req.user = {
        ...user,
        id: user._id.toString(), // ensure `id` is accessible later
      };

      next();
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized: Token invalid' });
    }
  }
);

 
export const authorizeRoles =
  (...roles: string[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role as string)) {
      res.status(403).json({ error: 'Forbidden: Access denied' });
      return;
    }
    next();
  };

