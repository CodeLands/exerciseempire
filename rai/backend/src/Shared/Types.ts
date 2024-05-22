export const TYPES = {
  // Feature specific
  // Auth
  AuthValidator: Symbol.for("AuthValidator"),
  AuthController: Symbol.for("AuthController"),
  AuthRepository: Symbol.for("AuthRepository"),
  AuthRouter: Symbol.for("AuthRouter"),

  // User
  UserValidator: Symbol.for("UserValidator"),
  UserController: Symbol.for("UserController"),
  UserRepository: Symbol.for("UserRepository"),
  UserRouter: Symbol.for("UserRouter"),

  // Activities
  ActivitiesValidator: Symbol.for("ActivitiesValidator"),
  ActivitiesController: Symbol.for("ActivitiesController"),
  ActivitiesRepository: Symbol.for("ActivitiesRepository"),
  ActivitiesRouter: Symbol.for("ActivitiesRouter"),
  
      // User
    // UserValidator: Symbol.for('UserValidator'),
    // UserController: Symbol.for('UserController'),
    // UserRepository: Symbol.for('UserRepository'),
    // UserRouter: Symbol.for('UserRouter'),

      // Sensor Data
    SensorDataValidator: Symbol.for('SensorDataValidator'),
    SensorDataController: Symbol.for('SensorDataController'),
    SensorDataRepository: Symbol.for('SensorDataRepository'),
    SensorDataRouter: Symbol.for('SensorDataRouter'),

      // Executed Activity
    ExecutedActivityRepository: Symbol.for('ExecutedActivityRepository'),

  // Sensor Data

  // User Stats

  // Services
  AuthGateway: Symbol.for("AuthGateway"),
  DbGateway: Symbol.for("DbGateway"),
  JwtGateway: Symbol.for("JwtGateway"),
};
