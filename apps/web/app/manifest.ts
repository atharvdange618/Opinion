import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#ffffff',
    description:
      'Create polls, collect anonymous or verified feedback, and analyze responses in real-time.',
    display: 'standalone',
    icons: [
      {
        sizes: 'any',
        src: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    name: 'Opinion - Create & Share Polls',
    short_name: 'Opinion',
    start_url: '/',
    theme_color: '#1a1a2e',
  };
}
