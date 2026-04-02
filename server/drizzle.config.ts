import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  schema: './src/database/schemas',
  out: './drizzle',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/proof_pulse',
  },
} satisfies Config;
