import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { UserService } from '../services/UserService';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_secret_key';

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {}

  public getUsers = async (req: Request, res: Response): Promise<void> => {
    const users = await this.userService.getUsers();
    res.json(users);
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const user = await this.userService.getUserById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  };

  // public createUser = async (req: Request, res: Response): Promise<void> => {
  //   const user = req.body;
  //   await this.userService.createUser(user);
  //   res.status(201).send('User created');
  // };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    const user = req.body;
    await this.userService.updateUser(id, user);
    res.send('User updated');
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    await this.userService.deleteUser(id);
    res.send('User deleted');
  };

  public login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.userService.findByEmail(email);
    if (!user) return res.status(400).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password_hash!);
    if (!validPassword) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: user.id, email: user.email }, secret);
    res.json({ token });
  };

  public register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.createUser({ name, email, password_hash: hashedPassword });
    res.status(201).send('User registered');
  };
}