
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase, WithId, useDoc } from '@/firebase';
import { signOut } from 'firebase/auth';
import { query, collection, where, deleteDoc, doc } from 'firebase/firestore';
import type { ProviderProfile } from '@/lib/types';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Edit, Building, MapPin, Phone, Globe, Heart } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProviderCard } from '@/components/ProviderCard';

function FavoriteItem({ favorite }: { favorite: { providerId: string } }) {
  const firestore = useFirestore();
  const providerRef = useMemoFirebase(() => {
    if (!firestore || !favorite.providerId) return null;
    return doc(firestore, 'providers', favorite.providerId);
  }, [firestore, favorite.providerId]);

  const { data: provider, isLoading } = useDoc<ProviderProfile>(providerRef);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (!provider) return null;

  return <ProviderCard provider={provider as WithId<ProviderProfile>} />;
}

function BusinessProfileCard({ provider, onDelete }: { provider: WithId<ProviderProfile>, onDelete: (id: string) => void }) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-3"><Building /> Your Business Listing</CardTitle>
        <CardDescription>This is the current profile for your business, "{provider.name}".</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Category</h3>
                  <p>{provider.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Location</h3>
                  <p>{provider.location}</p>
                </div>
            </div>
             {provider.tagline && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Tagline</h3>
                  <p>{provider.tagline}</p>
                </div>
            )}
             {provider.description && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">About</h3>
                  <p className="whitespace-pre-wrap">{provider.description}</p>
                </div>
            )}
        </div>
        
        <div className="flex flex-wrap gap-4 pt-4 border-t">
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

  const favoritesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'favorites');
  }, [firestore, user]);

  const { data: favorites, isLoading: areFavoritesLoading } = useCollection<{ providerId: string }>(favoritesQuery);

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
        const permissionError = new FirestorePermissionError({
            path: providerDocRef.path,
            operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  if (isUserLoading || !user) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-12">
            <Skeleton className="max-w-4xl mx-auto h-[500px]" />
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
          <div>
            <h1 className="text-3xl font-bold font-headline">My Dashboard</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            Log Out
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="favorites">My Favorites</TabsTrigger>
            <TabsTrigger value="business">My Business</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" /> Saved Favorites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{favorites?.length || 0}</p>
                  <p className="text-muted-foreground text-sm">Saved providers in your collection.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" /> Active Listing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{provider ? 1 : 0}</p>
                  <p className="text-muted-foreground text-sm">Business profiles currently live.</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="favorites">
            <h2 className="text-2xl font-bold font-headline mb-6 flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 fill-current" /> Your Saved Services
            </h2>
            {areFavoritesLoading ? (
              <div className="grid md:grid-cols-2 gap-8">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
              </div>
            ) : favorites && favorites.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-8">
                {favorites.map(fav => (
                  <FavoriteItem key={fav.providerId} favorite={fav} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center border-dashed border-2">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">Start browsing to save your favorite local providers.</p>
                <Button asChild variant="outline">
                  <Link href="/search">Explore Services</Link>
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="business">
            {areProvidersLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : provider ? (
              <BusinessProfileCard provider={provider as WithId<ProviderProfile>} onDelete={handleDelete} />
            ) : (
              <Card className="text-center p-12 border-2 border-dashed shadow-lg">
                  <Building className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h2 className="text-xl font-semibold font-headline mb-2">No Business Listed</h2>
                  <p className="text-muted-foreground mb-6">You haven't listed a business yet. Get started today to reach more customers!</p>
                  <Button asChild size="lg">
                      <Link href="/list-your-business">List Your Business Now</Link>
                  </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
