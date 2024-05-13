import express, { Application } from 'express';
import session from 'express-session';
import cors from 'cors';
import { Pool } from 'pg';  // Import pg Pool
import connectPgSimple from 'connect-pg-simple';  // Import connect-pg-simple

import corsOptions from './config/cors-options';
import authRoutes from '../features/auth/auth-routes';
import faceRoutes from '../features/auth/python-face-integration/face-routes';
import errorHandlers from './middlewares/error-handlers';

const app: Application = express();
const pgPool = new Pool({
  connectionString: 'postgresql://username:password@localhost/dbname'  // Adjust connection string as needed
}); 

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.use('/auth', authRoutes);
app.use('/face', faceRoutes);
app.use(errorHandlers);

export default app;
