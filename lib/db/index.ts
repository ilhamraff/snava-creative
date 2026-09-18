import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * Drizzle ORM client.
 *
 * Uses the same DATABASE_URL (transaction-mode pooler) that Payload
 * previously used. Connection is cached via module-level singleton
 * to avoid creating multiple pools during Next.js hot-reload.
 */

const connectionString = process.env.DATABASE_URL!

// Connection pool — prepare: false is required for transaction-mode poolers
const client = postgres(connectionString, { prepare: false })

export const db = drizzle(client, { schema })
