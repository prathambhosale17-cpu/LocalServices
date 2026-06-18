
'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { collection, query, limit } from 'firebase/firestore';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { SearchBar, SearchBarFallback } from '@/components/SearchBar';
import { Suspense } from 'react';
import { ProviderCard } from '@/components/ProviderCard';
import type { ProviderProfile } from '@/lib/types';
import { ProviderSkeleton } from '@/components/ProviderSkeleton';
import { categories } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Clock, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function RecentSearches() {
  const [searches, setSearches] = useState<any[]>([]);

  const loadSearches = () => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setSearches(recent);
    } catch (e) {}
  };

  useEffect(() => {
    loadSearches();
    window.addEventListener('recentSearchesUpdated', loadSearches);
    return () => window.removeEventListener('recentSearchesUpdated', loadSearches);
  }, []);

  if (searches.length === 0) return null;

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <div className="w-full text-sm text-primary-foreground/70 mb-2 flex items-center justify-center gap-2">
        <Clock className="h-4 w-4" /> Recent Searches
      </div>
      {searches.map((s) => (
        <Link
          key={s.id}
          href={`/search?${new URLSearchParams({ q: s.q, loc: s.loc }).toString()}`}
          className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground text-sm px-4 py-1.5 rounded-full transition-colors backdrop-blur-sm"
        >
          {s.q || 'All Services'} {s.loc && `in ${s.loc}`}
        </Link>
      ))}
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "How do I list my business on LocalFind?",
      answer: "Listing your business is easy! Simply sign up for an account, click the 'List Your Business' button in the header, and fill out your profile details. Your listing will go live immediately."
    },
    {
      question: "Is LocalFind free to use?",
      answer: "Yes, LocalFind is completely free for both users looking for services and service providers listing their businesses."
    },
    {
      question: "How can I contact a service provider?",
      answer: "You can find contact details like phone numbers, email addresses, and websites directly on each service provider's profile page."
    },
    {
      question: "Can I review a service I've used?",
      answer: "Absolutely! We encourage users to leave honest reviews and ratings on provider profiles to help the community make informed decisions. You just need to be logged in to leave a review."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <HelpCircle className="h-12 w-12 mx-auto text-primary mb-4" />
          <h2 className="text-4xl font-bold font-headline">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-3 text-lg">Everything you need to know about using LocalFind.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold text-lg">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default function Home() {
  const firestore = useFirestore();

  const providersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'providers'), limit(6));
  }, [firestore]);

  const { data: providers, isLoading } = useCollection<ProviderProfile>(providersQuery);

  return (
    <>
      <section className="py-20 md:py-32 bg-primary text-primary-foreground overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Find Local Services, Instantly.
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-12 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Your one-stop directory for trusted service providers in your community.
          </p>
          <Suspense fallback={<SearchBarFallback />}>
            <SearchBar />
          </Suspense>
          <RecentSearches />
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-white rounded-full blur-3xl" />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-headline">
              Browse by Category
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">Find the right professional for your needs by browsing our service categories.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-8">
            {categories.map((category) => (
              <Link key={category.id} href={`/search?cat=${category.id}`} className="block group">
                <Card className="h-full text-center p-6 transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:-translate-y-1 border hover:border-primary flex flex-col items-center justify-center aspect-square">
                  <category.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                  <h3 className="font-semibold font-headline text-lg">{category.name}</h3>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-headline">
              Featured Services
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-2xl mx-auto">Discover top-rated professionals for any job, from home repairs to personal wellness.</p>
          </div>
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ProviderSkeleton key={i} />
              ))}
            </div>
          )}
          {providers && providers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {providers.map((provider) => (
                <ProviderCard provider={provider} key={provider.id} />
              ))}
            </div>
          )}
           {!isLoading && (!providers || providers.length === 0) && (
             <div className="text-center py-24 border-2 border-dashed rounded-lg bg-card mt-12">
                <h2 className="text-2xl font-semibold font-headline mb-2">No providers listed yet</h2>
                <p className="text-muted-foreground max-w-sm mx-auto">Check back soon for new services in your area.</p>
              </div>
           )}
        </div>
      </section>

      <FAQSection />
    </>
  );
}
