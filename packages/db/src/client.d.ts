import { Pool } from 'pg';
import * as schema from './schema';
export declare function getDb(databaseUrl?: string | undefined): import("drizzle-orm/node-postgres").NodePgDatabase<typeof schema> & {
    $client: Pool;
};
