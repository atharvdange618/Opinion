'use client';

import { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from '@/components/Charts';
import { submitResponseSchema, type SubmitResponseInput } from '@opinion/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { LogIn, Users, ShieldAlert, ShieldCheck, Clock, Calendar } from 'lucide-react';
import { SuccessArt } from '@/components/illustrations/SuccessArt';
import { ResultsArt } from '@/components/illustrations/ResultsArt';

interface PublicPoll {
  _id: string;
  title: string;
  description: string;
  responseMode: 'anonymous' | 'authenticated';
  status: string;
  slug: string;
  expiresAt: string;
  createdAt: string;
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

function QuestionCard({
  question,
  index,
  register,
  errors,
}: {
  question: PublicPoll['questions'][0];
  index: number;
  register: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  errors: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const isSelected = (option: string) => selected === option;

  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-medium text-primary">
            {index + 1}
          </span>
          <CardTitle className="font-heading text-base leading-snug">
            {question.text}
            {question.isMandatory && <span className="ml-1 text-destructive">*</span>}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={(value) => {
            setSelected(value);
            const event = {
              target: {
                value,
                name: `answers.${index}.selectedOption`,
              },
            };
            (
              register(`answers.${index}.selectedOption`, {
                required: question.isMandatory,
              }).onChange
            )(event);
          }}
        >
          <div className="space-y-2">
            {question.options.map((option, oIndex) => (
              <label
                key={oIndex}
                className={`group/option flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-all ${
                  isSelected(option)
                    ? 'border-primary/30 bg-primary/5 ring-1 ring-primary/20'
                    : 'border-border/60 hover:border-border'
                }`}
              >
                <RadioGroupItem value={option} className="sr-only" />
                <span
                  className={`size-4 shrink-0 rounded-full border-2 transition-all ${
                    isSelected(option) ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                  }`}
                />
                <span
                  className={`text-sm transition-all ${
                    isSelected(option) ? 'font-medium' : 'text-foreground'
                  }`}
                >
                  {option}
                </span>
              </label>
            ))}
          </div>
        </RadioGroup>
        {errors.answers?.[index]?.selectedOption && (
          <p className="mt-3 text-sm text-destructive">Please select an option</p>
        )}
        <input
          type="hidden"
          defaultValue={question._id}
          {...register(`answers.${index}.questionId`)}
        />
      </CardContent>
    </Card>
  );
}

function VotingForm({
  poll,
  onSubmit,
  isSubmitting,
  error,
}: {
  poll: PublicPoll;
  onSubmit: (data: SubmitResponseInput) => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmitResponseInput>({
    resolver: zodResolver(submitResponseSchema),
  });

  return (
    <form onSubmit={(e) => { handleSubmit((data) => onSubmit(data))(e).catch(console.error); }} className="space-y-6">
      {poll.questions.map((question, index) => (
        <QuestionCard
          key={question._id}
          question={question}
          index={index}
          register={register}
          errors={errors}
        />
      ))}

      {poll.responseMode === 'anonymous' && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldAlert className="size-3.5" />
          <span>Anonymous response &middot; your identity is not recorded</span>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
        {isSubmitting ? 'Submitting...' : 'Submit responses'}
      </Button>
    </form>
  );
}

function ThankYouScreen() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <SuccessArt />
      <h2 className="mt-8 font-heading text-2xl font-semibold">Response recorded</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Thank you for participating. Your feedback helps shape better decisions.
      </p>
    </div>
  );
}

function AuthRequiredScreen({ slug }: { slug: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="mb-6 rounded-full bg-primary/10 p-6">
        <ShieldCheck className="size-12 text-primary" />
      </div>
      <h2 className="font-heading text-2xl font-semibold">Sign in required</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        This poll is restricted to authenticated users only. Sign in to participate.
      </p>
      <Button className="mt-6" asChild>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/login?redirect=${encodeURIComponent(`/poll/${slug}`)}`}
        >
          <LogIn className="mr-2 size-4" />
          Sign in to respond
        </a>
      </Button>
    </div>
  );
}

function ExpiredScreen({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="mb-6 rounded-full bg-muted p-6">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Closed
        </span>
      </div>
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        This poll has ended and is no longer accepting responses.
      </p>
    </div>
  );
}

function PublishedResultsScreen({
  poll,
  results,
}: {
  poll: PublicPoll;
  results: PublishedResults;
}) {
  return (
    <div className="space-y-10">
      <div className="flex flex-col items-center text-center">
        <ResultsArt />
        <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight">{poll.title}</h1>
        {poll.description && (
          <p className="mt-2 max-w-md text-muted-foreground">{poll.description}</p>
        )}
        <div className="mt-4 flex items-center gap-4 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            {results.totalResponses} responses
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {results.questionSummaries.map((summary) => {
          const winner = summary.options.reduce((a, b) => (a.count > b.count ? a : b));
          const winnerPercent =
            summary.totalAnswers > 0 ? Math.round((winner.count / summary.totalAnswers) * 100) : 0;

          return (
            <Card key={summary.questionId} className="border-border/60 bg-card">
              <CardHeader className="border-b border-border/40 pb-4">
                <CardTitle className="font-heading text-xl leading-snug">
                  {summary.questionText}
                </CardTitle>
                <div className="mt-2 flex items-center gap-3 font-mono text-xs text-muted-foreground">
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
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={summary.options}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis
                        dataKey="option"
                        tick={{
                          fill: 'currentColor',
                          opacity: 0.5,
                          fontSize: 12,
                        }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis
                        tick={{
                          fill: 'currentColor',
                          opacity: 0.5,
                          fontSize: 12,
                        }}
                        axisLine={false}
                        tickLine={false}
                        dx={-10}
                      />
                      <Tooltip
                        cursor={{ fill: 'var(--color-primary)', opacity: 0.05 }}
                        contentStyle={{
                          borderRadius: '12px',
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-card)',
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
    </div>
  );
}

export default function PublicPollPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const verificationCheckDone = useRef<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'unknown' | 'checking' | 'verified'>(
    'unknown',
  );

  useEffect(() => {
    document.title = 'Poll - Opinion';
  }, []);

  const { data: poll, isLoading: pollLoading } = useQuery({
    queryKey: ['public-poll', slug],
    queryFn: async () => {
      const { data } = await api.get<PublicPoll>(`/polls/public/${slug}`);
      return data;
    },
  });

  const { data: results } = useQuery({
    queryKey: ['public-results', slug],
    queryFn: async () => {
      const { data } = await api.get<PublishedResults>(`/polls/public/${slug}/results`);
      return data;
    },
    enabled: poll?.status === 'published',
  });

  useEffect(() => {
    if (!poll) return;

    const needsVerification = poll.responseMode === 'anonymous' && poll.status === 'active';

    if (!needsVerification) {
      verificationCheckDone.current = slug;
      setVerificationStatus('verified');
      return;
    }

    if (verificationCheckDone.current === slug) return;

    verificationCheckDone.current = slug;
    setVerificationStatus('checking');

    api
      .get<{ verified: boolean }>(`/polls/public/${slug}/verify/status`)
      .then(({ data }) => {
        if (data.verified) {
          setVerificationStatus('verified');
          return;
        }

        router.replace(`/poll/${slug}/verify`);
      })
      .catch(() => {
        router.replace(`/poll/${slug}/verify`);
      });
  }, [poll, router, slug]);

  const submitMutation = useMutation({
    mutationFn: async (data: SubmitResponseInput) => {
      await api.post(`/polls/public/${slug}/respond`, data);
    },
    onSuccess: () => {
      setSubmitted(true);
      void queryClient.invalidateQueries({ queryKey: ['public-poll', slug] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setSubmitError(
        error?.response?.data?.message || error?.message || 'Failed to submit. Please try again.',
      );
    },
  });

  if (pollLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Skeleton className="mb-4 h-10 w-64" />
        <Skeleton className="mb-8 h-4 w-96" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-6 h-12 w-full rounded-xl" />
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="mb-6 rounded-full bg-muted p-6">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Not Found
          </span>
        </div>
        <h2 className="font-heading text-2xl font-semibold">Poll not found</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          This poll doesn&apos;t exist or has been removed.
        </p>
      </div>
    );
  }

  if (poll.status === 'expired') {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <ExpiredScreen title={poll.title} />
      </div>
    );
  }

  if (poll.status === 'published' && results) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <PublishedResultsScreen poll={poll} results={results} />
      </div>
    );
  }

  if (poll.status !== 'active') {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <h2 className="font-heading text-2xl font-semibold">Poll not accepting responses</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          This poll is currently not accepting responses.
        </p>
      </div>
    );
  }

  if (poll.responseMode === 'authenticated' && !isSignedIn) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <AuthRequiredScreen slug={slug} />
      </div>
    );
  }

  if (
    poll.responseMode === 'anonymous' &&
    poll.status === 'active' &&
    verificationStatus !== 'verified'
  ) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Skeleton className="mb-4 h-10 w-64" />
        <Skeleton className="mb-8 h-4 w-96" />
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="mt-6 h-12 w-full rounded-xl" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <ThankYouScreen />
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h left`;
    return 'Expiring soon';
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">{poll.title}</h1>
        {poll.description && <p className="mt-2 text-muted-foreground">{poll.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" />
            {poll.questions.length} question
            {poll.questions.length !== 1 ? 's' : ''}
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            Created {formatDate(poll.createdAt)}
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span
            className={`flex items-center gap-1.5 ${
              new Date(poll.expiresAt) > new Date() ? 'text-success' : 'text-destructive'
            }`}
          >
            <Clock className="size-3.5" />
            {formatTimeRemaining(poll.expiresAt)}
          </span>
          <span className="text-muted-foreground/50">·</span>
          <span
            className={`flex items-center gap-1.5 ${
              poll.responseMode === 'anonymous' ? 'text-success' : 'text-muted-foreground'
            }`}
          >
            {poll.responseMode === 'anonymous' ? (
              <ShieldAlert className="size-3.5" />
            ) : (
              <ShieldCheck className="size-3.5" />
            )}
            {poll.responseMode}
          </span>
        </div>
      </div>

      <VotingForm
        poll={poll}
        onSubmit={(data) => {
          setSubmitError(null);
          submitMutation.mutate(data);
        }}
        isSubmitting={submitMutation.isPending}
        error={submitError}
      />
    </div>
  );
}
