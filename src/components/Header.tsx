'use client';

import Link from 'next/link';
import { Handshake, LogIn, UserPlus, User as UserIcon, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { useState } from 'react';


export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    setIsSheetOpen(false);
    router.push('/');
  }
  
  const getInitials = (email: string | null) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const commonLinks = (
    <>
      <Button variant="ghost" asChild>
        <Link href="/search">Browse Services</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/categories">All Categories</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href="/contact">Contact</Link>
      </Button>
    </>
  );

  const mobileCommonLinks = (
     <div className="flex flex-col gap-2">
      <SheetClose asChild>
        <Link href="/search" className="text-lg py-2 font-medium">Browse Services</Link>
      </SheetClose>
       <SheetClose asChild>
        <Link href="/categories" className="text-lg py-2 font-medium">All Categories</Link>
      </SheetClose>
       <SheetClose asChild>
        <Link href="/contact" className="text-lg py-2 font-medium">Contact</Link>
      </SheetClose>
    </div>
  );

  const authSection = isUserLoading ? (
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-12 rounded-full" />
    </div>
  ) : user ? (
    <div className="flex items-center gap-2">
      <Button asChild>
        <Link href="/list-your-business">List Your Business</Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-full">
            <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoURL || undefined} alt={user.email || 'User'} />
                <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                    </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <Button variant="ghost" asChild>
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Login
        </Link>
      </Button>
      <Button asChild>
        <Link href="/signup">
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Link>
      </Button>
    </div>
  );

  const mobileAuthSection = isUserLoading ? (
    <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
    </div>
  ) : user ? (
     <div className="flex flex-col gap-4">
        <SheetClose asChild>
            <Link href="/profile" className="flex items-center gap-3 rounded-md p-2 -ml-2 bg-primary/10">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || undefined} alt={user.email || 'User'} />
                    <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">My Profile</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </Link>
        </SheetClose>
        <Separator />
         <SheetClose asChild>
            <Button asChild className="w-full justify-start text-lg p-6">
                <Link href="/list-your-business">List Your Business</Link>
            </Button>
        </SheetClose>
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-lg p-6">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
        </Button>
     </div>
  ) : (
    <div className="flex flex-col gap-4">
        <SheetClose asChild>
            <Button asChild variant="outline" className="w-full text-lg p-6">
                <Link href="/login"><LogIn className="mr-2 h-4 w-4" /> Login</Link>
            </Button>
        </SheetClose>
        <SheetClose asChild>
            <Button asChild className="w-full text-lg p-6">
                <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" /> Sign Up</Link>
            </Button>
        </SheetClose>
    </div>
  );

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Handshake className="h-7 w-7 text-primary" />
          <span className="font-headline">LocalFind</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
            {commonLinks}
            {authSection}
        </nav>
        
        {/* Mobile Nav */}
        <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm p-0">
                    <SheetHeader className="flex-row justify-between items-center p-4 border-b">
                         <Link href="/" className="flex items-center gap-2 font-bold text-lg" onClick={() => setIsSheetOpen(false)}>
                            <Handshake className="h-6 w-6 text-primary" />
                            <span className="font-headline">LocalFind</span>
                        </Link>
                        <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                        <SheetClose className="p-2">
                            <X className="h-6 w-6" />
                            <span className="sr-only">Close</span>
                        </SheetClose>
                    </SheetHeader>
                    <div className="mt-8 flex flex-col justify-between h-[calc(100%-6rem)] p-6">
                        <nav className="flex flex-col gap-4">
                           {mobileCommonLinks}
                        </nav>
                        <div className="mt-auto">
                            <Separator className="my-6" />
                            {mobileAuthSection}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
