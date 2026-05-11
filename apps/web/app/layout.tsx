import type { Metadata } from "next";
import { QueryClientProvider } from "@/components/QueryClientProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Opinion - Create & Share Polls",
  description:
    "Create polls, collect feedback, and analyze responses in real-time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <QueryClientProvider>{children}</QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
