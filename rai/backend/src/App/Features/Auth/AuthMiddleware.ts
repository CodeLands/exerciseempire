// /middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { JwtGateway } from './Services/JwtGateway';
import { TYPES } from '/Shared/Types';

interface CustomRequest extends Request {
  userId?: string;
}

@injectable()
class AuthMiddleware {
  @inject(TYPES.JwtGateway)
  private readonly jwtGateway!: JwtGateway

  public authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.json({ success: false, errors: ['Token not found'] });

    this.jwtGateway.jwtVerify(token, (err, userId) => {
      if (err) return res.json({ success: false, errors: ['Invalid token'] });
      req.userId = userId as string;
      next();
    });
  };
}

export const authMiddleware = new AuthMiddleware();
