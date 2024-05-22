import { Container } from 'inversify';
import { TYPES } from './Types';
import { AuthRouter } from '../App/Features/Auth/AuthRouter';
import { AuthValidator } from '../App/Features/Auth/AuthValidator';
import { AuthController } from '../App/Features/Auth/AuthController';
import { AuthGateway } from '../App/Features/Auth/Services/AuthGateway';
import { JwtGateway } from '../App/Features/Auth/Services/JwtGateway';
import { AuthRepository } from '../App/Features/Auth/Repositories/AuthRepository';
import { ActivitiesRouter } from '/App/Features/Activities/ActivitiesRouter';
import { ActivitiesValidator } from '/App/Features/Activities/ActivitiesValidator';
import { ActivitiesController } from '/App/Features/Activities/ActivitiesController';
import { ActivitiesRepository } from '/App/Features/Activities/Repositories/ActivitiesRepository';
import { SensorDataValidator } from '/App/Features/SensorData/SensorDataValidator';
import { SensorDataController } from '/App/Features/SensorData/SensorDataController';
import { SensorDataRouter } from '/App/Features/SensorData/SensorDataRouter';
import { SensorDataRepository } from '/App/Features/SensorData/Repositories/SensorDataRepository';
import { ExecutedActivityRepository } from '/App/Features/SensorData/Repositories/ExecutedActivityRepository';

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

        // Activities
    this.container.bind(TYPES.ActivitiesValidator).to(ActivitiesValidator).inSingletonScope()
    this.container.bind(TYPES.ActivitiesController).to(ActivitiesController).inSingletonScope()
    this.container.bind(TYPES.ActivitiesRouter).to(ActivitiesRouter).inSingletonScope()
    this.container.bind(TYPES.ActivitiesRepository).to(ActivitiesRepository).inSingletonScope()
    
      // SensorData
    this.container.bind(TYPES.SensorDataValidator).to(SensorDataValidator).inSingletonScope()
    this.container.bind(TYPES.SensorDataController).to(SensorDataController).inSingletonScope()
    this.container.bind(TYPES.SensorDataRouter).to(SensorDataRouter).inSingletonScope()
    this.container.bind(TYPES.SensorDataRepository).to(SensorDataRepository).inSingletonScope()

    // Standalone Repositories
    this.container.bind(TYPES.ExecutedActivityRepository).to(ExecutedActivityRepository).inSingletonScope()

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
