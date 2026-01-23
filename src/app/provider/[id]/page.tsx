'use client';

import Image from 'next/image';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { ProviderProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, Mail, MessageCircle, Star, ArrowLeft } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

function ProviderLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2 space-y-8">
          <Card className="overflow-hidden">
            <CardHeader className="relative h-80 w-full p-0">
              <Skeleton className="h-full w-full" />
            </CardHeader>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProviderProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const firestore = useFirestore();

  const providerRef = useMemoFirebase(() => {
    if (!id) return null;
    return doc(firestore, 'providers', id);
  }, [firestore, id]);

  const { data: provider, isLoading } = useDoc<ProviderProfile>(providerRef);
  
  if (isLoading) {
    return <ProviderLoadingSkeleton />;
  }

  if (!provider) {
    return notFound();
  }
  
  const whatsappNumber = provider.whatsapp ? provider.whatsapp.replace(/\D/g, '') : '';

  return (
    <div className="bg-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to results
        </Button>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-2 space-y-8">
            <div>
                <Badge variant="secondary" className="mb-2 uppercase text-sm tracking-wider">{provider.category}</Badge>
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-2">{provider.name}</h1>
                {provider.tagline && <p className="text-xl text-muted-foreground">{provider.tagline}</p>}
                
                <div className="flex items-center gap-4 mt-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-5 w-5" />
                        <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-foreground">New</span>
                        <span className="text-sm">(0 reviews)</span>
                    </div>
                </div>
            </div>

            <Card className="overflow-hidden shadow-lg">
              <div className="relative h-64 md:h-96 w-full">
                {provider.imageUrl ? (
                  <Image
                    src={provider.imageUrl}
                    alt={`Hero image for ${provider.name}`}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                        <p className="text-muted-foreground text-lg">No image provided</p>
                    </div>
                )}
              </div>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-8">
                {provider.description && (
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-4 font-headline">About {provider.name}</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-base">{provider.description}</p>
                  </div>
                )}

                {provider.services && provider.services.length > 0 && (
                  <div>
                    <h2 className="text-3xl font-bold mb-4 font-headline">Services Offered</h2>
                    <div className="flex flex-wrap gap-3">
                      {provider.services.map(service => (
                        <Badge key={service} variant="outline" className="text-base py-1 px-3">{service}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <div className="sticky top-28 space-y-6">
               <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Book or Inquire</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {provider.phone && (
                        <Button asChild size="lg" className="w-full text-lg h-14">
                            <a href={`tel:${provider.phone}`} className="flex items-center justify-center">
                                <Phone className="mr-3 h-6 w-6" /> Call Now
                            </a>
                        </Button>
                    )}
                    {whatsappNumber && (
                        <Button asChild size="lg" variant="outline" className="w-full text-lg h-14 border-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700">
                            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                <MessageCircle className="mr-3 h-6 w-6" /> WhatsApp
                            </a>
                        </Button>
                    )}
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {provider.phone && (
                    <div className="flex items-start gap-4">
                      <Phone className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Phone</p>
                        <a href={`tel:${provider.phone}`} className="text-muted-foreground hover:text-primary">{provider.phone}</a>
                      </div>
                    </div>
                  )}
                  {provider.email && (
                    <div className="flex items-start gap-4">
                      <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Email</p>
                        <a href={`mailto:${provider.email}`} className="text-muted-foreground hover:text-primary">{provider.email}</a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
