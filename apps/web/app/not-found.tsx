import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotFoundArt } from "@/components/illustrations/NotFoundArt";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <NotFoundArt />
        <h1 className="mt-6 font-heading text-4xl font-semibold">404</h1>
        <p className="mt-2 text-muted-foreground">
          This page doesn&apos;t exist.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/">
            <Home className="mr-2 size-4" />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  );
}
