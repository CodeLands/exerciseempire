
import { injectable, inject } from 'inversify';
import { TYPES } from '/Shared/Types';
import { UserController } from './UserController';
import { Router } from 'express';

@injectable()
export class UserRouter {
    @inject(TYPES.UserController)
    private userController!: UserController

    public defineUserRoutes(router: Router) {
        router.get('/users', this.userController.getAllUsers);
        router.get('/user/:id', this.userController.getUserById);
        router.put('/user/:id', this.userController.updateUser);
        router.delete('/user/:id', this.userController.deleteUser);
    }
}