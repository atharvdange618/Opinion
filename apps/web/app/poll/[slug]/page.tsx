"use client";

import { use, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "@/components/Charts";
import {
  submitResponseSchema,
  type SubmitResponseInput,
} from "@opinion/shared";

interface PublicPoll {
  _id: string;
  title: string;
  description: string;
  responseMode: "anonymous" | "authenticated";
  status: string;
  slug: string;
  questions: {
    _id: string;
    text: string;
    options: string[];
    isMandatory: boolean;
    order: number;
  }[];
}

interface PublishedResults {
  totalResponses: number;
  questionSummaries: {
    questionId: string;
    questionText: string;
    options: { option: string; count: number; percentage: number }[];
    totalAnswers: number;
  }[];
}

export default function PublicPollPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { isSignedIn } = useAuth();
  const submitted = useRef(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Poll - Opinion";
  }, []);

  const { data: poll, isLoading: pollLoading } = useQuery({
    queryKey: ["public-poll", slug],
    queryFn: async () => {
      const { data } = await api.get<PublicPoll>(`/polls/public/${slug}`);
      return data;
    },
  });

  const { data: results } = useQuery({
    queryKey: ["public-results", slug],
    queryFn: async () => {
      const { data } = await api.get<PublishedResults>(
        `/polls/public/${slug}/results`,
      );
      return data;
    },
    enabled: poll?.status === "published",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitResponseInput>({
    resolver: zodResolver(submitResponseSchema),
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitResponseInput) => {
      await api.post(`/polls/public/${slug}/respond`, data);
    },
    onSuccess: () => {
      submitted.current = true;
      queryClient.invalidateQueries({ queryKey: ["public-poll", slug] });
    },
  });

  if (pollLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading&hellip;</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Poll not found</p>
      </div>
    );
  }

  if (poll.status === "expired") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">{poll.title}</h1>
          <p className="mt-2 text-zinc-500">This poll has ended.</p>
        </div>
      </div>
    );
  }

  if (poll.status === "published" && results) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-semibold">{poll.title}</h1>
        <p className="mb-6 text-zinc-500">
          {results.totalResponses} total responses
        </p>

        <div className="space-y-8">
          {results.questionSummaries.map((summary) => (
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
              <div className="mt-4 space-y-1">
                {summary.options.map((opt) => (
                  <div
                    key={opt.option}
                    className="flex justify-between text-sm"
                  >
                    <span>{opt.option}</span>
                    <span className="text-zinc-500">
                      {opt.count} ({opt.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (poll.status !== "active") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">This poll is not accepting responses.</p>
      </div>
    );
  }

  if (poll.responseMode === "authenticated" && !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold">{poll.title}</h1>
          <p className="mb-6 text-zinc-500">
            This poll requires you to sign in first.
          </p>
          <a
            href={`/api/auth/login?redirect=/poll/${slug}`}
            className="inline-block rounded-lg bg-zinc-950 px-6 py-3 text-white"
          >
            Sign in to respond
          </a>
        </div>
      </div>
    );
  }

  if (submitted.current) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Thank you!</h1>
          <p className="mt-2 text-zinc-500">Your response has been recorded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-semibold">{poll.title}</h1>
      {poll.description && (
        <p className="mb-6 text-zinc-500">{poll.description}</p>
      )}

      <form
        onSubmit={handleSubmit((data) => submitMutation.mutate(data))}
        className="space-y-6"
      >
        {poll.questions.map((question, qIndex) => (
          <div
            key={question._id}
            className="rounded-lg border border-zinc-200 p-4"
          >
            <p className="mb-3 font-medium">
              {question.text}
              {question.isMandatory && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </p>

            <div className="space-y-2">
              {question.options.map((option, oIndex) => (
                <label
                  key={oIndex}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-200 p-3 hover:bg-zinc-50"
                >
                  <input
                    type="radio"
                    value={option}
                    {...register(`answers.${qIndex}.selectedOption`, {
                      required: question.isMandatory,
                    })}
                    name={`answers.${qIndex}.selectedOption`}
                    className="size-4"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>

            <input
              type="hidden"
              defaultValue={question._id}
              {...register(`answers.${qIndex}.questionId`)}
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={submitMutation.isPending}
          className="w-full rounded-lg bg-zinc-950 py-3 text-white disabled:opacity-50"
        >
          {submitMutation.isPending ? "Submitting&hellip;" : "Submit responses"}
        </button>

        {submitMutation.isError && (
          <p className="text-center text-sm text-red-500">
            {(submitMutation.error as any)?.response?.data?.message ||
              submitMutation.error?.message ||
              "Failed to submit. Please try again."}
          </p>
        )}
      </form>
    </div>
  );
}
