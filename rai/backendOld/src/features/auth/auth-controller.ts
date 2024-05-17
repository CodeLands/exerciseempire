import { Request, Response } from 'express';
import { UserModel } from './user-model';
import axios from 'axios';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, repeatPassword } = req.body as { email: string; password: string, repeatPassword: string };

  if (!email || !password || !repeatPassword) {
    res.status(400).json({ error: 'Invalid input data.' });
    return;
  }

  if (password !== repeatPassword) {
    res.status(400).json({ error: 'Passwords do not match.' });
    return;
  }

  const user = await UserModel.findByEmail(email);
  if (user) {
    res.status(400).json({ error: 'User already exists.' });
    return;
  }

  const newUser = await UserModel.create({ email, password });

  res.json({ id: newUser.id });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ error: 'Invalid input data.' });
    return;
  }

  const user = await UserModel.findByEmail(email);
  if (!user) {
    res.status(400).json({ error: 'User does not exist.' });
    return;
  }

  const match = await bcrypt.compare(password, user.pass_hash);
  if (!match) {
    res.status(400).json({ error: 'Invalid password.' });
    return;
  }

  res.json({ id: user.id });
};