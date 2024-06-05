import "reflect-metadata";
import express from "express";
import { Container } from "inversify";
import { TYPES } from "/Shared/Types";
import { AuthRouter } from "/App/Features/Auth/AuthRouter";
import { ActivitiesRouter } from "/App/Features/Activities/ActivitiesRouter";
import { SensorDataRouter } from '/App/Features/SensorData/SensorDataRouter';
import { FaceIdRouter } from "/App/Features/Auth/FaceId/FaceIdRouter";

export const createApp = (container: Container): express.Application => {
  const app = express();
  const cors = require('cors');
  const router = express.Router();

  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); // Support for URL-encoded bodies

  const authRouter: AuthRouter = container.get(TYPES.AuthRouter);
  const faceIdRouter: FaceIdRouter = container.get(TYPES.FaceIdRouter);
  const activitiesRouter: ActivitiesRouter = container.get(TYPES.ActivitiesRouter);
  const sensorDataRouter: SensorDataRouter = container.get(TYPES.SensorDataRouter);
  
  authRouter.defineAuthRoutes(router);
  faceIdRouter.defineFaceIdRoutes(router);
  activitiesRouter.defineActivitiesRoutes(router);
  sensorDataRouter.defineSensorDataRoutes(router)

  app.use(router);

  return app;
};
