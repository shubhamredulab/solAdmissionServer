import { Router } from 'express';
import AuthController from '../controllers/Auth';
const router = Router();

// router.post('/register', AuthController.registerUser);
router.get('/registerPage', AuthController.registerPage);
// router.post('/register', AuthController.register);
router.post('/register', AuthController.registerUser);



export default router;