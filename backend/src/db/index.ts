import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

// Hardcoded connection string (as requested, replace with environment variables in production)
const connectionString = 'postgresql://store:store@localhost:5432/store'; 

export const pool = new pg.Pool({
  connectionString,
});

// The `schema` object is important for relations to work
export const db = drizzle(pool, { schema });

// Export pool for session store
export { pool as sessionPool }; 