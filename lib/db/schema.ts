import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  numeric,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

/* ============================================================
   Categories
   ============================================================ */
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert

/* ============================================================
   Media
   ============================================================ */
export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  alt: varchar('alt', { length: 255 }).notNull(),
  url: varchar('url', { length: 1024 }),
  thumbnailUrl: varchar('thumbnail_u_r_l', { length: 1024 }),
  filename: varchar('filename', { length: 255 }),
  mimeType: varchar('mime_type', { length: 100 }),
  filesize: numeric('filesize'),
  width: numeric('width'),
  height: numeric('height'),
  prefix: varchar('prefix', { length: 100 }).default('media'),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type MediaItem = typeof media.$inferSelect
export type NewMediaItem = typeof media.$inferInsert

/* ============================================================
   Portfolio
   ============================================================ */
export const portfolio = pgTable('portfolio', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  thumbnailId: integer('thumbnail_id')
    .notNull()
    .references(() => media.id),
  description: text('description'),
  client: varchar('client', { length: 255 }),
  year: varchar('year', { length: 10 }),
  isFeatured: boolean('is_featured').default(true),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type PortfolioItem = typeof portfolio.$inferSelect
export type NewPortfolioItem = typeof portfolio.$inferInsert

/* ============================================================
   Services
   ============================================================ */
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  category: varchar('category', { length: 255 }),
  description: text('description'),
  icon: varchar('icon', { length: 100 }),
  isActive: boolean('is_active').default(true),
  sortOrder: varchar('sort_order', { length: 10 }).default('1'),
  heroHeadline: varchar('hero_headline', { length: 500 }),
  heroDescription: text('hero_description'),
  heroImageId: integer('hero_image_id').references(() => media.id),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type Service = typeof services.$inferSelect
export type NewService = typeof services.$inferInsert

/* ============================================================
   Testimonials
   ============================================================ */
export const testimonials = pgTable('testimonials', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  content: text('content').notNull(),
  rating: numeric('rating').default('5'),
  isFeatured: boolean('is_featured').default(true),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export type Testimonial = typeof testimonials.$inferSelect
export type NewTestimonial = typeof testimonials.$inferInsert

/* ============================================================
   Hero Section
   ============================================================ */
export const heroSection = pgTable('hero_section', {
  id: serial('id').primaryKey(),
  headline: varchar('headline', { length: 500 }).notNull(),
  subheadline: text('subheadline').notNull(),
  ctaPrimaryLabel: varchar('cta_primary_label', { length: 100 }).notNull(),
  ctaPrimaryUrl: varchar('cta_primary_url', { length: 255 }).notNull(),
  ctaSecondaryLabel: varchar('cta_secondary_label', { length: 100 }).notNull(),
  ctaSecondaryUrl: varchar('cta_secondary_url', { length: 255 }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }),
})

export type HeroSection = typeof heroSection.$inferSelect
export type NewHeroSection = typeof heroSection.$inferInsert

/* ============================================================
   Site Settings
   ============================================================ */
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  siteName: varchar('site_name', { length: 255 }).notNull(),
  tagline: varchar('tagline', { length: 255 }),
  logoId: integer('logo_id').references(() => media.id),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  whatsappNumber: varchar('whatsapp_number', { length: 50 }),
  whatsappMessage: text('whatsapp_message'),
  address: text('address'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }),
})

export type SiteSettings = typeof siteSettings.$inferSelect
export type NewSiteSettings = typeof siteSettings.$inferInsert

/* ============================================================
   Relations
   ============================================================ */
export const categoriesRelations = relations(categories, ({ many }) => ({
  portfolios: many(portfolio),
}))

export const mediaRelations = relations(media, ({ many }) => ({
  portfolios: many(portfolio),
  services: many(services),
}))

export const portfolioRelations = relations(portfolio, ({ one }) => ({
  category: one(categories, {
    fields: [portfolio.categoryId],
    references: [categories.id],
  }),
  thumbnail: one(media, {
    fields: [portfolio.thumbnailId],
    references: [media.id],
  }),
}))

export const servicesRelations = relations(services, ({ one }) => ({
  heroImage: one(media, {
    fields: [services.heroImageId],
    references: [media.id],
  }),
}))

export const siteSettingsRelations = relations(siteSettings, ({ one }) => ({
  logo: one(media, {
    fields: [siteSettings.logoId],
    references: [media.id],
  }),
}))
