"use client";

import { use, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "@/components/Charts";
import type { AnalyticsData } from "@opinion/shared";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Copy,
  Share2,
  CheckCircle2,
  Users,
  ShieldAlert,
  ShieldCheck,
  Clock,
  ExternalLink,
  Zap,
  Activity,
  TrendingUp,
  Calendar,
} from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 || 12;
  return i < 12 ? `${h}AM` : `${h}PM`;
});

function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatHoursAgo(hours: number): string {
  if (hours < 1) return "<1h ago";
  if (hours < 24) return `${Math.round(hours)}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [publishing, setPublishing] = useState(false);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    document.title = "Analytics - Opinion";
  }, []);

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics", id],
    queryFn: async () => {
      const { data } = await api.get<AnalyticsData>(`/polls/${id}/analytics`);
      return data;
    },
  });

  const { data: poll } = useQuery({
    queryKey: ["poll", id],
    queryFn: async () => {
      const { data } = await api.get(`/polls/${id}`);
      return data;
    },
  });

  useEffect(() => {
    const socket = getSocket();
    socket.emit("join:poll", id);

    socket.on("analytics:update", () => {
      queryClient.invalidateQueries({ queryKey: ["analytics", id] });
    });

    return () => {
      socket.emit("leave:poll", id);
      socket.off("analytics:update");
    };
  }, [id, queryClient]);

  async function handlePublish() {
    setPublishing(true);
    try {
      await api.put(`/polls/${id}/publish`);
      queryClient.invalidateQueries({ queryKey: ["poll", id] });
      toast.success("Results published");
    } catch {
      toast.error("Failed to publish");
    } finally {
      setPublishing(false);
    }
  }

  async function handleCopyLink() {
    if (!poll?.slug) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/poll/${poll.slug}`,
      );
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    } finally {
      setCopying(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Skeleton className="mb-10 h-10 w-64" />
        <div className="mb-10 grid grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  const anonPercent =
    analytics && analytics.totalResponses > 0
      ? Math.round(
          (analytics.participationInsights.anonymous /
            analytics.totalResponses) *
            100,
        )
      : 0;
  const authPercent = 100 - anonPercent;

  const peakHour = analytics?.engagement.peakActivity.hour ?? null;
  const peakDay = analytics?.engagement.peakActivity.dayOfWeek ?? null;
  const peakTime =
    peakHour !== null
      ? `${HOURS[peakHour]}${peakDay !== null ? " on " + DAYS[peakDay] : ""}`
      : "—";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            {poll?.title || "Poll Analytics"}
          </h1>
          <div className="mt-2 flex items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                className={`size-1.5 rounded-full ${poll?.status === "active" ? "bg-success" : "bg-muted-foreground"}`}
              />
              {poll?.status}
            </span>
            <span className="text-muted-foreground/50">/</span>
            <span className="flex items-center gap-1.5">
              <ExternalLink className="size-3" />
              /poll/{poll?.slug}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCopyLink} disabled={copying}>
            {copying ? (
              <CheckCircle2 className="mr-2 size-4 text-success" />
            ) : (
              <Copy className="mr-2 size-4" />
            )}
            Copy link
          </Button>
          {poll?.status !== "published" && (
            <Button onClick={handlePublish} disabled={publishing}>
              <Share2 className="mr-2 size-4" />
              {publishing ? "Publishing" : "Publish results"}
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-3">
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Responses
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-4xl font-bold tabular-nums">
              {analytics?.totalResponses ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Anonymous
            </CardTitle>
            <ShieldAlert className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-4xl font-bold tabular-nums">
              {analytics?.participationInsights?.anonymous ?? 0}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {anonPercent}% of responses
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Authenticated
            </CardTitle>
            <ShieldCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-4xl font-bold tabular-nums">
              {analytics?.participationInsights?.authenticated ?? 0}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {authPercent}% of responses
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Velocity
            </CardTitle>
            <Zap className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-3xl font-bold tabular-nums">
              {analytics?.engagement.responseVelocity ?? 0}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                /hr
              </span>
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              avg responses/hour
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              First Response
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-xl font-bold">
              {formatRelativeTime(analytics?.engagement.firstResponseAt ?? null)}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              after poll creation
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peak Activity
            </CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-xl font-bold">{peakTime}</p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              busiest time window
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/60 bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Created
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-xl font-bold">
              {formatHoursAgo(analytics?.pollHealth.hoursSinceCreation ?? 0)}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {analytics?.totalResponses ?? 0} responses gathered
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {analytics?.questionSummaries?.map((summary) => {
          const winner = summary.options.reduce((a, b) =>
            a.count > b.count ? a : b,
          );
          const winnerPercent =
            summary.totalAnswers > 0
              ? Math.round((winner.count / summary.totalAnswers) * 100)
              : 0;

          return (
            <Card
              key={summary.questionId}
              className="border-border/60 bg-card"
            >
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="font-heading text-xl leading-snug">
                    {summary.questionText}
                  </CardTitle>
                  <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Users className="size-3.5" />
                      {summary.totalAnswers} answers
                    </span>
                    <span className="text-muted-foreground/50">/</span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-success" />
                      {winner.option} leading at {winnerPercent}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={summary.options}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="option"
                        tick={{
                          fill: "currentColor",
                          opacity: 0.5,
                          fontSize: 12,
                        }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis
                        tick={{
                          fill: "currentColor",
                          opacity: 0.5,
                          fontSize: 12,
                        }}
                        axisLine={false}
                        tickLine={false}
                        dx={-10}
                      />
                      <Tooltip
                        cursor={{ fill: "var(--color-primary)", opacity: 0.05 }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid var(--color-border)",
                          backgroundColor: "var(--color-card)",
                          boxShadow:
                            "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="var(--color-primary)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={60}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {analytics?.timeline && analytics.timeline.length > 0 && (
        <Card className="mt-8 border-border/60 bg-card">
          <CardHeader className="border-b border-border/40 pb-4 flex flex-row items-center justify-between">
            <CardTitle className="font-heading text-xl">
              Responses over time
            </CardTitle>
            <Clock className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.timeline}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="date"
                    tick={{
                      fill: "currentColor",
                      opacity: 0.5,
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{
                      fill: "currentColor",
                      opacity: 0.5,
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-secondary)", opacity: 0.05 }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-card)",
                      boxShadow:
                        "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--color-secondary)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
