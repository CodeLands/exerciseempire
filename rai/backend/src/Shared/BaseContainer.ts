import { Container } from 'inversify';
import { TYPES } from './Types';
import { AuthRouter } from '../App/Features/Auth/AuthRouter';
import { AuthValidator } from '../App/Features/Auth/AuthValidator';
import { AuthController } from '../App/Features/Auth/AuthController';
import { AuthGateway } from '../App/Services/AuthGateway';
import { JwtGateway } from '../App/Services/JwtGateway';
import { AuthRepository } from '/App/Repositories/AuthRepository';

export class BaseContainer {
  container;

  constructor() {
    this.container = new Container({
      autoBindInjectable: true,
      defaultScope: "Singleton",
    });
  }

  buildBaseTemplate = () => {
    
    // Features
        // Auth
    this.container.bind(TYPES.AuthValidator).to(AuthValidator).inSingletonScope()
    this.container.bind(TYPES.AuthController).to(AuthController).inSingletonScope()
    this.container.bind(TYPES.AuthRouter).to(AuthRouter).inSingletonScope()
    this.container.bind(TYPES.AuthRepository).to(AuthRepository).inSingletonScope() 
    
        // User
    // this.container.bind(TYPES.UserValidator).to(UserValidator).inSingletonScope()
    // this.container.bind(TYPES.UserController).to(UserController).inSingletonScope()
    // this.container.bind(TYPES.UserRouter).to(UserRouter).inSingletonScope()
    // this.container.bind(TYPES.UserRepository).to(UserRepository).inSingletonScope()

        // Sensors
        
    
    // Services
    this.container.bind(TYPES.AuthGateway).to(AuthGateway).inSingletonScope()
    this.container.bind(TYPES.JwtGateway).to(JwtGateway).inSingletonScope()

    return this.container;
  };
}