import Image from 'next/image';
import { providers } from '@/lib/data';
import type { Provider } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ReviewCard } from '@/components/ReviewCard';
import { Star, MapPin, Phone, Mail } from 'lucide-react';
import { notFound } from 'next/navigation';

function getAverageRating(provider: Provider): number {
  if (!provider.reviews || provider.reviews.length === 0) return 0;
  const total = provider.reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = total / provider.reviews.length;
  return Math.round(average * 10) / 10;
}

export default function ProviderProfilePage({ params }: { params: { id: string } }) {
  const provider = providers.find(p => p.id === params.id);
  
  if (!provider) {
    notFound();
  }

  const placeholderImage = PlaceHolderImages.find(img => img.id === provider.imageId);
  const averageRating = getAverageRating(provider);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-2 space-y-8">
            <Card className="overflow-hidden">
              <CardHeader className="relative h-64 md:h-80 w-full p-0">
                {placeholderImage && (
                  <Image
                    src={placeholderImage.imageUrl}
                    alt={`Hero image for ${provider.name}`}
                    fill
                    className="object-cover"
                    data-ai-hint={placeholderImage.imageHint}
                    priority
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <Badge variant="secondary" className="mb-2 uppercase text-xs tracking-wider">{provider.category}</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{provider.name}</h1>
                  <p className="text-lg text-neutral-200">{provider.tagline}</p>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 font-headline">About {provider.name}</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{provider.description}</p>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 font-headline">Services Offered</h2>
                  <div className="flex flex-wrap gap-2">
                    {provider.services.map(service => (
                      <Badge key={service} variant="outline">{service}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4 font-headline">Reviews ({provider.reviews.length})</h2>
                  <div className="space-y-6">
                    {provider.reviews.length > 0 ? (
                      provider.reviews.map(review => <ReviewCard key={review.id} review={review} />)
                    ) : (
                      <p className="text-muted-foreground">No reviews yet. Be the first to leave one!</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Get in touch with {provider.name}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-muted-foreground">{provider.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={`tel:${provider.phone}`} className="text-muted-foreground hover:text-primary">{provider.phone}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Email</p>
                      <a href={`mailto:${provider.email}`} className="text-muted-foreground hover:text-primary">{provider.email}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Rating</p>
                      <p className="text-muted-foreground">{averageRating > 0 ? `${averageRating.toFixed(1)}/5 (${provider.reviews.length} reviews)` : 'Not yet rated'}</p>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Phone className="mr-2 h-4 w-4" /> Contact Provider
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
