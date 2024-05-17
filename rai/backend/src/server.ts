import 'reflect-metadata';
import express from 'express';
import { json } from 'body-parser';
import { container } from './container';
import { TYPES } from './types';
import { UserController } from './controllers/UserController';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(json());

const userController = container.get<UserController>(TYPES.UserController);

app.get('/users', userController.getUsers);
app.get('/users/:id', userController.getUserById);
//app.post('/users', userController.createUser);
app.put('/users/:id', userController.updateUser);
app.delete('/users/:id', userController.deleteUser);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
