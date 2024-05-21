import 'reflect-metadata';
import express from 'express';
import { Container } from 'inversify';
import { TYPES } from '/Shared/Types';
import { AuthRouter } from '/App/Features/Auth/AuthRouter';
import { SensorDataRouter } from '/App/Features/SensorData/SensorDataRouter';

export const createApp = (container: Container): express.Application => {
  const app = express();
  const router = express.Router()

  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); // Support for URL-encoded bodies

  const authRouter: AuthRouter = container.get(TYPES.AuthRouter);
  const sensorDataRouter: SensorDataRouter = container.get(TYPES.SensorDataRouter);

  authRouter.defineAuthRoutes(router)
  sensorDataRouter.defineSensorDataRoutes(router)

  app.use(router);

  return app;
};
