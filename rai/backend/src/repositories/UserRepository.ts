import { injectable } from 'inversify';
import { User } from '../models/User';
import pool from '../utils/database';

@injectable()
export class UserRepository {
  public async findAll(): Promise<User[]> {
    const { rows } = await pool.query('SELECT id, name, email FROM users');
    return rows;
  }

  public async findById(id: number): Promise<User | null> {
    const { rows } = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
    return rows[0] || null;
  }

  public async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  }

  public async create(user: User): Promise<void> {
    await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [user.name, user.email]);
  }

  public async update(id: number, user: User): Promise<void> {
    await pool.query('UPDATE users SET name = $1, email = $2 WHERE id = $3', [user.name, user.email, id]);
  }

  public async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  }
}
