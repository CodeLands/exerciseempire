import { injectable } from 'inversify';
import { User } from '../../src/models/User';
import { UserRepository } from '../../src/repositories/UserRepository';

@injectable()
export class MockUserRepository extends UserRepository {
  public async findAll(): Promise<User[]> {
    return [{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }];
  }

  public async findById(id: number): Promise<User | null> {
    return { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
  }

  public async create(user: User): Promise<void> {
    // Mock implementation
  }

  public async update(id: number, user: User): Promise<void> {
    // Mock implementation
  }

  public async delete(id: number): Promise<void> {
    // Mock implementation
  }
}
