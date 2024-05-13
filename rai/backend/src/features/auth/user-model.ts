import { Pool } from 'pg';
import { query } from '../../infrastructure/db'; // Assuming db.ts handles the connection
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

interface User {
  username: string;
  email: string;
  password: string;
}

export class UserModel {
  static async create({ username, email, password }: User): Promise<any> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await query('INSERT INTO users (username, email, pass_hash) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword]);
    return result.rows[0];
  }

  static async findByUsername(username: string): Promise<any> {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  static async updateVideoStatus(username: string, videoProcessed: boolean): Promise<void> {
    // Update the user's record with the video processing status
    const result = await query('UPDATE users SET video_processed = $1 WHERE username = $2', [videoProcessed, username]);
    return result.rows[0];
  }
}