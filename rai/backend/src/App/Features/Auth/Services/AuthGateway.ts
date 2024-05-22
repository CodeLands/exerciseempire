import {injectable} from 'inversify';
import bcrypt from 'bcryptjs';

@injectable()
class AuthGateway {
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}

export {AuthGateway};