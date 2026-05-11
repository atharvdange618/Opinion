import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { HeroArt } from "@/components/illustrations/HeroArt";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Opinion",
  description:
    "Create polls, collect feedback, and analyze responses in real-time.",
};

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || "opinion_session";

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:pb-28 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-end gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h1 className="animate-slide-up font-heading text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-tight text-foreground [animation-delay:100ms] [animation-fill-mode:backwards]">
                Ask anonymously.{" "}
                <span className="text-primary">Get honest answers.</span>
              </h1>
              <p className="mt-6 animate-slide-up max-w-lg text-lg leading-relaxed text-muted-foreground [animation-delay:200ms] [animation-fill-mode:backwards]">
                Create polls, share them with a link, and watch responses come
                in live. Anonymous or authenticated - you decide who can answer.
              </p>
              <div className="mt-8 flex animate-slide-up flex-wrap items-center gap-4 [animation-delay:300ms] [animation-fill-mode:backwards]">
                <Button size="lg" asChild>
                  <Link
                    href={
                      session
                        ? "/polls/create"
                        : "/api/auth/login?prompt=create"
                    }
                  >
                    Create your first poll
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <Link href={session ? "/dashboard" : "/api/auth/login"}>
                    {session ? "Go to dashboard" : "Sign in"}
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden animate-scale-in lg:block [animation-delay:400ms] [animation-fill-mode:backwards]">
              <HeroArt />
            </div>
          </div>
        </div>
      </section>

      <Features />

      <CTA hasSession={!!session} />
    </div>
  );
}
