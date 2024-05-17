import { Container } from 'inversify';
import { TYPES } from './types';
import { UserRepository } from './repositories/UserRepository';
import { UserService } from './services/UserService';
import { UserController } from './controllers/UserController';

const container = new Container();
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<UserService>(TYPES.UserService).to(UserService); // Ensure this binding exists
container.bind<UserController>(TYPES.UserController).to(UserController);

export { container };
