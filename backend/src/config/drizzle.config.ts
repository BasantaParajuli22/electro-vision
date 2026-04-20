import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

// schema: 'src/db/schema.ts', //for local development

export default {
  schema: 'dist/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: false
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