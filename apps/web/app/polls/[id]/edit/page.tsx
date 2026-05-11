"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPollSchema } from "@opinion/shared";
import { z } from "zod";
type FormInput = z.input<typeof createPollSchema>;
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function EditPollPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { push } = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Edit Poll - Opinion";
  }, []);

  const { data: poll, isLoading } = useQuery({
    queryKey: ["poll", id],
    queryFn: async () => {
      const { data } = await api.get(`/polls/${id}`);
      return data;
    },
  });

  const defaultValues = poll
    ? {
        title: poll.title,
        description: poll.description,
        expiresAt: new Date(poll.expiresAt).toISOString().slice(0, 16),
        responseMode: poll.responseMode,
        questions: poll.questions.map((q: any) => ({
          text: q.text,
          options: q.options,
          isMandatory: q.isMandatory,
          order: q.order,
        })),
      }
    : undefined;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(createPollSchema),
    values: defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  async function onSubmit(data: FormInput) {
    setSubmitting(true);
    try {
      await api.put(`/polls/${id}`, data);
      push(`/polls/${id}/analytics`);
    } catch {
      alert("Failed to update poll");
    } finally {
      setSubmitting(false);
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold">Edit Poll</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            {...register("title")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="expiresAt"
              className="mb-1 block text-sm font-medium"
            >
              Expires at
            </label>
            <input
              id="expiresAt"
              type="datetime-local"
              {...register("expiresAt")}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
          </div>
          <div className="flex-1">
            <label
              htmlFor="responseMode"
              className="mb-1 block text-sm font-medium"
            >
              Response mode
            </label>
            <select
              id="responseMode"
              {...register("responseMode")}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
            >
              <option value="anonymous">Anonymous</option>
              <option value="authenticated">Authenticated</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Questions</h2>
            <button
              type="button"
              onClick={() =>
                append({
                  text: "",
                  options: ["", ""],
                  isMandatory: false,
                  order: fields.length,
                })
              }
              className="flex items-center gap-1 rounded bg-zinc-100 px-3 py-1 text-sm"
            >
              <FiPlus /> Add question
            </button>
          </div>

          {fields.map((field, qIndex) => (
            <div
              key={field.id}
              className="rounded-lg border border-zinc-200 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">
                  Question {qIndex + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(qIndex)}
                  className="text-red-500"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>

              <input
                {...register(`questions.${qIndex}.text`)}
                placeholder="Enter question"
                className="mb-3 w-full rounded-lg border border-zinc-300 px-3 py-2"
              />

              <div className="space-y-2">
                {field.options.map((_, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      {...register(`questions.${qIndex}.options.${oIndex}`)}
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                    />
                    {field.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = [...field.options];
                          newOptions.splice(oIndex, 1);
                          (
                            register(`questions.${qIndex}.options`)
                              .onChange as any
                          )({
                            target: { value: newOptions },
                          });
                        }}
                        className="text-red-500"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    (register(`questions.${qIndex}.options`).onChange as any)({
                      target: { value: [...field.options, ""] },
                    })
                  }
                  className="flex items-center gap-1 text-sm text-zinc-500"
                >
                  <FiPlus size={12} /> Add option
                </button>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...register(`questions.${qIndex}.isMandatory`)}
                  />
                  Mandatory
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-zinc-950 py-3 text-white disabled:opacity-50"
        >
          {submitting ? "Saving&hellip;" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
