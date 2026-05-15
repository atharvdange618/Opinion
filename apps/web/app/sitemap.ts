import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: 'weekly',
      lastModified: new Date(),
      priority: 1,
      url: 'https://opinion.atharvdangedev.in',
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: 'https://opinion.atharvdangedev.in/privacy',
    },
    {
      changeFrequency: 'monthly',
      lastModified: new Date(),
      priority: 0.3,
      url: 'https://opinion.atharvdangedev.in/terms',
    },
  ];
}
