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
import { MapPin, Phone, Globe, Star, ArrowLeft, Send, Share2, Loader2 } from 'lucide-react';
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
import placeholderData from '@/app/lib/placeholder-images.json';

// WhatsApp Icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.049c0 2.123.54 4.197 1.566 6.073L0 24l6.102-1.6c1.805.984 3.834 1.503 5.94 1.503h.005c6.639 0 12.05-5.412 12.053-12.05a11.83 11.83 0 00-3.536-8.451" />
  </svg>
);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '' },
  });
  
  const currentRating = form.watch('rating');

  const handleReviewSubmit = (values: ReviewFormValues) => {
    if (!user || !firestore) return;

    setIsSubmitting(true);
    
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
      .catch(error => {
        console.error('Review submission failed:', error);
        const permissionError = new FirestorePermissionError({
            path: reviewsColRef.path,
            operation: 'create',
            requestResourceData: reviewData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Submission Failed', description: 'Could not submit your review.' });
        setIsSubmitting(false);
      });

    setTimeout(() => {
        setIsSubmitting(false);
        toast({ title: 'Review Submitted', description: 'Thank you for your feedback!' });
        form.reset();
    }, 1000);
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
    <Card className="shadow-lg">
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Review
                </>
              )}
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
  const { toast } = useToast();
  const placeholder = placeholderData['provider-placeholder'];

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
  
  const handleShare = () => {
    const shareData = {
      title: provider?.name || 'LocalFind Service Provider',
      text: provider?.tagline || `Check out ${provider?.name} on LocalFind!`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (navigator.share && navigator.canShare(shareData)) {
      navigator.share(shareData).catch((err) => {
        if (err.name !== 'AbortError') {
           console.error('Error sharing:', err);
        }
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied',
        description: 'Profile link copied to clipboard.',
      });
    }
  };

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
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to results
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share Profile
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-x-8 gap-y-8 lg:gap-y-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden shadow-lg border-none">
              <div className="relative h-64 md:h-96 w-full">
                <Image
                  src={imgSrc}
                  alt={`Hero image for ${provider?.name || 'service provider'}`}
                  onError={() => setImgSrc(fallbackSrc)}
                  fill
                  className="object-cover"
                  priority
                  placeholder="blur"
                  blurDataURL={placeholder.blurDataURL}
                  data-ai-hint="business service"
                />
              </div>
            </Card>

            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="uppercase text-sm tracking-wider bg-primary/10 text-primary hover:bg-primary/10 border-none">{provider?.category}</Badge>
                  {provider?.subcategory && <Badge variant="outline" className="uppercase text-sm tracking-wider border-primary/20 text-primary">{provider.subcategory}</Badge>}
                </div>
                <h1 className="text-3xl md:text-5xl font-bold font-headline">{provider?.name}</h1>
                <StarRating rating={avgRating} count={reviewCount} />
            </div>

            <Card className="shadow-lg border-none">
              <CardHeader><CardTitle>About {provider?.name}</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">{provider?.description || 'No description provided.'}</p>
              </CardContent>
            </Card>

            {/* Services Offered - Main Column */}
            {provider?.services && provider.services.length > 0 && (
                <Card className="shadow-lg border-none">
                    <CardHeader><CardTitle className="font-headline text-2xl">Services Offered</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                          {provider.services.map(service => (
                              <Badge key={service} variant="secondary" className="px-4 py-1.5 text-base font-medium rounded-full bg-primary/5 text-primary hover:bg-primary/10 transition-colors border-none">{service}</Badge>
                          ))}
                      </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-6 pt-8">
              <h2 className="text-3xl font-bold font-headline">Customer Reviews</h2>
              {reviews && reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <ReviewCard review={review as WithId<Review>} key={review.id} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">No reviews yet. Be the first to leave one!</p>
              )}
              <ReviewForm providerId={id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
               <Card className="shadow-lg border-none">
                <CardHeader><CardTitle className="font-headline text-xl">Contact Information</CardTitle></CardHeader>
                <CardContent className="space-y-5 text-sm">
                  {provider?.address && (
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/5 p-2 rounded-lg"><MapPin className="h-5 w-5 text-primary flex-shrink-0" /></div>
                      <span className="text-foreground text-base leading-tight mt-1">{provider.address}</span>
                    </div>
                  )}
                  {provider?.phone && (
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/5 p-2 rounded-lg"><Phone className="h-5 w-5 text-primary flex-shrink-0" /></div>
                      <a href={`tel:${provider.phone}`} className="text-primary hover:underline text-lg font-medium mt-1">{provider.phone}</a>
                    </div>
                  )}
                  {provider?.website && (
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/5 p-2 rounded-lg"><Globe className="h-5 w-5 text-primary flex-shrink-0" /></div>
                      <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-base mt-1 truncate max-w-[200px]" >
                        {provider.website}
                      </a>
                    </div>
                  )}
                  
                  <div className="pt-4 space-y-3">
                    {provider?.phone && (
                      <Button asChild className="w-full bg-primary hover:bg-primary/90 shadow-md h-12 text-lg">
                        <a href={`tel:${provider.phone}`} className="flex items-center justify-center gap-2">
                          <Phone className="h-5 w-5" />
                          Call Now
                        </a>
                      </Button>
                    )}
                    {provider?.whatsapp && (
                      <Button asChild className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none shadow-md h-12 text-lg">
                        <a 
                          href={`https://wa.me/${provider.whatsapp}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2"
                        >
                          <WhatsAppIcon className="h-5 w-5" />
                          Message on WhatsApp
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}