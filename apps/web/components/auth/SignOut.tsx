'use client';

import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function SignOut() {
  function handleSignOut() {
    fetch(`${API_URL}/api/auth/logout`, {
      credentials: 'include',
      method: 'POST',
    })
      .then((res) => res.json())
      .then(({ logoutUrl }: { logoutUrl?: string }) => {
        globalThis.location.href = logoutUrl || '/';
      })
      .catch(() => {
        globalThis.location.href = '/';
      });
  }

  return (
    <Button className="w-full justify-start" onClick={handleSignOut} size="sm" variant="ghost">
      <LogOut className="mr-2 size-4" />
      Sign out
    </Button>
  );
}
