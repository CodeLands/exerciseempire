import { TYPES } from '../Shared/Types';
import { baseContainer } from '../Shared/BaseContainer';
import { UserRepository } from '/App/Repositories/UserRepository';
import { MockUserRepository } from './Mocks/MockUserRepository';
import { MockAuthRepository } from './Mocks/MockAuthRepository';
import { AuthRepository } from '/App/Repositories/AuthRepository';
 
// baseContainer.bind<AuthRepository>(TYPES.AuthRepository).to(MockAuthRepository);
// baseContainer.bind<UserRepository>(TYPES.UserRepository).to(MockUserRepository);

export { baseContainer as testContainer };