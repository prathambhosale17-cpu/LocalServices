'use client';

import Image from 'next/image';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { ProviderProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { notFound, useParams } from 'next/navigation';

export default function ProviderProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const firestore = useFirestore();

  const providerRef = useMemoFirebase(() => {
    if (!id) return null;
    return doc(firestore, 'providers', id);
  }, [firestore, id]);

  const { data: provider, isLoading } = useDoc<ProviderProfile>(providerRef);
  
  if (isLoading) {
    return <div className="container mx-auto p-8">Loading profile...</div>;
  }

  if (!provider) {
    return notFound();
  }
  
  const whatsappNumber = provider.whatsapp ? provider.whatsapp.replace(/\D/g, '') : '';

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          <div className="md:col-span-2 space-y-8">
            <Card className="overflow-hidden">
              <CardHeader className="relative h-64 md:h-80 w-full p-0">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <Badge variant="secondary" className="mb-2 uppercase text-xs tracking-wider">{provider.category}</Badge>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{provider.name}</h1>
                  {provider.tagline && <p className="text-lg text-neutral-200">{provider.tagline}</p>}
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardContent className="p-6">
                {provider.description && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 font-headline">About {provider.name}</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{provider.description}</p>
                  </div>
                )}

                {provider.services && provider.services.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4 font-headline">Services Offered</h2>
                    <div className="flex flex-wrap gap-2">
                      {provider.services.map(service => (
                        <Badge key={service} variant="outline">{service}</Badge>
                      ))}
                    </div>
                  </div>
                )}
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
                  {provider.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <a href={`tel:${provider.phone}`} className="text-muted-foreground hover:text-primary">{provider.phone}</a>
                      </div>
                    </div>
                  )}
                  {provider.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email</p>
                        <a href={`mailto:${provider.email}`} className="text-muted-foreground hover:text-primary">{provider.email}</a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

               <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Book Now</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {provider.phone && (
                        <Button asChild size="lg" className="w-full text-lg">
                            <a href={`tel:${provider.phone}`}>
                                <Phone className="mr-3 h-5 w-5" /> Call Now
                            </a>
                        </Button>
                    )}
                    {whatsappNumber && (
                        <Button asChild size="lg" variant="outline" className="w-full text-lg">
                            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="mr-3 h-5 w-5" /> WhatsApp
                            </a>
                        </Button>
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
