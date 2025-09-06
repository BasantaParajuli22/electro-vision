import { Router } from 'express';
import { MyUserType } from '../../types/index'; // Your user type

const router = Router();

router.get('/me', (req, res) => {
  // Passport attaches the user to `req.user` if a session is valid
  if (req.user) {
    // The user is authenticated, send their data as JSON
    const user = req.user as MyUserType;

    // Map your database user fields to what the frontend expects
    const userDataForFrontend = {
      id: user.googleId,          // your primary key is
      displayName: user.username, // Or displayName
      email: user.email,
      avatar: user.avatarUrl,
    };

    res.status(200).json({ user: userDataForFrontend });
  } else {
    // The user is not authenticated
    res.status(401).json({ user: null, message: 'Not authorized' });
  }
});


export default router;