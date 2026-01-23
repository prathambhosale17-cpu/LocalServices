import Link from 'next/link';
import { Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
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
          <Button>List Your Business</Button>
        </nav>
      </div>
    </header>
  );
}
