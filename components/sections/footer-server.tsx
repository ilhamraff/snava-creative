import { getSiteSettings, getFooterData } from '@/lib/data/get-site-settings'
import { FooterSection } from './footer'

/**
 * Server Component wrapper that fetches site settings and footer data
 * from Payload CMS, then passes them as props to the client FooterSection.
 */
export async function FooterSectionServer() {
  const [settings, footerData] = await Promise.all([
    getSiteSettings(),
    getFooterData(),
  ])
  return <FooterSection siteSettings={settings} footerData={footerData} />
}
