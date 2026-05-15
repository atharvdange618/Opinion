import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        allow: '/',
        disallow: ['/dashboard', '/polls/create', '/polls/*/edit', '/polls/*/analytics', '/api/'],
        userAgent: '*',
      },
    ],
    sitemap: 'https://opinion.atharvdangedev.in/sitemap.xml',
  };
}
