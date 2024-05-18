import {injectable} from 'inversify';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_secret_key';

@injectable()
class JwtGateway {
  sign(payload: any) {
    return jwt.sign(payload, secret);
  }

  verify(token: string, callback?: jwt.VerifyCallback) {
    jwt.verify(token, secret, callback);
  }
}

export {JwtGateway};