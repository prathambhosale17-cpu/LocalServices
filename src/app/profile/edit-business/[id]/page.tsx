'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc, updateDoc } from 'firebase/firestore';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { categories } from '@/lib/data';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import type { ProviderProfile } from '@/lib/types';

// Zod schema for form validation
const providerSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  tagline: z.string().max(100, 'Tagline is too long.').optional(),
  location: z.string().min(2, 'Location is required.'),
  address: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().url('Please enter a valid website URL.').optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  email: z.string().email('Invalid email address.').optional().or(z.literal('')),
  description: z.string().max(1000, 'Description is too long.').optional(),
  services: z.string().optional(),
  imageUrl: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

export default function EditBusinessPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const providerId = params.id as string;

  const providerDocRef = useMemoFirebase(() => {
    if (!firestore || !providerId) return null;
    return doc(firestore, 'providers', providerId);
  }, [firestore, providerId]);

  const { data: provider, isLoading: isProviderLoading } = useDoc<ProviderProfile>(providerDocRef);

  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: '', category: '', tagline: '', location: '', address: '', phone: '',
      website: '', whatsapp: '', email: '', description: '', services: '', imageUrl: '',
    },
  });

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (provider) {
      // Security check: ensure the current user owns this document
      if (user && provider.userId !== user.uid) {
        toast({ variant: 'destructive', title: 'Unauthorized', description: "You don't have permission to edit this listing." });
        router.push('/profile');
        return;
      }

      form.reset({
        ...provider,
        services: provider.services?.join(', ') || '',
      });
    }
  }, [provider, user, router, toast, form]);

  async function onSubmit(values: ProviderFormValues) {
    if (!firestore || !user || !provider) return;

    const servicesArray = values.services
      ? values.services.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const submissionData = {
      ...values,
      services: servicesArray,
      userId: user.uid, // Ensure userId is maintained
    };
    
    const providerRef = doc(firestore, 'providers', providerId);
    updateDoc(providerRef, submissionData)
      .then(() => {
        toast({ title: 'Update Successful', description: 'Your business listing has been updated.' });
        router.push('/profile');
      })
      .catch((error) => {
        console.error('Error updating form:', error);
        const permissionError = new FirestorePermissionError({
            path: providerRef.path,
            operation: 'update',
            requestResourceData: submissionData,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: 'Could not update your details. Please try again.',
        });
      });
  }

  const isLoading = isUserLoading || !providerId || isProviderLoading;
  
  if (isLoading) {
    return (
        <div className="container mx-auto flex min-h-[calc(100vh-15rem)] items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  if (!provider) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Edit Your Business</CardTitle>
          <CardDescription>
            Update the details for "{provider.name}" below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sharma Plumbing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline / Slogan</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Fast and reliable service" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Sector 15, Noida" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your city, area, or service region.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123 Main St, Anytown" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Your contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 919876543210" {...field} />
                      </FormControl>
                      <FormDescription>
                         Include country code, without '+' or symbols.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., contact@sharmaplumbing.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website (Optional)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://yourbusiness.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Your Business</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your business and what you offer."
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services Offered</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Leaky Faucets, Pipe Installation, Drain Cleaning"
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      Enter a comma-separated list of your main services.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/your-image.jpg" {...field} />
                    </FormControl>
                     <FormDescription>
                      Direct link to a public image (e.g., from Imgur). Google Photos links will not work.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
