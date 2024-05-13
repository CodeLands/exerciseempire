import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const createUser = async (username: string, passwordHash: string) => {
  const result = await pool.query(
    'INSERT INTO users(username, pass_hash) VALUES($1, $2) RETURNING *',
    [username, passwordHash]
  );
  return result.rows[0];
};
