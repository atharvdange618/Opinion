export function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    applicationCategory: 'WebApplication',
    author: {
      '@type': 'Organization',
      name: 'Opinion',
      url: 'https://opinion.atharvdangedev.in',
    },
    browserRequirements: 'Requires JavaScript',
    description:
      'Create polls, collect anonymous or verified feedback, and analyze responses in real-time.',
    featureList: [
      'Anonymous or authenticated polling',
      'Live analytics dashboard',
      'Real-time collaboration',
      'Anti-spam protection',
      'Shareable poll links',
      'Auto-expiry for polls',
    ],
    name: 'Opinion',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    operatingSystem: 'All',
    url: 'https://opinion.atharvdangedev.in',
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      type="application/ld+json"
    />
  );
}
