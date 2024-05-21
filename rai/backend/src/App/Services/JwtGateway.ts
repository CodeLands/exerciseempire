import {injectable} from 'inversify';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'your_secret_key';

@injectable()
class JwtGateway {
  jwtSign(payload: any) {
    return jwt.sign(payload, secret);
  }

  jwtVerify(token: string, callback?: jwt.VerifyCallback) {
    jwt.verify(token, secret, callback);
  }
}

export {JwtGateway};