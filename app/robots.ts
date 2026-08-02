import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Mencegah bot mengindeks halaman admin CMS & rute API
    },
    sitemap: 'https://www.snavacreative.id/sitemap.xml',
  }
}
