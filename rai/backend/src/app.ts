import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);

export default app;
