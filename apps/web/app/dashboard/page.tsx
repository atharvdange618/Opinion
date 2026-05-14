'use client';

import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyPolls } from '@/components/illustrations/EmptyPolls';
import { Plus, BarChart3, Pencil, Users, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PollSummary {
  _id: string;
  title: string;
  slug: string;
  status: string;
  responseMode: string;
  expiresAt: string;
  responseCount: number;
  createdAt: string;
}

export default function DashboardPage() {
  useEffect(() => {
    document.title = 'My Polls - Opinion';
  }, []);

  const { data: polls, isLoading } = useQuery<PollSummary[]>({
    queryKey: ['my-polls'],
    queryFn: async () => {
      const { data } = await api.get('/polls');
      return data;
    },
  });

  const stats = useMemo(() => {
    if (!polls) return { total: 0, responses: 0, active: 0 };
    return {
      total: polls.length,
      responses: polls.reduce((acc, p) => acc + p.responseCount, 0),
      active: polls.filter((p) => p.status === 'active').length,
    };
  }, [polls]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Manage your polls and track feedback.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/polls/create">
            <Plus className="mr-2 size-5" />
            Create Poll
          </Link>
        </Button>
      </div>

      <div className="mb-12 flex flex-wrap gap-x-10 gap-y-2 rounded-xl border border-border/40 bg-card px-7 py-5">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-muted-foreground">Total polls</span>
          {isLoading ? (
            <Skeleton className="h-6 w-10" />
          ) : (
            <span className="font-heading text-xl font-semibold tabular-nums text-foreground">
              {stats.total}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <Users className="size-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Responses</span>
          {isLoading ? (
            <Skeleton className="h-6 w-14" />
          ) : (
            <span className="font-heading text-xl font-semibold tabular-nums text-foreground">
              {stats.responses}
            </span>
          )}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="flex size-2 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Active</span>
          {isLoading ? (
            <Skeleton className="h-6 w-8" />
          ) : (
            <span className="font-heading text-xl font-semibold tabular-nums text-foreground">
              {stats.active}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/60 bg-card">
              <CardHeader>
                <Skeleton className="mb-2 h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : polls && polls.length === 0 ? (
        <Card className="border-dashed border-border/60 bg-transparent py-20 shadow-none">
          <CardContent className="flex flex-col items-center gap-5 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <EmptyPolls />
            </div>
            <div>
              <CardTitle className="font-heading text-2xl">No polls yet</CardTitle>
              <CardDescription className="mt-2 text-base">
                Create your first poll to start collecting feedback.
              </CardDescription>
            </div>
            <Button size="lg" className="mt-2" asChild>
              <Link href="/polls/create">
                <Plus className="mr-2 size-5" />
                Create your first poll
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {polls?.map((poll) => (
            <Card
              key={poll._id}
              className="group relative flex flex-col justify-between border-border/60 bg-card"
            >
              <CardHeader className="pb-3">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <Badge
                    className="border text-[10px] font-semibold uppercase tracking-widest"
                    variant="outline"
                  >
                    {poll.status}
                  </Badge>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3.5" />
                    {poll.responseCount}
                  </span>
                </div>
                <CardTitle className="font-heading text-lg leading-snug group-hover:text-primary transition-colors">
                  {poll.title}
                </CardTitle>
                <CardDescription className="mt-1.5 font-mono text-xs">
                  opinion.com/{poll.slug}
                </CardDescription>
              </CardHeader>

              <CardContent className="mt-auto border-t border-border/40 pt-4">
                <div className="flex items-center gap-2">
                  <Button variant="default" size="sm" className="flex-1" asChild>
                    <Link href={`/polls/${poll._id}/analytics`}>
                      <BarChart3 className="mr-1.5 size-3.5" />
                      Analytics
                    </Link>
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/polls/${poll._id}/edit`}>
                          <Pencil className="size-3.5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Edit poll</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/poll/${poll.slug}`} target="_blank">
                          <ExternalLink className="size-3.5" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">View public page</TooltipContent>
                  </Tooltip>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
