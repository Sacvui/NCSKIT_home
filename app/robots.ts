import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/', '/login/'],
    },
    sitemap: 'https://ncskit.org/sitemap.xml',
  }
}
