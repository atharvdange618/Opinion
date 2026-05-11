"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPollSchema } from "@opinion/shared";
import { z } from "zod";
type FormInput = z.input<typeof createPollSchema>;
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { DateTimePicker } from "@/components/datetime-picker";

export default function CreatePollPage() {
  const { push } = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Create Poll - Opinion";
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      description: "",
      expiresAt: "",
      responseMode: "anonymous",
      questions: [
        { text: "", options: ["", ""], isMandatory: false, order: 0 },
      ],
    },
  });

  const {
    fields: questionFields,
    append: addQuestion,
    remove: removeQuestion,
    move: moveQuestion,
  } = useFieldArray({ control, name: "questions" });

  async function onSubmit(data: FormInput) {
    setSubmitting(true);
    try {
      const res = await api.post("/polls", data);
      push(`/polls/${res.data._id}/analytics`);
    } catch {
      alert("Failed to create poll");
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
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="font-heading text-xl">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-3">
              <Label htmlFor="create-title" className="text-sm font-medium">Title</Label>
              <Input
                id="create-title"
                className="bg-background/50 h-12 text-lg transition-colors focus-visible:bg-background"
                {...register("title")}
                placeholder="What's your poll about?"
              />
              {errors.title && (
                <p className="text-sm font-medium text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="create-description" className="text-sm font-medium">Description <span className="text-muted-foreground font-normal">(Optional)</span></Label>
              <Textarea
                id="create-description"
                className="bg-background/50 resize-none transition-colors focus-visible:bg-background"
                {...register("description")}
                placeholder="Add some context or instructions..."
                rows={3}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <Label htmlFor="create-expiresAt" className="text-sm font-medium">Expires at</Label>
                <DateTimePicker
                  date={watch("expiresAt") && !isNaN(Date.parse(watch("expiresAt") as string)) ? new Date(watch("expiresAt") as string) : undefined}
                  onDateChange={(date) => setValue("expiresAt" as any, date ? date.toISOString() : "", { shouldValidate: true })}
                />
                {errors.expiresAt && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.expiresAt.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="create-responseMode" className="text-sm font-medium">Response mode</Label>
                <Select
                  defaultValue="anonymous"
                    onValueChange={(val) =>
                        setValue("responseMode" as any, val)
                    }
                >
                  <SelectTrigger id="create-responseMode" className="bg-background/50 h-11 transition-colors focus-visible:bg-background">
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anonymous">Anonymous</SelectItem>
                    <SelectItem value="authenticated">Authenticated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-xl border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-heading text-xl">Questions</CardTitle>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-full shadow-sm"
                onClick={() =>
                  addQuestion({
                    text: "",
                    options: ["", ""],
                    isMandatory: false,
                    order: questionFields.length,
                  })
                }
              >
                <Plus className="mr-1.5 size-4" />
                Add question
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {questionFields.map((field, qIndex) => (
              <div
                key={field.id}
                className="group relative rounded-xl border border-border/60 bg-background/30 p-5 transition-all focus-within:bg-background/80 focus-within:ring-1 focus-within:ring-primary/20 hover:border-border"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex h-6 items-center rounded-md bg-primary/10 px-2 text-xs font-semibold text-primary">
                    Question {qIndex + 1}
                  </span>
                  <div className="flex items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => moveQuestion(qIndex, qIndex - 1)}
                      disabled={qIndex === 0}
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => moveQuestion(qIndex, qIndex + 1)}
                      disabled={qIndex === questionFields.length - 1}
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(qIndex)}
                      className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <Input
                  {...register(`questions.${qIndex}.text`)}
                  placeholder="Type your question here..."
                  className="mb-5 h-11 border-transparent bg-background/50 text-base shadow-none transition-all focus-visible:border-primary/50 focus-visible:bg-background focus-visible:shadow-sm"
                />

                <div className="space-y-3 pl-2">
                  {field.options.map((_, oIndex) => (
                    <div key={oIndex} className="group/option flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background text-xs font-medium text-muted-foreground">
                        {String.fromCharCode(65 + oIndex)}
                      </div>
                      <Input
                        {...register(`questions.${qIndex}.options.${oIndex}`)}
                        placeholder={`Option ${oIndex + 1}`}
                        className="h-10 flex-1 bg-background/50 transition-colors focus-visible:bg-background"
                      />
                      {field.options.length > 2 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newOptions = [...field.options];
                            newOptions.splice(oIndex, 1);
                            setValue(
                              `questions.${qIndex}.options` as any,
                              newOptions,
                            );
                          }}
                          className="h-8 w-8 shrink-0 rounded-full text-destructive opacity-0 hover:bg-destructive/10 hover:text-destructive group-hover/option:opacity-100 focus-visible:opacity-100"
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
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setValue(
                        `questions.${qIndex}.options` as any,
                        [...field.options, ""],
                      );
                    }}
                    className="rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="mr-1.5 size-4" />
                    Add option
                  </Button>

                  <div className="flex items-center gap-2.5 rounded-full border border-border/40 bg-background/40 px-3 py-1.5">
                    <Checkbox
                      id={`mandatory-${qIndex}`}
                      checked={watch(`questions.${qIndex}.isMandatory`)}
                      onCheckedChange={(checked) =>
                        setValue(
                          `questions.${qIndex}.isMandatory` as any,
                          checked === true,
                        )
                      }
                    />
                    <Label htmlFor={`mandatory-${qIndex}`} className="cursor-pointer text-xs font-medium">
                      Required
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={submitting} className="min-w-48 rounded-full shadow-lg shadow-primary/25 transition-transform hover:-translate-y-0.5">
            {submitting ? "Creating Poll..." : "Publish Poll"}
          </Button>
        </div>
      </form>
    </div>
  );
}
