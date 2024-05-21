import 'reflect-metadata';
import express from 'express';
import { Container } from 'inversify';
import { TYPES } from '/Shared/Types';
import { AuthRouter } from '/App/Features/Auth/AuthRouter';

export const createApp = (container: Container): express.Application => {
  const app = express();
  const router = express.Router()

  app.use(express.json());
  app.use(express.urlencoded({ extended: true })); // Support for URL-encoded bodies

  // const userRouter: UserRouter = container.get(TYPES.UserRouter);
  const authRouter: AuthRouter = container.get(TYPES.AuthRouter);

  // userRouter.defineUserRoutes(router)
  authRouter.defineAuthRoutes(router)

  app.use(router);

  return app;
};
