'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function SignOut() {
  function handleSignOut() {
    fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(({ logoutUrl }: { logoutUrl?: string }) => {
        window.location.href = logoutUrl || '/';
      })
      .catch(() => {
        window.location.href = '/';
      });
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
      <LogOut className="mr-2 size-4" />
      Sign out
    </Button>
  );
}
