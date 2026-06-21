
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
import { Trash2, Edit, Building, Heart, Plus } from 'lucide-react';
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
    <Card className="shadow-lg border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl font-headline font-bold">{provider.name}</CardTitle>
          <CardDescription>{provider.category} • {provider.location}</CardDescription>
        </div>
        <Building className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {provider.tagline && (
          <p className="text-sm text-muted-foreground line-clamp-1 italic">"{provider.tagline}"</p>
        )}
        
        <div className="flex flex-wrap gap-2 pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/profile/edit-business/${provider.id}`}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/provider/${provider.id}`}>
              View Public
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your business
                  listing "{provider.name}" and all associated data.
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
  const { user, isUserLoading } = useUser();
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
            description: "The business listing has been successfully removed.",
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
            <TabsTrigger value="business">My Businesses</TabsTrigger>
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
                    <Building className="h-5 w-5 text-primary" /> Active Listings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{providers?.length || 0}</p>
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

          <TabsContent value="business" className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
                <Building className="h-6 w-6 text-primary" /> My Business Listings
              </h2>
              <Button asChild size="sm">
                <Link href="/list-your-business">
                  <Plus className="mr-2 h-4 w-4" /> Add New
                </Link>
              </Button>
            </div>

            {areProvidersLoading ? (
              <div className="grid gap-4">
                {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
              </div>
            ) : providers && providers.length > 0 ? (
              <div className="grid gap-6">
                {providers.map(p => (
                  <BusinessProfileCard 
                    key={p.id} 
                    provider={p as WithId<ProviderProfile>} 
                    onDelete={handleDelete} 
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center p-12 border-2 border-dashed shadow-lg">
                  <Building className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
                  <h2 className="text-xl font-semibold font-headline mb-2">No Business Listed</h2>
                  <p className="text-muted-foreground mb-6">You haven't listed any businesses yet. Get started today to reach more customers!</p>
                  <Button asChild size="lg">
                      <Link href="/list-your-business">List Your First Business</Link>
                  </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
