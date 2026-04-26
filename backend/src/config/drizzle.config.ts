import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { DATABASE_URL } from './config.config';

dotenv.config(); // load .env manually

// schema: 'src/db/schema.ts', //for local development
// schema: 'dist/db/schema.js', //for production

export default {
  schema: 'src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: DATABASE_URL,
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

  //or dbCredentials: {
  // url: "database url of postgres"
  // }