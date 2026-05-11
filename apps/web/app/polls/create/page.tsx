"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPollSchema } from "@opinion/shared";
import { z } from "zod";
type FormInput = z.input<typeof createPollSchema>;
import { api } from "@/lib/api";
import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";

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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold">Create Poll</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="create-title"
            className="mb-1 block text-sm font-medium"
          >
            Title
          </label>
          <input
            id="create-title"
            {...register("title")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="create-description"
            className="mb-1 block text-sm font-medium"
          >
            Description
          </label>
          <textarea
            id="create-description"
            {...register("description")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
            rows={3}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="create-expiresAt"
              className="mb-1 block text-sm font-medium"
            >
              Expires at
            </label>
            <input
              id="create-expiresAt"
              type="datetime-local"
              {...register("expiresAt")}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
            {errors.expiresAt && (
              <p className="mt-1 text-sm text-red-500">
                {errors.expiresAt.message}
              </p>
            )}
          </div>

          <div className="flex-1">
            <label
              htmlFor="create-responseMode"
              className="mb-1 block text-sm font-medium"
            >
              Response mode
            </label>
            <select
              id="create-responseMode"
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
                addQuestion({
                  text: "",
                  options: ["", ""],
                  isMandatory: false,
                  order: questionFields.length,
                })
              }
              className="flex items-center gap-1 rounded bg-zinc-100 px-3 py-1 text-sm"
            >
              <FiPlus /> Add question
            </button>
          </div>

          {questionFields.map((field, qIndex) => (
            <div
              key={field.id}
              className="rounded-lg border border-zinc-200 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-500">
                  Question {qIndex + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveQuestion(qIndex, qIndex - 1)}
                    disabled={qIndex === 0}
                    className="rounded p-1 hover:bg-zinc-100 disabled:opacity-30"
                  >
                    <FiArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveQuestion(qIndex, qIndex + 1)}
                    disabled={qIndex === questionFields.length - 1}
                    className="rounded p-1 hover:bg-zinc-100 disabled:opacity-30"
                  >
                    <FiArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="rounded p-1 text-red-500 hover:bg-red-50"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
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
                          const currentOptions = field.options;
                          const newOptions = [...currentOptions];
                          newOptions.splice(oIndex, 1);
                          const event = {
                            target: { value: newOptions },
                          };
                          (
                            register(`questions.${qIndex}.options`)
                              .onChange as any
                          )(event);
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
                  onClick={() => {
                    const currentOptions = field.options;
                    (register(`questions.${qIndex}.options`).onChange as any)({
                      target: { value: [...currentOptions, ""] },
                    });
                  }}
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
          {submitting ? "Creating&hellip;" : "Create Poll"}
        </button>
      </form>
    </div>
  );
}
