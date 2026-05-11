"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";

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
    document.title = "My Polls - Opinion";
  }, []);

  const { data: polls, isLoading } = useQuery({
    queryKey: ["my-polls"],
    queryFn: async () => {
      const { data } = await api.get<PollSummary[]>("/polls");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading&hellip;</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Polls</h1>
        <Link
          href="/polls/create"
          className="rounded-lg bg-zinc-950 px-4 py-2 text-sm text-white"
        >
          Create Poll
        </Link>
      </div>

      {polls && polls.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 p-12 text-center">
          <p className="text-zinc-500">No polls yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {polls?.map((poll) => (
            <div
              key={poll._id}
              className="rounded-lg border border-zinc-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold">{poll.title}</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    /poll/{poll.slug} · {poll.responseCount} responses ·{" "}
                    {poll.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/polls/${poll._id}/analytics`}
                    className="rounded bg-zinc-100 px-3 py-1 text-sm"
                  >
                    Analytics
                  </Link>
                  <Link
                    href={`/polls/${poll._id}/edit`}
                    className="rounded bg-zinc-100 px-3 py-1 text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
