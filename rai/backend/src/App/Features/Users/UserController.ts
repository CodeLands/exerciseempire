import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { TYPES } from '/Shared/Types';
import { UserRepository } from '/App/Repositories/UserRepository';

@injectable()
export class UserController {
  @inject(TYPES.UserRepository)
  private readonly userRepository!: UserRepository;

  public getAllUsers = async (req: Request, res: Response) => {
    const users = await this.userRepository.findAll();

    res.json(users);
  };

  public getUserById = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, errors: ['User not found'] });
    }

    res.json({ success: true, data: user });
  };

  public updateUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const { email, pass_hash } = req.body;

    const updatedUser = await this.userRepository.update(userId, { email, pass_hash });
    res.json({ success: true, data: updatedUser });
  };

  public deleteUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    await this.userRepository.delete(userId);
    res.json({
      success: true,
      data: {
      message: 'User deleted successfully' }
    });
  };
}