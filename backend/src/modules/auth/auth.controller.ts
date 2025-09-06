import { Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';

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
  failureRedirect: `${FRONTEND_BASE_URL}/login`, // Redirect on authentication failure
});

// Renders a basic login page
export const loginPage = (req: Request, res: Response) => {
  res.send(`
    <h1>Login Page</h1>
    <p>Please log in with your Google account.</p>
    <a href="/auth/google">Login with Google</a>
  `);
};

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

