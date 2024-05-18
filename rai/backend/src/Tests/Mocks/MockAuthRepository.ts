import { injectable } from 'inversify';
import { AuthRepository } from '/App/Repositories/AuthRepository';

@injectable()
export class MockAuthRepository {

  public async findByEmail(email: string) {
    return { id: 1, email: 'john.doe@example.com', pass_hash: 'password'};
  }

  public async create(data: { email: string; password_hash: string }) {
    return { id: 1, email: 'john.doe@example.com', pass_hash: 'password'};
  }
}
