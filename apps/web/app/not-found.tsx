import type { Metadata } from 'next';

import { Home } from 'lucide-react';
import Link from 'next/link';

import { NotFoundArt } from '@/components/illustrations/NotFoundArt';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  description: "The page you're looking for doesn't exist on Opinion.",
  title: '404 - Page Not Found',
};

export default function NotFound() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <NotFoundArt />
        <h1 className="mt-6 font-heading text-4xl font-semibold">404</h1>
        <p className="mt-2 text-muted-foreground">This page doesn&apos;t exist.</p>
        <Button asChild className="mt-8">
          <Link href="/">
            <Home className="mr-2 size-4" />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  );
}
