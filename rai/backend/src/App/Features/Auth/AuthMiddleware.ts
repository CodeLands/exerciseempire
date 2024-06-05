// /middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGateway } from './Services/JwtGateway';
import { TYPES } from '/Shared/Types';
import { AuthFactorType, TokenPayload } from './Types/FactorAuthType';
import { z } from 'zod';

const authSchema = z.object({
  sub: z.number(),
  step: z.string(),
});

type TokenWithUser = {
  sub?: number;
  step?: AuthFactorType;
};

export interface RequestMaybeWithUser extends Request {
  userId?: number;
  authStep?: string;
}

export interface RequestWithUser extends Request {
  userId?: number;
  authStep?: string;
}

@injectable()
export class AuthMiddleware {
  @inject(TYPES.JwtGateway)
  private readonly jwtGateway!: JwtGateway

  public authenticateToken = (req: RequestMaybeWithUser, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.json({ success: false, errors: ['Token not found'] });

    this.jwtGateway.jwtVerify(token, (err, tokenPayload) => {
      if (err) return res.json({ success: false, errors: ['Invalid token'] });

      const { sub, step } = tokenPayload as TokenWithUser

      const validationResult = authSchema.safeParse({ sub, step });
      if (!validationResult.success) return res.json({ success: false, errors: validationResult.error.errors.map(e => e.message) });

      req.userId = validationResult.data.sub;
      req.authStep = validationResult.data.step;

      if (req.userId === undefined || req.authStep === undefined) return res.json({ success: false, errors: ['Invalid token'] });
      next();
    });
  };
}
