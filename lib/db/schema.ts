/**
 * Drizzle ORM schema.
 *
 * This is a placeholder. When migrating data fetchers from static fallback
 * to live database queries, define tables here matching the existing
 * Supabase Postgres tables (previously managed by Payload CMS).
 *
 * Example:
 *
 *   import { pgTable, text, serial, boolean, timestamp } from 'drizzle-orm/pg-core'
 *
 *   export const portfolio = pgTable('portfolio', {
 *     id: serial('id').primaryKey(),
 *     title: text('title').notNull(),
 *     slug: text('slug').notNull().unique(),
 *     description: text('description'),
 *     isFeatured: boolean('is_featured').default(false),
 *     createdAt: timestamp('created_at').defaultNow(),
 *     updatedAt: timestamp('updated_at').defaultNow(),
 *   })
 */

export {}
