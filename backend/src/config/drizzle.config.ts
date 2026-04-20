import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

// schema: 'src/db/schema.ts', //for local development

export default {
  schema: 'dist/db/schema.js',
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