import { MetadataRoute } from 'next'
import { getSupabase } from '@/utils/supabase/client'

// Since we are in a static context or standard App Router, 
// we will fetch the slugs to build the XML dynamically.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ncsstat.ncskit.org'
  
  // Static Routes
  const staticRoutes = [
    '',
    '/analyze',
    '/analyze2',
    '/scales',
    '/knowledge',
    '/docs/theory',
    '/docs/case-study',
    '/docs/user-guide',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic Routes for Knowledge Articles
  // We list the 11 Authority Slugs here as well to guarantee they are indexed even if DB is offline during build
  const knowledgeSlugs = [
    'cronbach-alpha',
    'efa-factor-analysis',
    'regression-vif-multicollinearity',
    'descriptive-statistics-interpretation',
    'independent-t-test-guide',
    'one-way-anova-post-hoc',
    'pearson-correlation-analysis',
    'chi-square-test-independence',
    'mediation-analysis-sobel-test',
    'data-cleaning-outliers-detection',
    'sem-cfa-structural-modeling'
  ]

  const knowledgeRoutes = knowledgeSlugs.map((slug) => ({
    url: `${baseUrl}/knowledge/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...knowledgeRoutes]
}
