import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '/Shared/Types';
import { AuthController } from './AuthController';

@injectable()
export class AuthRouter {
    @inject(TYPES.AuthController)
    private readonly authController!: AuthController;

    public defineAuthRoutes(router: Router) {
        router.post('/login', this.authController.login);
        router.post('/register', this.authController.register);
    }
}