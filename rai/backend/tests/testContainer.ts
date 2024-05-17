import { Container } from 'inversify';
import { TYPES } from '../src/types';
import { UserRepository } from '../src/repositories/UserRepository';
import { UserService } from '../src/services/UserService';
import { UserController } from '../src/controllers/UserController';
import { MockUserRepository } from './mocks/MockUserRepository';

const testContainer = new Container();
testContainer.bind<UserRepository>(TYPES.UserRepository).to(MockUserRepository);
testContainer.bind<UserService>(TYPES.UserService).to(UserService);
testContainer.bind<UserController>(TYPES.UserController).to(UserController);

export { testContainer };
