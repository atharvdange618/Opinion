import type { Metadata } from "next";
import { cookies } from "next/headers";
import { QueryClientProvider } from "@/components/QueryClientProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalNav } from "@/components/layout/GlobalNav";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import "./globals.css";
import { Inter, Literata } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const literata = Literata({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Opinion - Create & Share Polls",
  description:
    "Create polls, collect feedback, and analyze responses in real-time.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasSession = cookieStore.has(
    process.env.SESSION_COOKIE_NAME || "opinion_session",
  );

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable, literata.variable)}
    >
      <body>
        <ThemeProvider>
          <AuthProvider hasSession={hasSession}>
            <QueryClientProvider>
              <div className="flex min-h-screen flex-col">
                <GlobalNav />
                <main className="flex-1">{children}</main>
                <GlobalFooter />
              </div>
              <Toaster />
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
