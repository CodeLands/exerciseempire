import 'reflect-metadata';
import express from 'express';
import { Container } from 'inversify';
import { TYPES } from '/Shared/Types';
import { UserRouter } from '/App/Features/Users/UserRouter';

export const createApp = (container: Container): express.Application => {
  const app = express();
  const router = express.Router()

  const userRouter = container.get<UserRouter>(TYPES.UserRouter);

  userRouter.defineUserRoutes(router)

  app.use(express.json());
  app.use(router);

  return app;
};
