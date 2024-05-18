import 'reflect-metadata';
import request from 'supertest';
import { TYPES } from '../../Shared/Types';
import express from 'express';
import { UserRepository } from '/App/Repositories/UserRepository';
import { createApp } from '/Shared/BaseApp';
import { testContainer } from '../TestContainer';

const mockUserRepository = { 
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

let baseApp: express.Application;
 
beforeAll(() => {
  testContainer.bind<UserRepository>(TYPES.UserRepository).toConstantValue(mockUserRepository as any);

  baseApp = createApp(testContainer);
}); 

describe('UserController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of users', async () => {
    mockUserRepository.findAll.mockResolvedValue([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }]);
    const response = await request(baseApp).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: 'John Doe', email: 'john.doe@example.com' }]);
  });

  it('should return a user by ID', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: 1, name: 'John Doe', email: 'john.doe@example.com' });
    const response = await request(baseApp).get('/user/1');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: { id: 1, name: 'John Doe', email: 'john.doe@example.com' }
    });
  });

  it('should update an existing user', async () => {
    const updatedUser = { id: 1, name: 'John Smith', email: 'john.smith@example.com' };
    mockUserRepository.update.mockResolvedValue(updatedUser);
    const response = await request(baseApp).put('/user/1').send(updatedUser)

    expect(response.body).toEqual({
      success: true,
      data: { id: 1, name: 'John Smith', email: 'john.smith@example.com' }
    });
  });

  it('should delete a user', async () => {
    mockUserRepository.delete.mockResolvedValue({});
    const response = await request(baseApp).delete('/user/1')

    expect(response.body).toEqual({
      success: true,
      data: {
        message: "User deleted successfully"
      }
    });
  });
});
