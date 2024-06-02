// /middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGateway } from './Services/JwtGateway';
import { TYPES } from '/Shared/Types';
import { AuthFactorType, TokenPayload } from './Types/FactorAuthType';

export interface RequestWithUser extends Request {
  userId?: number;
  authStep?: AuthFactorType;
}

@injectable()
class AuthMiddleware {
  @inject(TYPES.JwtGateway)
  private readonly jwtGateway!: JwtGateway

  public authenticateToken = (req: RequestWithUser, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.json({ success: false, errors: ['Token not found'] });

    this.jwtGateway.jwtVerify(token, (err, tokenPayload) => {
      const { sub, step } = tokenPayload as unknown as TokenPayload

      if (err) return res.json({ success: false, errors: ['Invalid token'] });

      req.userId = sub;
      req.authStep = step;
      next();
    });
  };
}

export const authMiddleware = new AuthMiddleware();
