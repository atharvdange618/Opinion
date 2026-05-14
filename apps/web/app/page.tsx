import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { UseCases } from "@/components/landing/UseCases";
import { Features } from "@/components/landing/Features";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";

export const metadata: Metadata = {
  title: "Opinion",
  description:
    "Create polls, collect feedback, and analyze responses in real-time.",
};

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME || "opinion_session";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;

  return (
    <div className="flex flex-col">
      <Hero hasSession={!!session} apiUrl={API_URL} />

      <HowItWorks />

      <UseCases />

      <Features />

      <FAQ />

      <CTA hasSession={!!session} />
    </div>
  );
}
