import { Router } from 'express';
import multer from 'multer';
import { faceLogin, faceRegister } from './face-id-controller';

const upload = multer({ storage: multer.memoryStorage() }); // Storing files in memory
const router: Router = Router();

router.post('/face-login', upload.single('video'), faceLogin);
router.post('/face-register', upload.single('video'), faceRegister);

export default router;
