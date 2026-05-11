import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";

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
    <div className="min-h-screen bg-white">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <h1 className="text-xl font-semibold">Opinion</h1>
          <nav className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-lg bg-zinc-950 px-4 py-2 text-sm text-white"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/api/auth/login"
                  className="text-sm text-zinc-600 hover:text-black"
                >
                  Sign in
                </Link>
                <Link
                  href="/api/auth/login?prompt=create"
                  className="rounded-lg bg-zinc-950 px-4 py-2 text-sm text-white"
                >
                  Get started
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pt-24 text-center">
        <h2 className="text-5xl font-semibold tracking-tight">
          Create polls. Collect feedback.{" "}
          <span className="text-zinc-400">Know what people think.</span>
        </h2>
        <p className="mt-6 text-lg text-zinc-500">
          Opinion lets you create polls, share them with a link, and see results
          in real-time. Anonymous or authenticated - you decide.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href={session ? "/polls/create" : "/api/auth/login?prompt=create"}
            className="rounded-lg bg-zinc-950 px-6 py-3 text-white"
          >
            Create your first poll
          </Link>
        </div>
      </main>
    </div>
  );
}
