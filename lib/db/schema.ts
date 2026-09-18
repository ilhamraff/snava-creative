import {
  pgTable,
  pgEnum,
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
   Enums
   ============================================================ */
export const enumSiteSettingsSocialLinksPlatform = pgEnum(
  'enum_site_settings_social_links_platform',
  [
    'Instagram',
    'LinkedIn',
    'Behance',
    'Dribbble',
    'YouTube',
    'Twitter',
    'Facebook',
    'GitHub',
    'TikTok',
    'Pinterest',
    'WhatsApp',
    'Telegram',
    'Threads',
  ]
)

export const enumAboutPageValuesIcon = pgEnum('enum_about_page_values_icon', [
  'Target',
  'Lightbulb',
  'Handshake',
  'Zap',
  'Heart',
  'Shield',
  'Star',
  'Rocket',
  'Users',
  'Trophy',
  'Palette',
  'Code',
])

/* ============================================================
   Site Settings Social Links
   ============================================================ */
export const siteSettingsSocialLinks = pgTable('site_settings_social_links', {
  order: integer('_order').notNull(),
  parentId: integer('_parent_id')
    .notNull()
    .references(() => siteSettings.id, { onDelete: 'cascade' }),
  id: varchar('id', { length: 255 }).primaryKey(),
  platform: enumSiteSettingsSocialLinksPlatform('platform').notNull(),
  url: varchar('url', { length: 1024 }).notNull(),
})

export type SiteSettingsSocialLink = typeof siteSettingsSocialLinks.$inferSelect
export type NewSiteSettingsSocialLink = typeof siteSettingsSocialLinks.$inferInsert

/* ============================================================
   About Page & Values
   ============================================================ */
export const aboutPage = pgTable('about_page', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  vision: text('vision'),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }),
})

export type AboutPage = typeof aboutPage.$inferSelect
export type NewAboutPage = typeof aboutPage.$inferInsert

export const aboutPageValues = pgTable('about_page_values', {
  order: integer('_order').notNull(),
  parentId: integer('_parent_id')
    .notNull()
    .references(() => aboutPage.id, { onDelete: 'cascade' }),
  id: varchar('id', { length: 255 }).primaryKey(),
  icon: enumAboutPageValuesIcon('icon').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
})

export type AboutPageValue = typeof aboutPageValues.$inferSelect
export type NewAboutPageValue = typeof aboutPageValues.$inferInsert

/* ============================================================
   Pricing Section
   ============================================================ */
export const pricingSection = pgTable('pricing_section', {
  id: serial('id').primaryKey(),
  headline: varchar('headline', { length: 500 }).notNull(),
  subheadline: text('subheadline').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }),
})

export type PricingSection = typeof pricingSection.$inferSelect
export type NewPricingSection = typeof pricingSection.$inferInsert

/* ============================================================
   Services Section
   ============================================================ */
export const servicesSection = pgTable('services_section', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }),
})

export type ServicesSection = typeof servicesSection.$inferSelect
export type NewServicesSection = typeof servicesSection.$inferInsert

/* ============================================================
   Services Sub-Arrays
   ============================================================ */
export const servicesPackages = pgTable('services_packages', {
  order: integer('_order').notNull(),
  parentId: integer('_parent_id')
    .notNull()
    .references(() => services.id, { onDelete: 'cascade' }),
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: numeric('price'),
  billingPeriod: varchar('billing_period', { length: 255 }),
  description: text('description'),
  isPopular: boolean('is_popular').default(false),
  isCustom: boolean('is_custom').default(false),
})

export type ServicePackage = typeof servicesPackages.$inferSelect
export type NewServicePackage = typeof servicesPackages.$inferInsert

export const servicesPackagesFeatures = pgTable(
  'services_packages_features',
  {
    order: integer('_order').notNull(),
    parentId: varchar('_parent_id', { length: 255 })
      .notNull()
      .references(() => servicesPackages.id, { onDelete: 'cascade' }),
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    included: boolean('included').default(true),
  }
)

export type ServicePackageFeature =
  typeof servicesPackagesFeatures.$inferSelect
export type NewServicePackageFeature =
  typeof servicesPackagesFeatures.$inferInsert

export const servicesProblems = pgTable('services_problems', {
  order: integer('_order').notNull(),
  parentId: integer('_parent_id')
    .notNull()
    .references(() => services.id, { onDelete: 'cascade' }),
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
})

export type ServiceProblem = typeof servicesProblems.$inferSelect
export type NewServiceProblem = typeof servicesProblems.$inferInsert

