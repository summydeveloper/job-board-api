import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface JwtPayload {
  id: string;
  role: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Register hit, body:', req.body);
    const { name, email, password, role } = req.body;

    const user = await User.create({ name, email, password, role });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET as string
    );

    res.status(201).json({
      user: { name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET as string
    );

    res.status(200).json({
      user: { name: user.name, role: user.role },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
