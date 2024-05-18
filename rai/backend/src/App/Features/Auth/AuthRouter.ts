import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '/Shared/Types';
import { AuthController } from './AuthController';

@injectable()
export class AuthRouter {
    public router: Router = Router();

    @inject(TYPES.AuthController)
    private readonly authController!: AuthController;

    constructor() {
        this.defineAuthRoutes()
    }

    public defineAuthRoutes() {
        this.router.post('/login', this.authController.login);
        this.router.post('/register', this.authController.register);
    }
}