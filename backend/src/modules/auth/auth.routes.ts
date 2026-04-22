import { Router } from 'express';
import * as authController from './auth.controller';
import passport from 'passport';

export const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:5173";


const router = Router();

// router.post('/register', authController.register);  //without otp verification

router.post("/send-otp",   authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post('/login',    authController.login);  


router.post('/logout', authController.logout);

// Google OAuth initiation
router.get('/google', authController.googleAuth);

// Google OAuth callback
router.get('/google/callback', authController.googleAuthCallback, authController.googleAuthSuccess);


export default router;