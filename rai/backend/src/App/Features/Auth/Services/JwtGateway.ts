import {injectable} from 'inversify';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_secret_key';

@injectable()
class JwtGateway {
  jwtSign(payload: any, options?: jwt.SignOptions) {
    return jwt.sign(payload, secret, options);
  }

  jwtVerify(token: string, callback?: jwt.VerifyCallback) {
    jwt.verify(token, secret, callback);
  }
}

export {JwtGateway};