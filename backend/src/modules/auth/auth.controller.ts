import { Request, Response } from 'express';
import passport from 'passport';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from '../../db';
import { users } from '../../db/schema';
import { saveOtp, getOtp, deleteOtp } from "../../utils/otpStore";
import crypto from "crypto";
import { OtpEmailDetails, sendOtpEmail } from '../mail/otpverify.service';
import axios from 'axios';


const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:5173";

// Initiate Google OAuth
//this redirects them to Google's OAuth consent screen
// Requests access to user's profile information and email address
//for user: User sees Google's "Allow [Your App] to access your account?" screen
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'], // Scopes for Google OAuth
});



// Google OAuth Callback
// Handles Google's response after user grants/denies permission
//Success: If authentication succeeds, Passport processes the user data
//Failure: If authentication fails, redirects user to /auth/login
export const googleAuthCallback = passport.authenticate('google', {
  failureRedirect: `${FRONTEND_BASE_URL}/login?error=google_conflict`, // Redirect on authentication failure
});


// if auth is successful, redirects to protected route "/profile"
export const googleAuthSuccess = (req: Request, res: Response) => {
  res.redirect(`${FRONTEND_BASE_URL}/products`);
};



//Logout
// req.logout(): Removes user from Passport's session
// req.session.destroy(): Destroys the entire Express session
// res.clearCookie('connect.sid'): Removes session cookie from browser
// Redirects to home page
export const logout = (req: Request, res: Response, next: Function) => {
  req.logout((err) => { // Passport's logout method
    if (err) {
      return next(err);
    }
    // Destroy the express-session
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('connect.sid'); // 'connect.sid' is default cookie name for express-session
      res.redirect(`${FRONTEND_BASE_URL}`);
    });
  });
};



//  validate send OTP (replaces your old register)
export const sendOtp = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password || !username)
    return res.status(400).json({ message: "All fields are required" });

  // Check if email already taken
  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) {
    const hint = existing.authProvider === "google" ? " (use Google login)" : "";
    return res.status(400).json({ message: `Email already in use${hint}` });
  }

  // Generate 6 random digits
  const otp = crypto.randomInt(100000, 999999).toString();


  // Save OTP + user data temporarily
  saveOtp(email, otp, { username, email, password });

  // Send email
  const toSendInfo: OtpEmailDetails = { 
    to: email, 
    otp,
    userName: username
  }
  await sendOtpEmail(toSendInfo);

  return res.status(200).json({ message: "OTP sent to your email" });
};



// verify otp of user before registration or user account creation
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const entry = getOtp(email);

  if (!entry)
    return res.status(400).json({ message: "OTP expired or not found. Please register again." });

  if (Date.now() > entry.expiresAt) {
    deleteOtp(email);
    return res.status(400).json({ message: "OTP expired. Please register again." });
  }

  if (entry.otp !== otp)
    return res.status(400).json({ message: "Incorrect OTP." });


  // OTP valid — create the user
  const hashed = await bcrypt.hash(entry.userData.password, 12);
  const [user] = await db.insert(users).values({
    email:        entry.userData.email,
    username:     entry.userData.username,
    password:     hashed,
    authProvider: "local",
  }).returning();

  deleteOtp(email); // clean up

  req.login(user, (err) => {
    if (err) return res.status(500).json({ message: "Login after register failed" });
    return res.status(201).json({ message: "Registered successfully", user });
  });
};


export const login = async(req: Request, res: Response, next: Function): Promise<void> => {
  const { email, password, captchaToken } = req.body;

  if (!captchaToken) {
    res.status(400).json({ message: 'Please complete the captcha' });
    return;
  }
  try {
    const googleResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
    );

    if (!googleResponse.data.success) {
      res.status(401).json({ message: 'Captcha verification failed' });
      return;
    }

    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err)   return next(err);
      if (!user) return res.status(401).json({ message: info?.message ?? 'Login failed' });

      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(200).json({ message: 'Logged in', user });
      });
    })(req, res, next);

  } catch (error) {
    console.error('Captcha Error:', error);
    res.status(500).json({ message: 'Error verifying captcha' });
    return;
  }
};



// // Renders a basic login page
// export const loginPage = (req: Request, res: Response) => {
//   res.send(`
//     <h1>Login Page</h1>
//     <p>Please log in with your Google account.</p>
//     <a href="/auth/google">Login with Google</a>
//   `);
// };



//without otp verification
//register the user using email password and username
// export const register = async (req: Request, res: Response) => {
//   const { email, password, username } = req.body;

//   if (!email || !password || !username)
//     return res.status(400).json({ message: 'All fields are required' });

//   const [existing] = await db.select().from(users).where(eq(users.email, email));
//   if (existing) {
//     // tell them to use Google if that's how they signed up
//     const hint = existing.authProvider === 'google' ? ' (use Google login)' : '';
//     return res.status(409).json({ message: `Email already in use${hint}` });
//   }

//   const hashed = await bcrypt.hash(password, 12);
//   const [user] = await db.insert(users).values({
//     email,
//     username,
//     password:     hashed,
//     authProvider: 'local',
//   }).returning();

//   // log them in immediately after register
//   req.login(user, (err) => {
//     if (err) return res.status(500).json({ message: 'Login after register failed' });
//     return res.status(201).json({ message: 'Registered successfully', user });
//   });
// };