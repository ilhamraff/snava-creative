/**
 * Fetch a single service by slug.
 *
 * TODO: Migrate to direct Supabase/Drizzle query.
 * Currently returns null (no CMS available).
 */
export async function getServiceBySlug(slug: string): Promise<Record<string, any> | null> {
  // Will be replaced with Drizzle query
  return null
}

/**
 * Fetch related services (excluding the current one).
 *
 * TODO: Migrate to direct Supabase/Drizzle query.
 */
export async function getRelatedServices(currentSlug: string, limit = 3): Promise<any[]> {
  // Will be replaced with Drizzle query
  return []
}
