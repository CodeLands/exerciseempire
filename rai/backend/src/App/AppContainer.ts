import { TYPES } from '/Shared/Types';
import { baseContainer } from '../Shared/BaseContainer';
import { UserRepository } from './Repositories/UserRepository';
import { AuthRepository } from './Repositories/AuthRepository';
import { DbGateway } from './Services/DbGateway';

baseContainer.bind<DbGateway>(TYPES.DbGateway).to(DbGateway);

baseContainer.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);
baseContainer.bind<AuthRepository>(TYPES.AuthRepository).to(AuthRepository);

export { baseContainer as appContainer }