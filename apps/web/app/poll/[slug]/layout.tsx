import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/api/polls/public/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const poll = await res.json();
      return {
        description: `Take the poll "${poll.title}" on Opinion. ${
          poll.description || 'Share your opinion anonymously or with authentication.'
        }`,
        openGraph: {
          description: `Take the poll "${poll.title}" on Opinion. Share your opinion.`,
          images: ['/og-image.png'],
          title: `${poll.title} - Opinion`,
        },
        title: poll.title,
      };
    }
  } catch {
    // intentional
  }

  return {
    description: 'Take a poll on Opinion. Share your opinion anonymously or with authentication.',
    title: 'Poll',
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
