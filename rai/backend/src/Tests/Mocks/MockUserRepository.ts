import { injectable } from 'inversify';
import { UserRepository } from '/App/Repositories/UserRepository';

@injectable()
export class MockUserRepository {

  public async findAll() {
    return [{ id: 1, email: 'john.doe@example.com', pass_hash: 'password' }];
  }
 
  public async findById(id: number) {
    return { id: 1, email: 'john.doe@example.com', pass_hash: 'password'};
  }

  public async update(id: number, data: { email: string; pass_hash: string }) {
    return { id: 1, email: 'john.doe@example.com', pass_hash: 'password'};
  }

  public async delete(id: number) {
    return { id: 1, email: 'john.doe@example.com', pass_hash: 'password'};
  }
}
