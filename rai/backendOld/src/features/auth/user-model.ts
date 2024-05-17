import { query } from '../../infrastructure/db';
import bcrypt from 'bcrypt';

interface User {
  email: string;
  password: string;
}

export class UserModel {
  static async create({ email, password }: User): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query('INSERT INTO users (email, pass_hash) VALUES ($1, $2, $3) RETURNING *', [email, hashedPassword]);
    return result.rows[0];
  }

  static async findByEmail(email: string): Promise<any> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async updateVideoStatus(email: string, videoProcessed: boolean): Promise<void> {
    // Update the user's record with the video processing status
    const result = await query('UPDATE users SET video_processed = $1 WHERE email = $2', [videoProcessed, email]);
    return result.rows[0];
  }
}