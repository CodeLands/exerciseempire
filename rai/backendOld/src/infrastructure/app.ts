import express, { Application } from 'express';
import cors from 'cors';

import corsOptions from './config/cors-options';
import authRoutes from '../features/auth/auth-routes';
import faceRoutes from '../features/auth/python-face-integration/face-routes';
import errorHandlers from './middlewares/error-handlers';

export default function (database: any) {

const app: Application = express();


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use('/auth', authRoutes);
app.use('/face', faceRoutes);
app.use(errorHandlers);

return app;
}