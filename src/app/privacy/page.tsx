import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Lock, Eye, UserCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-muted/20 min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <ShieldCheck className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Privacy Policy</h1>
            <p className="text-muted-foreground text-lg">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-primary" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>
                Welcome to LocalFind. We value your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, and safeguard your information when you use our 
                website and services.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-md border-none">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm md:text-base space-y-4">
                <p>
                  <strong>Personal Information:</strong> When you sign up, we collect your email address via Firebase Authentication.
                </p>
                <p>
                  <strong>Business Information:</strong> If you list a business, we collect details such as business name, location, contact numbers, website, and services offered.
                </p>
                <p>
                  <strong>User Content:</strong> We collect reviews and ratings you provide for service providers.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-md border-none">
              <CardHeader>
                <CardTitle className="text-xl font-headline flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  How We Use Your Data
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-sm md:text-base space-y-4">
                <p>
                  We use your information to facilitate the connection between service providers and customers.
                </p>
                <p>
                  Public business listings and reviews are visible to all users to help the community find trusted professionals.
                </p>
                <p>
                  We do not sell or lease your personal information to third parties.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Data Security & Storage</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed space-y-4">
              <p>
                Your data is stored securely using Google Firebase services. We implement industry-standard 
                security measures to protect your data from unauthorized access, alteration, or disclosure.
              </p>
              <p>
                You have the right to manage your business listings or delete your account at any time through your profile settings. 
                Deleted data is removed from our active databases in accordance with our data retention policies.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-none bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-2xl font-bold font-headline">Questions?</h2>
              <p className="opacity-90 max-w-xl mx-auto">
                If you have any questions about this Privacy Policy or our data practices, please contact our support team.
              </p>
              <p className="text-xl font-semibold">contact@localfind.com</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
