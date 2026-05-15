'use client';

import { BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';

import { SignOut } from '@/components/auth/SignOut';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function GlobalNav() {
  const { isLoaded, isSignedIn, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          className="flex h-10 items-center rounded-md px-1 transition-opacity hover:opacity-90"
          href="/"
        >
          <BrandLogo className="h-8" />
        </Link>

        <nav className="flex items-center gap-2">
          {isLoaded ? (
            isSignedIn ? (
              <>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/dashboard">
                    <BarChart3 className="mr-1.5 size-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/polls/create">
                    <Plus className="mr-1.5 size-4" />
                    Create
                  </Link>
                </Button>
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="ml-1 rounded-full" size="icon" variant="ghost">
                      <Avatar className="size-8">
                        <AvatarImage alt={user?.name} src={user?.picture} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                          {user?.name ? user.name.trim().charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="border-b px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                    <SignOut />
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Button asChild size="sm" variant="ghost">
                  <Link href={`${API_URL}/api/auth/login`}>Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link
                    href={`${API_URL}/api/auth/login?redirect=${encodeURIComponent('/polls/create')}`}
                  >
                    Get started
                  </Link>
                </Button>
              </>
            )
          ) : null}
        </nav>
      </div>
    </header>
  );
}
