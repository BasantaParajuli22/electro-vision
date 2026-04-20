import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

// Hardcoded connection string
// const connectionString = 'postgresql://store:store@localhost:5432/store'; 

export const pool = new pg.Pool({
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!, 10),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
});

// The `schema` object is important for relations to work
export const db = drizzle(pool, { schema });

// Export pool for session store
export { pool as sessionPool }; 