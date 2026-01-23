'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { categories } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import Image from 'next/image';

const providerProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  tagline: z.string().min(10, 'Tagline must be at least 10 characters.'),
  location: z.string().min(3, 'Location is required.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  email: z.string().email('Please enter a valid email address.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  services: z.string().min(1, 'Please list at least one service.'), // Comma-separated
  imageUrl: z.string().optional(),
});

type ProviderProfileForm = z.infer<typeof providerProfileSchema>;

export default function ListYourBusinessPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const providerRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'providers', user.uid);
  }, [firestore, user]);

  const { data: providerData, isLoading: isProviderLoading } = useDoc<ProviderProfileForm>(providerRef);

  const form = useForm<ProviderProfileForm>({
    resolver: zodResolver(providerProfileSchema),
    defaultValues: {
      name: '',
      category: '',
      tagline: '',
      location: '',
      phone: '',
      email: user?.email ?? '',
      description: '',
      services: '',
      imageUrl: '',
    },
  });
  
  useEffect(() => {
    if (providerData) {
      form.reset({
        ...providerData,
        services: Array.isArray(providerData.services) ? providerData.services.join(', ') : '',
      });
      if (providerData.imageUrl) {
        setImagePreview(providerData.imageUrl);
      }
    } else {
       form.reset({
            name: '',
            category: '',
            tagline: '',
            location: '',
            phone: '',
            email: user?.email ?? '',
            description: '',
            services: '',
            imageUrl: '',
       });
    }
  }, [providerData, form, user]);

  if (isUserLoading || isProviderLoading) {
    return <div className="container mx-auto p-8">Loading...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        form.setValue('imageUrl', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (values: ProviderProfileForm) => {
    if (!providerRef) return;

    const dataToSave = {
      ...values,
      services: values.services.split(',').map(s => s.trim()).filter(s => s),
      email: user.email // ensure user email is set
    };
    
    setDocumentNonBlocking(providerRef, dataToSave, { merge: true });

    toast({
      title: 'Profile Saved!',
      description: 'Your provider profile has been updated.',
    });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">
            {providerData ? 'Edit Your Business Profile' : 'List Your Business'}
          </CardTitle>
          <CardDescription>
            Fill out the details below to get your services listed on LocalFind.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ProFlow Plumbing" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                </FormControl>
                 {imagePreview && (
                    <div className="mt-4">
                        <Image src={imagePreview} alt="Profile preview" width={200} height={200} className="rounded-md object-cover" />
                    </div>
                )}
                <FormMessage />
              </FormItem>

              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Your #1 choice for plumbing solutions." {...field} />
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
                      <Input placeholder="e.g., New York, NY" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 212-555-0101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="e.g., contact@proflow.com" {...field} disabled/>
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
                      <Textarea placeholder="Tell customers about your business..." className="min-h-[150px]" {...field} />
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
                      <Input placeholder="e.g., Leak Repair, Drain Cleaning, Pipe Replacement" {...field} />
                    </FormControl>
                     <p className="text-sm text-muted-foreground">Enter a comma-separated list of services.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Profile'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
