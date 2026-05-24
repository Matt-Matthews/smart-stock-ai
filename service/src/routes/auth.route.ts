import express, { Router } from 'express';
import * as authControllers from '@controllers/auth/index.js';
import { authenticateUser } from '@middlewares/auth.middleware.js';

const router: Router = express.Router();

router.post('/login', authControllers.login);
router.get('/logout', authenticateUser, authControllers.logOut);
router.post('/register', authControllers.register);

export default router;