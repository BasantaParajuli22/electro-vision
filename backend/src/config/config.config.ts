import 'dotenv/config';

export const SERVER_BASE_URL = process.env.SERVER_BASE_URL || "http://localhost:5000";
export const FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL || "http://localhost:5173";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing from .env file");
}

export const DATABASE_URL = process.env.DATABASE_URL || ""; 
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET";