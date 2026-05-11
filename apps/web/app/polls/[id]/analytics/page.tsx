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

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [publishing, setPublishing] = useState(false);

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
    } catch {
      alert("Failed to publish");
    } finally {
      setPublishing(false);
    }
  }

  const [copying, setCopying] = useState(false);

  async function handleCopyLink() {
    if (!poll?.slug) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/poll/${poll.slug}`,
      );
      alert("Link copied!");
    } catch {
      alert("Failed to copy link");
    } finally {
      setCopying(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading&hellip;</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{poll?.title}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Status: {poll?.status} · Share: /poll/{poll?.slug}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopyLink}
            disabled={!poll?.slug || copying}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm disabled:opacity-50"
          >
            {copying ? "Copying" : "Copy link"}
          </button>
          {poll?.status !== "published" && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {publishing ? "Publishing" : "Publish results"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Total responses</p>
          <p className="text-3xl font-semibold">
            {analytics?.totalResponses ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Anonymous</p>
          <p className="text-3xl font-semibold">
            {analytics?.participationInsights?.anonymous ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Authenticated</p>
          <p className="text-3xl font-semibold">
            {analytics?.participationInsights?.authenticated ?? 0}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {analytics?.questionSummaries?.map((summary) => (
          <div
            key={summary.questionId}
            className="rounded-lg border border-zinc-200 p-6"
          >
            <h3 className="mb-4 text-lg font-semibold">
              {summary.questionText}
              <span className="ml-2 text-sm font-normal text-zinc-500">
                ({summary.totalAnswers} answers)
              </span>
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.options}>
                  <XAxis dataKey="option" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {analytics?.timeline && analytics.timeline.length > 0 && (
        <div className="mt-8 rounded-lg border border-zinc-200 p-6">
          <h3 className="mb-4 text-lg font-semibold">Responses over time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.timeline}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