export const servicesCapabilities = pgTable('services_capabilities', {
  order: integer('_order').notNull(),
  parentId: integer('_parent_id')
    .notNull()
    .references(() => services.id, { onDelete: 'cascade' }),
  id: varchar('id', { length: 255 }).primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 100 }),
})

export type ServiceCapability = typeof servicesCapabilities.$inferSelect
export type NewServiceCapability = typeof servicesCapabilities.$inferInsert

export const servicesFaqs = pgTable('services_faqs', {
  order: integer('_order').notNull(),
  parentId: integer('_parent_id')
    .notNull()
    .references(() => services.id, { onDelete: 'cascade' }),
  id: varchar('id', { length: 255 }).primaryKey(),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
})

export type ServiceFaq = typeof servicesFaqs.$inferSelect
export type NewServiceFaq = typeof servicesFaqs.$inferInsert

/* ============================================================
   Portfolio Relationships (e.g. relatedServices)
   ============================================================ */
export const portfolioRels = pgTable('portfolio_rels', {
  id: serial('id').primaryKey(),
  order: integer('order'),
  parentId: integer('parent_id')
    .notNull()
    .references(() => portfolio.id, { onDelete: 'cascade' }),
  path: varchar('path', { length: 255 }).notNull().default('relatedServices'),
  servicesId: integer('services_id').references(() => services.id, {
    onDelete: 'cascade',
  }),
})

export type PortfolioRel = typeof portfolioRels.$inferSelect
export type NewPortfolioRel = typeof portfolioRels.$inferInsert

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

export const portfolioRelations = relations(portfolio, ({ one, many }) => ({
  category: one(categories, {
    fields: [portfolio.categoryId],
    references: [categories.id],
  }),
  thumbnail: one(media, {
    fields: [portfolio.thumbnailId],
    references: [media.id],
  }),
  relatedServices: many(portfolioRels),
}))

export const portfolioRelsRelations = relations(portfolioRels, ({ one }) => ({
  portfolio: one(portfolio, {
    fields: [portfolioRels.parentId],
    references: [portfolio.id],
  }),
  service: one(services, {
    fields: [portfolioRels.servicesId],
    references: [services.id],
  }),
}))

export const servicesRelations = relations(services, ({ one, many }) => ({
  heroImage: one(media, {
    fields: [services.heroImageId],
    references: [media.id],
  }),
  packages: many(servicesPackages),
  problems: many(servicesProblems),
  capabilities: many(servicesCapabilities),
  faqs: many(servicesFaqs),
  portfolioRels: many(portfolioRels),
}))

export const servicesPackagesRelations = relations(
  servicesPackages,
  ({ one, many }) => ({
    service: one(services, {
      fields: [servicesPackages.parentId],
      references: [services.id],
    }),
    features: many(servicesPackagesFeatures),
  })
)

export const servicesPackagesFeaturesRelations = relations(
  servicesPackagesFeatures,
  ({ one }) => ({
    package: one(servicesPackages, {
      fields: [servicesPackagesFeatures.parentId],
      references: [servicesPackages.id],
    }),
  })
)

export const servicesProblemsRelations = relations(
  servicesProblems,
  ({ one }) => ({
    service: one(services, {
      fields: [servicesProblems.parentId],
      references: [services.id],
    }),
  })
)

export const servicesCapabilitiesRelations = relations(
  servicesCapabilities,
  ({ one }) => ({
    service: one(services, {
      fields: [servicesCapabilities.parentId],
      references: [services.id],
    }),
  })
)

export const servicesFaqsRelations = relations(servicesFaqs, ({ one }) => ({
  service: one(services, {
    fields: [servicesFaqs.parentId],
    references: [services.id],
  }),
}))

export const siteSettingsRelations = relations(siteSettings, ({ one, many }) => ({
  logo: one(media, {
    fields: [siteSettings.logoId],
    references: [media.id],
  }),
  socialLinks: many(siteSettingsSocialLinks),
}))

export const siteSettingsSocialLinksRelations = relations(
  siteSettingsSocialLinks,
  ({ one }) => ({
    siteSetting: one(siteSettings, {
      fields: [siteSettingsSocialLinks.parentId],
      references: [siteSettings.id],
    }),
  })
)

export const aboutPageRelations = relations(aboutPage, ({ many }) => ({
  values: many(aboutPageValues),
}))

export const aboutPageValuesRelations = relations(
  aboutPageValues,
  ({ one }) => ({
    aboutPage: one(aboutPage, {
      fields: [aboutPageValues.parentId],
      references: [aboutPage.id],
    }),
  })
)

