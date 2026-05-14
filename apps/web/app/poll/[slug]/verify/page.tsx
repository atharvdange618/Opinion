'use client';

import { use, useEffect, useState, useRef } from 'react';
import { ShieldCheck, RotateCcw, ArrowLeft } from 'lucide-react';
import { TurnstileWidget } from '@/components/TurnstileWidget';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VerifyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [state, setState] = useState<'waiting' | 'verifying' | 'done' | 'error'>('waiting');
  const [error, setError] = useState<string | null>(null);
  const redirectingRef = useRef(false);

  useEffect(() => {
    document.title = "Verifying you're human - Opinion";
  }, []);

  const handleVerify = async (token: string) => {
    if (redirectingRef.current) return;
    setState('verifying');
    setError(null);

    try {
      await api.post(`/polls/public/${slug}/verify`, { turnstileToken: token });
      setState('done');
      redirectingRef.current = true;
      setTimeout(() => {
        window.location.href = `/poll/${slug}`;
      }, 800);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setState('error');
      setError(
        error?.response?.data?.message || error?.message || 'Verification failed. Please try again.',
      );
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative flex size-20 items-center justify-center rounded-2xl bg-primary/[0.06] ring-1 ring-primary/10">
            {state === 'done' ? (
              <ShieldCheck className="size-9 text-success animate-scale-in" />
            ) : (
              <div className="relative flex size-9 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <ShieldCheck className="size-9 text-primary" />
              </div>
            )}
          </div>
        </div>

        <h1 className="mb-2 font-heading text-xl font-semibold tracking-tight text-foreground">
          {state === 'done'
            ? 'Verified!'
            : state === 'error'
              ? 'Verification failed'
              : 'Verifying you\u2019re human'}
        </h1>

        <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
          {state === 'done'
            ? 'Redirecting you to the poll...'
            : state === 'error'
              ? error
              : 'Complete the security check to access this poll.'}
        </p>

        {state === 'waiting' && (
          <div className="flex justify-center">
              <TurnstileWidget onVerify={(token) => { void handleVerify(token); }} />
          </div>
        )}

        {state === 'verifying' && (
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="size-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              Checking...
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="space-y-4">
            <div className="flex justify-center">
            <TurnstileWidget onVerify={(token) => { void handleVerify(token); }} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setState('waiting');
                setError(null);
              }}
            >
              <RotateCcw className="mr-2 size-3.5" />
              Try again
            </Button>
          </div>
        )}

        {state === 'done' && (
          <p className="text-xs text-muted-foreground">
            <Link href={`/poll/${slug}`} className="underline-offset-2 hover:underline">
              Not redirecting? Click here.
            </Link>
          </p>
        )}

        <div className="mt-8 border-t border-border/30 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="size-3" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
