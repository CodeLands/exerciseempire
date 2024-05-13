import { Pool } from 'pg';

const pool = new Pool({
    connectionString: 'postgres://username:password@localhost/dbname'
});

export const query = (text: string, params?: any[]) => {
    return pool.query(text, params);
};
