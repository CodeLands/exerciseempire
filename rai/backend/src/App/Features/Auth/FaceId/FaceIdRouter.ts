import { Router } from 'express';
import { injectable, inject } from 'inversify';
import { TYPES } from '/Shared/Types';
import multer from 'multer';
import { FaceIdController } from './FaceIdController';

const upload = multer({ storage: multer.memoryStorage() }); // Storing files in memory

@injectable()
export class FaceIdRouter {
    @inject(TYPES.FaceIdController)
    private readonly faceIdController!: FaceIdController;

    public defineFaceIdRoutes(router: Router) {

        router.post('/face-login', upload.single('video'), this.faceIdController.faceIdLogin);
        router.post('/face-register', upload.single('video'), this.faceIdController.faceIdRegister);
    }
}
