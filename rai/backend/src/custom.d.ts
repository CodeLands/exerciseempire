import { User } from './models/User'; // Adjust the path if necessary

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
