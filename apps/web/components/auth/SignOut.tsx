"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SignOut() {
  async function handleSignOut() {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const { logoutUrl } = await res.json();
      window.location.href = logoutUrl || "/";
    } catch {
      window.location.href = "/";
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignOut}
      className="w-full justify-start"
    >
      <LogOut className="mr-2 size-4" />
      Sign out
    </Button>
  );
}
