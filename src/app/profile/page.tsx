'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase, WithId } from '@/firebase';
import { signOut } from 'firebase/auth';
import { query, collection, where, deleteDoc, doc } from 'firebase/firestore';
import type { ProviderProfile } from '@/lib/types';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Edit, Building } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function BusinessProfileCard({ provider, onDelete }: { provider: WithId<ProviderProfile>, onDelete: (id: string) => void }) {
  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3"><Building /> Your Business Listing</CardTitle>
        <CardDescription>This is the current profile for your business, "{provider.name}".</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Category</h3>
          <p className="text-muted-foreground">{provider.category}</p>
        </div>
        <div>
          <h3 className="font-semibold">Location</h3>
          <p className="text-muted-foreground">{provider.location}</p>
        </div>
        <div className="flex flex-wrap gap-4 pt-4">
          <Button asChild variant="outline">
            <Link href={`/profile/edit-business/${provider.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Edit Listing
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Listing
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your business
                  listing and all associated data like reviews.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(provider.id)} className="bg-destructive hover:bg-destructive/90">
                  Yes, delete it
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

function NoBusinessCard() {
    return (
        <Card className="text-center p-8 border-2 border-dashed mt-8">
            <h2 className="text-xl font-semibold font-headline mb-2">No Business Listed</h2>
            <p className="text-muted-foreground mb-4">You haven't listed a business yet. Get started today!</p>
            <Button asChild>
                <Link href="/list-your-business">List Your Business</Link>
            </Button>
        </Card>
    );
}

export default function ProfilePage() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading, userError } = useUser();
  const { toast } = useToast();

  const providersQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'providers'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: providers, isLoading: areProvidersLoading } = useCollection<ProviderProfile>(providersQuery);

  const provider = providers?.[0];

  useEffect(() => {
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
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out.",
      });
    }
  };

  const handleDelete = async (providerId: string) => {
    if (!firestore) return;
    const providerDocRef = doc(firestore, 'providers', providerId);
    
    deleteDoc(providerDocRef)
      .then(() => {
        toast({
            title: "Listing Deleted",
            description: "Your business listing has been successfully removed.",
        });
      })
      .catch((error) => {
        console.error("Delete failed:", error)
        const permissionError = new FirestorePermissionError({
            path: providerDocRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: "destructive",
            title: "Delete Failed",
            description: "Could not delete the listing. Please try again.",
        });
      });
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
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
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

        {areProvidersLoading && (
            <div className="mt-8">
                <Skeleton className="h-48 w-full" />
            </div>
        )}

        {!areProvidersLoading && provider && <BusinessProfileCard provider={provider as WithId<ProviderProfile>} onDelete={handleDelete} />}

        {!areProvidersLoading && !provider && <NoBusinessCard />}

      </div>
    </div>
  );
}
