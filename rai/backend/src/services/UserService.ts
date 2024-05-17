import { injectable, inject } from 'inversify';
import { User } from '../models/User';
import { TYPES } from '../types';
import { UserRepository } from '../repositories/UserRepository';

@injectable()
export class UserService {
  constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {}

  public async getUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  public async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  public async createUser(user: User): Promise<void> {
    await this.userRepository.create(user);
  }

  public async updateUser(id: number, user: User): Promise<void> {
    await this.userRepository.update(id, user);
  }

  public async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
