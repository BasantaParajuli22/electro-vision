
// This is what gets attached to req.user by Passport.
export interface MyUserType{
    id: number,    // The correct type for your Drizzle-ORM schema
    username: string,
    googleId?: string | null, //googleId can be null in your table
    email: string,
    avatarUrl: string | null,
}

declare global {
  namespace Express {
    interface User extends MyUserType { }
  }
}
