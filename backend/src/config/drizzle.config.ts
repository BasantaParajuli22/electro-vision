import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config(); // ← load .env manually, don't rely on import

// schema: 'src/db/schema.ts', //for local development
// schema: 'dist/db/schema.js', //for production
export default {
  schema: 'src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config; 


//eg
  // dbCredentials: {
  //   host: 'localhost',
  //   port: 5432,
  //   user: 'store',
  //   password: 'store',
  //   database: 'store',
  //   ssl: false
  // },