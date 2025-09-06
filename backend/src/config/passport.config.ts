import passport from "passport";
import passportGoogle, { Profile, VerifyCallback } from "passport-google-oauth20";
import { eq } from "drizzle-orm";

import { MyUserType } from "../types/index";
import { db } from "../db/index";
import { users } from "../db/schema";

const GoogleStrategy = passportGoogle.Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET";
const SERVER_BASE_URL = process.env.SERVER_BASE_URL || "http://localhost:5000";


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
      callbackURL:  `${SERVER_BASE_URL}/auth/google/callback`, //redirects user to this after login
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        //check for existing user 
        const user = await db.select().from(users).where(eq(users.googleId, profile.id)).limit(1);
        
        if (user.length > 0) {
          // If the user exists, return the user object
          return done(null, user[0]);
        }

        // If the user does not exist, create a new user record
        const newUser = {
          googleId: profile.id,
          username: profile.displayName || "no_name",
          email: profile.emails?.[0].value || "no email defined",
          avatarUrl: profile.photos?.[0].value,
        };

        //inset user
        const createdUser = await db.insert(users).values(newUser).returning();
        
        // Return the newly created user object
        return done(null, createdUser[0]);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);