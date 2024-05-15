import { Pool } from 'pg';

const pool = new Pool({
    user: 'myuser',
    host: 'localhost',
    database: 'mydatabase',
    password: 'mypassword',
    port: 5432,
  });

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};
