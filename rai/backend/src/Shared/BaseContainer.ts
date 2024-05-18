import { Container } from 'inversify';
import { TYPES } from './Types';
import { UserController } from '../App/Features/Users/UserController';
import { AuthRouter } from '../App/Features/Auth/AuthRouter';
import { AuthValidator } from '../App/Features/Auth/AuthValidator';
import { AuthController } from '../App/Features/Auth/AuthController';
import { UserValidator } from '../App/Features/Users/UserValidator';
import { UserRouter } from '../App/Features/Users/UserRouter';
import { AuthGateway } from '../App/Services/AuthGateway';
import { JwtGateway } from '../App/Services/JwtGateway';
import { DbGateway } from '/App/Services/DbGateway';

const baseContainer = new Container();

// Features
    // Auth
baseContainer.bind<AuthValidator>(TYPES.AuthValidator).to(AuthValidator);
baseContainer.bind<AuthController>(TYPES.AuthController).to(AuthController);
baseContainer.bind<AuthRouter>(TYPES.AuthRouter).to(AuthRouter);

    // User
baseContainer.bind<UserValidator>(TYPES.UserValidator).to(UserValidator);
baseContainer.bind<UserController>(TYPES.UserController).to(UserController);
baseContainer.bind<UserRouter>(TYPES.UserRouter).to(UserRouter);

// Services
baseContainer.bind<DbGateway>(TYPES.DbGateway).to(DbGateway)
baseContainer.bind<AuthGateway>(TYPES.AuthGateway).to(AuthGateway);
baseContainer.bind<JwtGateway>(TYPES.JwtGateway).to(JwtGateway);

export { baseContainer };
