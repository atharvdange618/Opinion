export function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Opinion",
    url: "https://opinion.atharvdangedev.in",
    applicationCategory: "WebApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    description:
      "Create polls, collect anonymous or verified feedback, and analyze responses in real-time.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "Anonymous or authenticated polling",
      "Live analytics dashboard",
      "Real-time collaboration",
      "Anti-spam protection",
      "Shareable poll links",
      "Auto-expiry for polls",
    ],
    author: {
      "@type": "Organization",
      name: "Opinion",
      url: "https://opinion.atharvdangedev.in",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
