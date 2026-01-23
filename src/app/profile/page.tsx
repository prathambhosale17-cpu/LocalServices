'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading, userError } = useUser();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // You might want to show a toast message here
    }
  };

  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <Card className="max-w-2xl mx-auto shadow-xl">
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-10 w-24" />
                </CardContent>
            </Card>
        </div>
    );
  }
  
  if (userError) {
      return (
        <div className="container mx-auto p-8 text-center text-red-500">
            <p>Error loading user profile. Please try again later.</p>
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">My Profile</CardTitle>
          <CardDescription>Welcome, you are logged in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="destructive" onClick={handleLogout}>
                Log Out
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
