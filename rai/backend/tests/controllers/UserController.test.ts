import 'reflect-metadata';
import request from 'supertest';
import express from 'express';
import { testContainer } from '../testContainer';
import { TYPES } from '../../src/types';
import { UserController } from '../../src/controllers/UserController';

const app = express();
app.use(express.json());

const userController = testContainer.get<UserController>(TYPES.UserController);
app.get('/users', userController.getUsers);
app.get('/users/:id', userController.getUserById);
//app.post('/users', userController.createUser);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser); 

describe('UserController', () => {
  it('should return a list of users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }]);
  });

  it('should return a user by ID', async () => {
    const response = await request(app).get('/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
  });

  // it('should create a new user', async () => {
  //   const newUser = { name: 'Jane Doe', email: 'jane.doe@example.com' };
  //   await request(app).post('/users').send(newUser).expect(201);
  // });

  it('should update an existing user', async () => {
    const updatedUser = { id: 1, name: 'John Smith', email: 'john.smith@example.com' };
    await request(app).put('/users/1').send(updatedUser).expect(200);
  });

  it('should delete a user', async () => {
    await request(app).delete('/users/1').expect(200);
  });
});
