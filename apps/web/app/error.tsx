"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <svg
          viewBox="0 0 200 160"
          fill="none"
          className="mx-auto size-32 text-muted-foreground"
          aria-hidden="true"
        >
          <rect
            x="30"
            y="30"
            width="140"
            height="100"
            rx="10"
            className="fill-destructive/10 stroke-destructive/30"
            strokeWidth="2"
          />
          <rect
            x="55"
            y="55"
            width="90"
            height="6"
            rx="3"
            className="fill-destructive/30"
          />
          <rect
            x="55"
            y="75"
            width="70"
            height="6"
            rx="3"
            className="fill-destructive/20"
          />
          <rect
            x="55"
            y="95"
            width="40"
            height="6"
            rx="3"
            className="fill-destructive/20"
          />
          <path
            d="M100 10 L110 30 L90 30 Z"
            className="fill-warning/50"
          />
        </svg>
        <h1 className="mt-6 font-heading text-3xl font-semibold">
          Something went wrong
        </h1>
        <p className="mt-2 text-muted-foreground">
          {error?.message || "An unexpected error occurred."}
        </p>
        <Button className="mt-8" onClick={reset}>
          <RotateCcw className="mr-2 size-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
