import { NextFunction, Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '/Shared/Types';
import multer from 'multer';
import { FaceIdController } from './FaceIdController';
import { AuthMiddleware, RequestWithUser } from '../AuthMiddleware';

const upload = multer({ storage: multer.memoryStorage() }); // Storing files in memory
  

@injectable()
export class FaceIdRouter {
    @inject(TYPES.FaceIdController)
    private readonly faceIdController!: FaceIdController;

    @inject(TYPES.AuthMiddleware)
    private readonly authMiddleware!: AuthMiddleware;

    public defineFaceIdRoutes(router: Router) {

        router.post('/face-login', this.authMiddleware.authenticateToken, upload.single('video'), this.faceIdController.faceIdLogin);
        router.post('/face-register', this.authMiddleware.authenticateToken, upload.single('video'), this.faceIdController.faceIdRegister);
        //router.post('/face-delete', this.authMiddleware.authenticateToken, this.faceIdController.faceIdDelete);
        router.post('/face-is-enabled', this.authMiddleware.authenticateToken, this.faceIdController.faceIdIsEnabled);
    }
}
