import { Router } from 'express';
import { registerUser, loginUser, loginWithGoogle } from '../controllers/userController';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', loginWithGoogle);

export default router;
