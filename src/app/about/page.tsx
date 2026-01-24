
import { Handshake, Target, BookOpen, Users, ShieldCheck, Heart } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="bg-muted/20">
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Handshake className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
            About LocalFind
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-3xl mx-auto">
            Connecting communities with trusted local professionals. We believe in the power of local expertise and are dedicated to making it accessible to everyone.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block bg-primary text-primary-foreground rounded-full p-3">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold font-headline">Our Mission</h2>
              <p className="text-muted-foreground text-lg">
                Our mission is to empower local economies by creating a seamless and trustworthy bridge between skilled service providers and the communities they serve. We aim to simplify the process of finding reliable help, fostering growth for small businesses and convenience for residents.
              </p>
            </div>
            <div>
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <div className="space-y-4">
                     <div className="inline-block bg-primary text-primary-foreground rounded-full p-3">
                        <BookOpen className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold font-headline">Our Story</h2>
                    <p className="text-muted-foreground text-lg">
                      Founded on the principle that finding great local service shouldn't be a chore, LocalFind was born from a desire to support neighborhood businesses. We saw a need for a simple, clean, and user-friendly directory that prioritizes quality and trust, helping users find the right pro for any job.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
         <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold font-headline">
                Why Choose LocalFind?
                </h2>
                <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">We're more than just a directory. We're a partner in your community.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 space-y-3">
                    <ShieldCheck className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="font-semibold font-headline text-xl">Verified Trust</h3>
                    <p className="text-muted-foreground">We encourage a transparent review system, helping you make informed decisions based on real customer experiences.</p>
                </div>
                 <div className="text-center p-6 space-y-3">
                    <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="font-semibold font-headline text-xl">Community Focused</h3>
                    <p className="text-muted-foreground">By choosing local, you're supporting small businesses and strengthening your community's economy.</p>
                </div>
                 <div className="text-center p-6 space-y-3">
                    <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="font-semibold font-headline text-xl">Simple & Free</h3>
                    <p className="text-muted-foreground">Our platform is free for users and offers an easy way for businesses to get listed and found.</p>
                </div>
            </div>
         </div>
      </section>
      
    </div>
  );
}
