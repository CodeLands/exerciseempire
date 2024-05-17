import 'reflect-metadata';
import { UserRepository } from '../../src/repositories/UserRepository';
import pool from '../../src/utils/database';
jest.mock('../../src/utils/database');

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  it('should return a list of users', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }] });
    const users = await userRepository.findAll();
    expect(users).toEqual([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }]);
  });

  it('should return a user by ID', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
    (pool.query as jest.Mock).mockResolvedValue({ rows: [mockUser] });
    const user = await userRepository.findById(1);
    expect(user).toEqual(mockUser);
  });

  it('should create a new user', async () => {
    const newUser = { name: 'Jane Doe', email: 'jane.doe@example.com' };
    await userRepository.create(newUser);
    expect(pool.query).toHaveBeenCalledWith('INSERT INTO users (name, email) VALUES ($1, $2)', [newUser.name, newUser.email]);
  });

  it('should update an existing user', async () => {
    const updatedUser = { id: 1, name: 'John Smith', email: 'john.smith@example.com' };
    await userRepository.update(1, updatedUser);
    expect(pool.query).toHaveBeenCalledWith('UPDATE users SET name = $1, email = $2 WHERE id = $3', [updatedUser.name, updatedUser.email, updatedUser.id]);
  });

  it('should delete a user', async () => {
    await userRepository.delete(1);
    expect(pool.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = $1', [1]);
  });
});
