import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

let pool: Pool | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb(databaseUrl = process.env.DATABASE_URL) {
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!pool) {
    pool = new Pool({ connectionString: databaseUrl });
    dbInstance = drizzle(pool, { schema });
  }

  return dbInstance!;
}
