
'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  providerId: string;
  className?: string;
}

export function FavoriteButton({ providerId, className }: FavoriteButtonProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const favoriteDocRef = useMemoFirebase(() => {
    if (!firestore || !user || !providerId) return null;
    return doc(firestore, 'users', user.uid, 'favorites', providerId);
  }, [firestore, user, providerId]);

  const { data: favorite, isLoading } = useDoc(favoriteDocRef);
  const isFavorited = !!favorite;

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please sign in to save favorites.",
      });
      return;
    }

    if (!favoriteDocRef) return;

    if (isFavorited) {
      deleteDoc(favoriteDocRef).catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: favoriteDocRef.path,
          operation: 'delete'
        }));
      });
    } else {
      const data = { providerId, addedAt: serverTimestamp() };
      setDoc(favoriteDocRef, data).catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: favoriteDocRef.path,
          operation: 'write',
          requestResourceData: data
        }));
      });
    }
  };

  if (!user || isLoading) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm transition-all",
        isFavorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-primary",
        className
      )}
      onClick={toggleFavorite}
    >
      <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
      <span className="sr-only">Favorite</span>
    </Button>
  );
}
