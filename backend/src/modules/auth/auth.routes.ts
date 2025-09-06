import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

router.get('/login', authController.loginPage);

router.post('/logout', authController.logout);

// Google OAuth initiation
router.get('/google', authController.googleAuth);

// Google OAuth callback
router.get('/google/callback', authController.googleAuthCallback, authController.googleAuthSuccess);

export default router;