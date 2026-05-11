"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, BarChart3, Plus } from "lucide-react";

export function GlobalNav() {
  const { isLoaded, isSignedIn, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight"
        >
          Opinion
        </Link>

        <nav className="flex items-center gap-2">
          {!isLoaded ? null : isSignedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <BarChart3 className="mr-1.5 size-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/polls/create">
                  <Plus className="mr-1.5 size-4" />
                  Create
                </Link>
              </Button>
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 rounded-full"
                  >
                    <Avatar className="size-8">
                      <AvatarImage src={user?.picture} alt={user?.name} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                        {user?.name
                          ? user.name.trim().charAt(0).toUpperCase()
                          : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="border-b px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                  <DropdownMenuItem asChild>
                    <a href="/api/auth/logout">
                      <LogOut className="mr-2 size-4" />
                      Sign out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/api/auth/login">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/api/auth/login?prompt=create">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
