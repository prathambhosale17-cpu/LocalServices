'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, values.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset failed:', error);
      let description = 'An unexpected error occurred. Please try again.';
      if (error instanceof FirebaseError) {
        // We don't want to reveal if an email is registered or not
        description = 'If an account exists for this email, a password reset link has been sent.';
      }
       toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send password reset email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  if (isSubmitted) {
    return (
        <div className="container mx-auto flex min-h-[calc(100vh-15rem)] items-center justify-center px-4 md:px-6">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold font-headline">Check Your Email</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">A password reset link has been sent to the email address you provided, if it exists in our system.</p>
                    <Button asChild className="mt-6 w-full">
                        <Link href="/login">Return to Login</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-15rem)] items-center justify-center px-4 md:px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Forgot Password</CardTitle>
          <CardDescription>Enter your email and we'll send you a link to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </Form>
           <div className="mt-6 text-center text-sm">
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
