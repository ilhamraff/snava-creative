import { getServicesData } from '@/lib/data/get-services'
import { ServicesSection } from './services'

/**
 * Server Component wrapper that fetches Services data from Payload CMS
 * and passes it down to the client component.
 */
export async function ServicesSectionServer() {
  const { title, description, services } = await getServicesData()
  return <ServicesSection title={title} description={description} services={services} />
}
