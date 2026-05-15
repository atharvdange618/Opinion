'use client';

import { RotateCcw } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: { digest?: string } & Error;
  reset: () => void;
}) {
  useEffect(() => {
    document.title = 'Error - Opinion';
  }, []);

  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <svg
          aria-hidden="true"
          className="mx-auto size-32 text-muted-foreground"
          fill="none"
          viewBox="0 0 200 160"
        >
          <rect
            className="fill-destructive/10 stroke-destructive/30"
            height="100"
            rx="10"
            strokeWidth="2"
            width="140"
            x="30"
            y="30"
          />
          <rect className="fill-destructive/30" height="6" rx="3" width="90" x="55" y="55" />
          <rect className="fill-destructive/20" height="6" rx="3" width="70" x="55" y="75" />
          <rect className="fill-destructive/20" height="6" rx="3" width="40" x="55" y="95" />
          <path className="fill-warning/50" d="M100 10 L110 30 L90 30 Z" />
        </svg>
        <h1 className="mt-6 font-heading text-3xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <Button className="mt-8" onClick={reset}>
          <RotateCcw className="mr-2 size-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
