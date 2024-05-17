import { Pool } from 'pg';
import connectPgSimple from 'connect-pg-simple';  // Import connect-pg-simple


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

// Configure session to use connect-pg-simple
const PgStore = connectPgSimple(session);
app.use(session({
  store: new PgStore({
    pool: pgPool,  // Use the pg pool
    tableName: 'session'  // Use a custom table name. Defaults to 'session'
  }),
  secret: 'work hard',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }  // 30 days
}));