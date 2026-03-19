import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/dashboard/', '/flows/', '/runs/', '/settings/', '/monitoring/', '/api-keys/', '/webhooks/', '/integrations/', '/mcp/', '/proxies/', '/secrets/', '/sessions/', '/api-versions/', '/sso/', '/api-logs/', '/audit-log/', '/analytics/', '/usage/', '/reports/', '/marketplace/', '/playground/', '/workflow-builder/', '/graphql/', '/pipelines/', '/flows/generate/', '/flows/share/', '/templates/'],
      },
    ],
    sitemap: 'https://scraper.bot/sitemap.xml',
  }
}
