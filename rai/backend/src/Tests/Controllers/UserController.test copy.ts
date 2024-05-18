import 'reflect-metadata';
import request from 'supertest';
import express from 'express';
import { Container } from 'inversify';
import { TYPES } from '../../Shared/Types';
import { UserRepository } from '../../App/Repositories/UserRepository';
import { UserController } from '../../App/Features/Users/UserController';
import { UserRouter } from '../../App/Features/Users/UserRouter';

const mockUserRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

let app: express.Application;
let container: Container;

beforeAll(() => {
  container = new Container();
  container.bind<UserRepository>(TYPES.UserRepository).toConstantValue(mockUserRepository as any);
  container.bind<UserController>(TYPES.UserController).to(UserController);
  container.bind<UserRouter>(TYPES.UserRouter).to(UserRouter);

  app = express();
  const userRouter = container.get<UserRouter>(TYPES.UserRouter);

  app.use(express.json());
  app.use(userRouter.router);
});

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of users', async () => {
    mockUserRepository.findAll.mockResolvedValue([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }]);
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }]);
  }, 10000); // Increase timeout to 10 seconds

  it('should return a user by ID', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
  }, 10000); // Increase timeout to 10 seconds

  it('should update an existing user', async () => {
    const updatedUser = { id: 1, name: 'John Smith', email: 'john.smith@example.com' };
    mockUserRepository.updateUser.mockResolvedValue(updatedUser);
    await request(app).put('/users/1').send(updatedUser).expect(200);
  }, 10000); // Increase timeout to 10 seconds

  it('should delete a user', async () => {
    mockUserRepository.deleteUser.mockResolvedValue({});
    await request(app).delete('/users/1').expect(200);
  }, 10000); // Increase timeout to 10 seconds
});
