'use client';

import Image from 'next/image';
import { doc, collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { useFirestore, useDoc, useCollection, useMemoFirebase, useUser, WithId } from '@/firebase';
import type { ProviderProfile, Review } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Phone, Globe, Star, ArrowLeft, Send } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useMemo } from 'react';
import { ReviewCard } from '@/components/ReviewCard';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import Link from 'next/link';

function ProviderLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <Card><CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </CardContent></Card>
          <Card><CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </CardContent></Card>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  if (count === 0) {
    return (
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-muted-foreground/50" />
        <span className="text-muted-foreground">No reviews yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`h-5 w-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`} />
        ))}
      </div>
      <span className="font-bold text-lg">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground text-sm">({count} reviews)</span>
    </div>
  );
}

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters.').max(500, 'Review is too long.'),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

function ReviewForm({ providerId }: { providerId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  });
  
  const currentRating = form.watch('rating');

  const handleReviewSubmit = (values: ReviewFormValues) => {
    if (!user || !firestore) return;
    
    const reviewData = {
      providerId,
      userId: user.uid,
      author: user.email || 'Anonymous',
      rating: values.rating,
      comment: values.comment,
      createdAt: serverTimestamp(),
    };
    
    const reviewsColRef = collection(firestore, 'providers', providerId, 'reviews');
    addDoc(reviewsColRef, reviewData)
      .then(() => {
        toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
        form.reset();
      })
      .catch(error => {
        console.error('Review submission failed:', error);
        const permissionError = new FirestorePermissionError({
            path: reviewsColRef.path,
            operation: 'create',
            requestResourceData: reviewData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Submission Failed', description: 'Could not submit your review.' });
      });
  };

  if (!user) {
    return (
      <Card className="bg-muted/30">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">You must be <Link href="/login" className="text-primary font-semibold hover:underline">logged in</Link> to leave a review.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Leave a Review</CardTitle></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleReviewSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-8 w-8 cursor-pointer transition-colors ${ (hoverRating >= star || currentRating >= star) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'}`}
                          onMouseEnter={() => setHoverRating(star)}
                          onClick={() => field.onChange(star)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Share your experience...</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What did you like or dislike?" {...field} className="min-h-[120px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <Send className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const firestore = useFirestore();

  const providerRef = useMemoFirebase(() => doc(firestore, 'providers', id), [firestore, id]);
  const { data: provider, isLoading: isProviderLoading } = useDoc<ProviderProfile>(providerRef);

  const reviewsQuery = useMemoFirebase(() => {
    if (!id) return null;
    return query(collection(firestore, 'providers', id, 'reviews'), orderBy('createdAt', 'desc'));
  }, [firestore, id]);
  const { data: reviews, isLoading: areReviewsLoading } = useCollection<Review>(reviewsQuery);

  const { avgRating, reviewCount } = useMemo(() => {
    if (!reviews || reviews.length === 0) {
      return { avgRating: 0, reviewCount: 0 };
    }
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      avgRating: totalRating / reviews.length,
      reviewCount: reviews.length,
    };
  }, [reviews]);
  
  const fallbackSrc = `https://picsum.photos/seed/${id}/800/600`;
  const [imgSrc, setImgSrc] = useState(provider?.imageUrl || fallbackSrc);

  useEffect(() => {
    if (provider) {
      setImgSrc(provider.imageUrl || fallbackSrc);
    }
  }, [provider, fallbackSrc]);
  
  const isLoading = isProviderLoading || areReviewsLoading;

  if (isLoading) {
    return <ProviderLoadingSkeleton />;
  }

  if (!provider) {
    return notFound();
  }
  
  return (
    <div className="bg-muted/20">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to results
        </Button>

        <div className="grid lg:grid-cols-3 gap-x-8 gap-y-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden shadow-lg">
              <div className="relative h-64 md:h-96 w-full">
                <Image
                  src={imgSrc}
                  alt={`Hero image for ${provider.name}`}
                  onError={() => setImgSrc(fallbackSrc)}
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint="business service"
                />
              </div>
            </Card>

            <div className="space-y-2">
                <Badge variant="secondary" className="uppercase text-sm tracking-wider">{provider.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold font-headline">{provider.name}</h1>
                <StarRating rating={avgRating} count={reviewCount} />
            </div>

            <Card>
              <CardHeader><CardTitle>About {provider.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{provider.description || 'No description provided.'}</p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold font-headline">Customer Reviews</h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <ReviewCard review={review as WithId<Review>} key={review.id} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
              )}
              <ReviewForm providerId={id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
               <Card className="shadow-lg">
                <CardHeader><CardTitle className="font-headline text-xl">Business Information</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                  {provider.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{provider.address}</span>
                    </div>
                  )}
                  {provider.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <a href={`tel:${provider.phone}`} className="text-primary hover:underline">{provider.phone}</a>
                    </div>
                  )}
                  {provider.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" >
                        {provider.website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>

              {provider.services && provider.services.length > 0 && (
                  <Card>
                      <CardHeader><CardTitle className="font-headline text-xl">Services Offered</CardTitle></CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {provider.services.map(service => (
                                <Badge key={service} variant="outline">{service}</Badge>
                            ))}
                        </div>
                      </CardContent>
                  </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
