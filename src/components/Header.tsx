'use client';

import Link from 'next/link';
import { Handshake, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase/provider';
import { getAuth, signOut } from 'firebase/auth';

export function Header() {
  const { user } = useUser();
  const auth = getAuth();

  return (
    <header className="bg-card shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Handshake className="h-6 w-6 text-primary" />
          <span className="font-headline">LocalFind</span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/search">Browse Services</Link>
          </Button>
          {!user ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost">List Your Business</Button>
              <Button variant="outline" onClick={() => signOut(auth)}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
