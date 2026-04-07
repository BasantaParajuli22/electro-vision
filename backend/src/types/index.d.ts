
// This is what gets attached to req.user
export interface MyUserType {
  id: number;
  username: string;
  googleId?: string | null;
  email: string;
  avatarUrl: string | null;
  password?: string | null;
  authProvider: string;
}

declare global {
  namespace Express {
    interface User extends MyUserType { }
  }
}
