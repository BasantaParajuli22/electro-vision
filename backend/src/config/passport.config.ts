import passport from "passport";
import passportGoogle, { Profile, VerifyCallback } from "passport-google-oauth20";
import { eq } from "drizzle-orm";
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';  

import { MyUserType } from "../types/index";
import { db } from "../db/index";
import { users } from "../db/schema";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, SERVER_BASE_URL } from "./config.config";


// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID";
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET";


const GoogleStrategy = passportGoogle.Strategy;


// Takes the full user object and stores only the user ID
//Sessions should be lightweight //later we use this id to get full user when its needed
passport.serializeUser((user: MyUserType, done) => {
  done(null, user.id); //serialize id
});


//Reconstruct full user object from session ID
//session id was serialized when logging 
//Taking the stored user id from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
    // Check if the user was found
    if (user.length > 0) {
      // User found, pass the user object to done
      return done(null, user[0]); 
    } else {
      // User not found for this id, signal this to Passport with 'false'
      return done(null, false); 
    }
  } catch (err) {
    done(err);
  }
});


passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${SERVER_BASE_URL}/auth/google/callback`,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const googleEmail = profile.emails?.[0].value || "no email defined";

        // 1. Returning Google user — find by googleId
        const user = await db.select().from(users).where(eq(users.googleId, profile.id)).limit(1);
        if (user.length > 0) {
          return done(null, user[0]);
        }

        // 2. Email already exists from a local signup — block it
        const existingByEmail = await db.select().from(users).where(eq(users.email, googleEmail)).limit(1);
        if (existingByEmail.length > 0) {
          return done(null, false, {
            message: "This email is already registered with a password. Please log in with email and password.",
          });
        }

        // 3. Brand new user — create them
        const newUser = {
          googleId:     profile.id,
          username:     profile.displayName || "no_name",
          email:        googleEmail,
          avatarUrl:    profile.photos?.[0].value,
          authProvider: "google",
        };

        const createdUser = await db.insert(users).values(newUser).returning();
        return done(null, createdUser[0]);

      } catch (err) {
        return done(err as Error);
      }
    }
  )
);


// Local Strategy (new) 
//for also allowing local login (using email and password)
passport.use('local', new LocalStrategy(
  { usernameField: 'email' },   // we use email, not username
  async (email, password, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));

      if (!user)
        return done(null, false, { message: 'No account found with that email' });

      if (user.authProvider === 'google')
        return done(null, false, { message: 'This email is registered with Google. Use Google login.' });

      if (!user.password)
        return done(null, false, { message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (e) { return done(e); }
  }
));