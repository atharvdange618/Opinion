'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createPollSchema } from '@opinion/shared';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
type FormInput = z.input<typeof createPollSchema>;
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

import { DateTimePicker } from '@/components/datetime-picker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';

const DRAFT_KEY = 'opinion-poll-draft';

export default function CreatePollPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<null | string>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  useEffect(() => {
    document.title = 'Create Poll - Opinion';
  }, []);

  const defaultValues = {
    description: '',
    expiresAt: '',
    questions: [{ isMandatory: false, options: ['', ''], order: 0, text: '' }],
    responseMode: 'anonymous' as const,
    title: '',
  };

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<FormInput>({
    defaultValues,
    resolver: zodResolver(createPollSchema),
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        reset(parsed, { keepDefaultValues: false });
        setDraftRestored(true);
      }
    } catch {
      // intentional - draft may not exist
    }
  }, [reset]);

  const formValues = watch();
  useEffect(() => {
    const hasContent =
      formValues.title ||
      formValues.description ||
      formValues.questions?.some((q) => q.text || q.options?.some((o) => o));
    if (hasContent) {
      const timer = setTimeout(() => {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(formValues));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formValues]);

  const {
    append: addQuestion,
    fields: questionFields,
    move: moveQuestion,
    remove: removeQuestion,
  } = useFieldArray({ control, name: 'questions' });

  async function onSubmit(data: FormInput) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await api.post('/polls', data);
      localStorage.removeItem(DRAFT_KEY);
      router.push(`/polls/${res.data._id}/analytics`);
    } catch (error_: unknown) {
      const error = error_ as { message?: string; response?: { data?: { message?: string } } };
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create poll. Please try again.';
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">Create Poll</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Design your poll and start collecting feedback instantly.
        </p>
        {draftRestored && (
          <div className="mt-4 animated fade-in rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
            Draft restored from your last session.
          </div>
        )}
      </div>

      <form
        className="space-y-8"
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e).catch(console.error);
        }}
      >
        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="font-heading text-xl">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label className="text-sm font-medium" htmlFor="create-title">
                Title
              </Label>
              <Input
                className="bg-background/50 h-12 text-lg transition-colors focus-visible:bg-background"
                id="create-title"
                {...register('title')}
                placeholder="What's your poll about?"
              />
              {errors.title && (
                <p className="text-sm font-medium text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium" htmlFor="create-description">
                Description <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Textarea
                className="bg-background/50 resize-none transition-colors focus-visible:bg-background"
                id="create-description"
                {...register('description')}
                placeholder="Add some context or instructions..."
                rows={3}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label className="text-sm font-medium" htmlFor="create-expiresAt">
                  Expires at
                </Label>
                <DateTimePicker
                  date={
                    watch('expiresAt') && !Number.isNaN(Date.parse(watch('expiresAt')))
                      ? new Date(watch('expiresAt'))
                      : undefined
                  }
                  onDateChange={(date) =>
                    setValue('expiresAt', date ? date.toISOString() : '', {
                      shouldValidate: true,
                    })
                  }
                />
                {errors.expiresAt && (
                  <p className="text-sm font-medium text-destructive">{errors.expiresAt.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium" htmlFor="create-responseMode">
                  Response mode
                </Label>
                <Select
                  defaultValue="anonymous"
                  onValueChange={(val) =>
                    setValue('responseMode', val as 'anonymous' | 'authenticated')
                  }
                >
                  <SelectTrigger
                    className="bg-background/50 h-11 transition-colors focus-visible:bg-background"
                    id="create-responseMode"
                  >
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anonymous">Anonymous</SelectItem>
                    <SelectItem value="authenticated">Authenticated</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Anonymous lets anyone respond without signing in. Authenticated requires a
                  verified account.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-xl">Questions</CardTitle>
              <Button
                className="rounded-full shadow-sm"
                onClick={() =>
                  addQuestion({
                    isMandatory: false,
                    options: ['', ''],
                    order: questionFields.length,
                    text: '',
                  })
                }
                size="sm"
                type="button"
                variant="secondary"
              >
                <Plus className="mr-1.5 size-4" />
                Add question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {questionFields.map((field, qIndex) => {
              const liveOptions = watch(`questions.${qIndex}.options`) || [];
              return (
                <div
                  className="group relative rounded-xl border border-border/60 bg-background/30 p-5 transition-all focus-within:bg-background/80 focus-within:ring-1 focus-within:ring-primary/20 hover:border-border"
                  key={field.id}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="inline-flex h-6 items-center rounded-md bg-primary/10 px-2 text-xs font-semibold text-primary">
                      Question {qIndex + 1}
                    </span>
                    <div className="flex items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <Button
                        className="h-8 w-8 rounded-full"
                        disabled={qIndex === 0}
                        onClick={() => moveQuestion(qIndex, qIndex - 1)}
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        className="h-8 w-8 rounded-full"
                        disabled={qIndex === questionFields.length - 1}
                        onClick={() => moveQuestion(qIndex, qIndex + 1)}
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                      <Button
                        className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeQuestion(qIndex)}
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <Input
                    {...register(`questions.${qIndex}.text`)}
                    className="mb-5 h-11 border-transparent bg-background/50 text-base shadow-none transition-all focus-visible:border-primary/50 focus-visible:bg-background focus-visible:shadow-sm"
                    placeholder="Type your question here..."
                  />

                  <div className="space-y-3 pl-2">
                    {liveOptions.map((_, oIndex) => (
                      <div className="group/option flex items-center gap-3" key={oIndex}>
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground">
                          {String.fromCodePoint(65 + oIndex)}
                        </div>
                        <Input
                          {...register(`questions.${qIndex}.options.${oIndex}`)}
                          className="h-10 flex-1 bg-background/50 transition-colors focus-visible:bg-background"
                          placeholder={`Option ${oIndex + 1}`}
                        />
                        {liveOptions.length > 2 ? (
                          <Button
                            className="h-8 w-8 shrink-0 rounded-full text-destructive opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover/option:opacity-100 focus-visible:opacity-100"
                            onClick={() => {
                              const currentOptions = getValues(`questions.${qIndex}.options`);
                              const newOptions = [...currentOptions];
                              newOptions.splice(oIndex, 1);
                              setValue(`questions.${qIndex}.options`, newOptions);
                            }}
                            size="icon"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        ) : (
                          <div className="h-8 w-8 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
                    <Button
                      className="rounded-full text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        const currentOptions = getValues(`questions.${qIndex}.options`);
                        setValue(`questions.${qIndex}.options`, [...currentOptions, '']);
                      }}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      <Plus className="mr-1.5 size-4" />
                      Add option
                    </Button>

                    <div className="flex items-center gap-2.5 rounded-full border border-border/40 bg-background/40 px-3 py-1.5">
                      <Checkbox
                        checked={watch(`questions.${qIndex}.isMandatory`)}
                        id={`mandatory-${qIndex}`}
                        onCheckedChange={(checked) =>
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          setValue(`questions.${qIndex}.isMandatory` as any, checked === true)
                        }
                      />
                      <Label
                        className="cursor-pointer text-xs font-medium"
                        htmlFor={`mandatory-${qIndex}`}
                      >
                        Required
                      </Label>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {submitError && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-5 py-4">
            <p className="text-sm font-medium text-destructive">{submitError}</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button
            className="min-w-48 rounded-full shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5"
            disabled={submitting}
            size="lg"
            type="submit"
          >
            {submitting ? 'Creating Poll...' : 'Publish Poll'}
          </Button>
        </div>
      </form>
    </div>
  );
}
