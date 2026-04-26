import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';
import 'dotenv/config';
import { DATABASE_URL } from '../config/config.config';



export const pool = new pg.Pool({
  connectionString: DATABASE_URL
});

// The `schema` object is important for relations to work
export const db = drizzle(pool, { schema });

// Export pool for session store //not used for now
// export { pool as sessionPool }; 




// for neon postgresdb
//  didnot connect using this code//

// import { Pool } from "pg";
// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import * as schema from "./schema";
// import * as dotenv from 'dotenv';
// dotenv.config(); // ← load .env manually, don't rely on import


// // For session store (needs a real pool)
// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }, // required for Neon
// });

// // For drizzle queries
// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql, { schema });

// export { pool as sessionPool };





// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import * as schema from "./schema";
// import * as dotenv from 'dotenv';
// dotenv.config(); // ← load .env manually, don't rely on import

// const sql = neon(process.env.DATABASE_URL!);
// export const db = drizzle(sql, { schema });