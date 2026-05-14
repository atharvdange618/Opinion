"use client";

import { use, useEffect, useMemo, useState } from "react";
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
  AreaChart,
  Area,
  CartesianGrid,
  Cell,
} from "@/components/Charts";
import type { AnalyticsData } from "@opinion/shared";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Copy,
  ShareNetwork,
  CheckCircle,
  Users,
  Clock,
  TrendDown,
  ArrowUpRight,
  Eye,
  ActivityIcon,
  ShieldCheck,
  Shield,
} from "@phosphor-icons/react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const h = i % 12 || 12;
  return i < 12 ? `${h}AM` : `${h}PM`;
});

function formatHoursAgo(hours: number): string {
  if (hours < 1) return "< 1h ago";
  if (hours < 24) return `${Math.round(hours)}h ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "1 day ago" : `${days} days ago`;
}

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

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

  const anonPercent = useMemo(() => {
    if (!analytics || analytics.totalResponses === 0) return 0;
    return Math.round(
      (analytics.participationInsights.anonymous / analytics.totalResponses) *
        100,
    );
  }, [analytics]);

  const authPercent = 100 - anonPercent;

  const peakHour = analytics?.engagement.peakActivity.hour ?? null;
  const peakDay = analytics?.engagement.peakActivity.dayOfWeek ?? null;
  const peakTime =
    peakHour !== null
      ? `${HOURS[peakHour]}${peakDay !== null ? " on " + DAYS[peakDay] : ""}`
      : null;

  const totalQuestions = analytics?.questionSummaries.length ?? 0;
  const maxVotes = analytics?.pollHealth.votesPerQuestion
    ? Math.max(
        ...analytics.pollHealth.votesPerQuestion.map((q) => q.totalAnswers),
      )
    : 0;

  const dropOff =
    totalQuestions > 1 && maxVotes > 0
      ? Math.round(
          ((maxVotes -
            (analytics?.pollHealth.votesPerQuestion?.[totalQuestions - 1]
              ?.totalAnswers ?? 0)) /
            maxVotes) *
            100,
        )
      : null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <Skeleton className="mb-4 h-10 w-72" />
        <div className="mb-16 grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="mb-8 h-72 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <header className="mb-16 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-4xl font-semibold tracking-tight">
            {poll?.title || "Poll Analytics"}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                className={`size-1.5 rounded-full ${
                  poll?.status === "active"
                    ? "bg-success"
                    : "bg-muted-foreground"
                }`}
              />
              {poll?.status}
            </span>
            <span className="text-muted-foreground/30">/</span>
            <a
              href={`/poll/${poll?.slug}`}
              className="flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <ArrowUpRight weight="bold" className="size-3" />
              /poll/{poll?.slug}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleCopyLink} disabled={copying}>
            {copying ? (
              <CheckCircle className="mr-2 size-4 text-success" weight="bold" />
            ) : (
              <Copy className="mr-2 size-4" weight="bold" />
            )}
            Copy link
          </Button>
          {poll?.status !== "published" && (
            <Button onClick={handlePublish} disabled={publishing}>
              <ShareNetwork className="mr-2 size-4" weight="bold" />
              {publishing ? "Publishing" : "Publish results"}
            </Button>
          )}
        </div>
      </header>

      <section className="mb-16">
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/40 bg-border/40 sm:grid-cols-12">
          <div className="col-span-12 bg-card px-8 py-7 sm:col-span-5">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users weight="bold" className="size-4" />
              Total Responses
            </p>
            <p className="mt-2 font-heading text-5xl font-semibold tabular-nums tracking-tight text-foreground">
              {analytics?.totalResponses ?? 0}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield weight="bold" className="size-3" />
                {analytics?.participationInsights.anonymous ?? 0} anonymous
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck weight="bold" className="size-3" />
                {analytics?.participationInsights.authenticated ?? 0}{" "}
                authenticated
              </span>
            </div>
            {analytics && analytics.totalResponses > 0 && (
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-chart-1 transition-all duration-700"
                  style={{ width: `${anonPercent}%` }}
                />
                <div
                  className="bg-chart-3 transition-all duration-700"
                  style={{ width: `${authPercent}%` }}
                />
              </div>
            )}
          </div>

          <div className="col-span-12 bg-card px-8 py-7 sm:col-span-3">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ActivityIcon weight="bold" className="size-4" />
              Peak activity
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold tabular-nums text-foreground">
              {peakTime ?? (
                <span className="text-base font-normal text-muted-foreground">
                  N/A
                </span>
              )}
            </p>
            {analytics?.engagement.uniqueRespondents !== undefined && (
              <p className="mt-4 text-xs text-muted-foreground">
                {analytics.engagement.uniqueRespondents} unique respondents
              </p>
            )}
          </div>

          <div className="col-span-12 bg-card px-8 py-7 sm:col-span-2">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock weight="bold" className="size-4" />
              Duration
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold tabular-nums text-foreground">
              {analytics?.pollHealth.pollDuration ?? "-"}
            </p>
            <p className="mt-4 text-xs text-muted-foreground">
              {formatHoursAgo(analytics?.pollHealth.pollDurationHours ?? 0)}
            </p>
          </div>

          <div className="col-span-12 bg-card px-8 py-7 sm:col-span-2">
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <TrendDown weight="bold" className="size-4" />
              Drop-off
            </p>
            <p className="mt-2 font-heading text-3xl font-semibold tabular-nums text-foreground">
              {dropOff !== null ? (
                <>
                  {dropOff}
                  <span className="ml-0.5 text-base font-normal text-muted-foreground">
                    %
                  </span>
                </>
              ) : (
                <span className="text-base font-normal text-muted-foreground">
                  N/A
                </span>
              )}
            </p>
            {dropOff !== null && (
              <p className="mt-4 text-xs text-muted-foreground">
                Q1 → Q{totalQuestions}
              </p>
            )}
          </div>
        </div>
      </section>

      {analytics?.timeline && analytics.timeline.length > 0 && (
        <section className="mb-16">
          <div className="rounded-2xl border border-border/40 bg-card p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-semibold text-foreground">
                  Responses over time
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Daily response volume
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye weight="bold" className="size-3" />
                {analytics.timeline.reduce((s, e) => s + e.count, 0)} total
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analytics.timeline}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="timelineFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="var(--color-chart-1)"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--color-chart-1)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                    strokeOpacity={0.4}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{
                      fill: "currentColor",
                      opacity: 0.4,
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{
                      fill: "currentColor",
                      opacity: 0.4,
                      fontSize: 12,
                    }}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{
                      stroke: "var(--color-border)",
                      strokeOpacity: 0.6,
                    }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "var(--color-card)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      fontSize: "13px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2}
                    fill="url(#timelineFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}

      {analytics?.questionSummaries &&
        analytics.questionSummaries.length > 0 && (
          <section>
            <h2 className="mb-8 font-heading text-lg font-semibold text-foreground">
              Question breakdown
            </h2>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {analytics.questionSummaries.map((summary, idx) => {
                const winner = summary.options.reduce((a, b) =>
                  a.count > b.count ? a : b,
                );
                const winnerPercent =
                  summary.totalAnswers > 0
                    ? Math.round((winner.count / summary.totalAnswers) * 100)
                    : 0;

                const isLastOdd =
                  idx === analytics.questionSummaries.length - 1 &&
                  analytics.questionSummaries.length % 2 === 1;

                return (
                  <div
                    key={summary.questionId}
                    className={`rounded-2xl border border-border/40 bg-card p-8 ${
                      isLastOdd ? "lg:col-span-2" : ""
                    }`}
                  >
                    <div className="mb-6">
                      <h3 className="font-heading text-base font-semibold leading-snug text-foreground">
                        {summary.questionText}
                      </h3>
                      <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users weight="bold" className="size-3" />
                          {summary.totalAnswers} answers
                        </span>
                        <span className="text-muted-foreground/30">/</span>
                        <span>
                          {winner.option} leading at {winnerPercent}%
                        </span>
                      </div>
                    </div>

                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={summary.options}
                          margin={{
                            top: 8,
                            right: 8,
                            left: -20,
                            bottom: 0,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            strokeOpacity={0.3}
                            horizontal={true}
                            vertical={false}
                          />
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
                            allowDecimals={false}
                          />
                          <Tooltip
                            cursor={{
                              fill: "var(--color-chart-1)",
                              opacity: 0.05,
                            }}
                            contentStyle={{
                              borderRadius: "8px",
                              border: "1px solid var(--color-border)",
                              backgroundColor: "var(--color-card)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                              fontSize: "13px",
                            }}
                          />
                          <Bar
                            dataKey="count"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={48}
                          >
                            {summary.options.map((_, i) => (
                              <Cell
                                key={i}
                                fill={CHART_COLORS[i % CHART_COLORS.length]}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
    </div>
  );
}
