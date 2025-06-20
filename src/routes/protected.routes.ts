import express, { Request, Response } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

// Extend Express Request to include user property
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const router = express.Router();

router.get(
  '/dashboard',
  authenticate,
  authorizeRoles('employer'),
  (req: AuthenticatedRequest, res: Response) => {
    res.json({ message: `Welcome, ${req.user?.role} ${req.user?.id}` });
  }
);

export default router;
