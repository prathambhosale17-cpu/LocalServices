import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg">
          <p className="text-muted-foreground">
            Have questions or want to get in touch? Here's how you can reach us.
          </p>
          <div className="flex items-center gap-4">
            <Mail className="h-6 w-6 text-primary" />
            <a href="mailto:contact@localfind.com" className="hover:underline">
              contact@localfind.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="h-6 w-6 text-primary" />
            <span>+91 12345 67890</span>
          </div>
           <div className="pt-4">
            <h3 className="font-semibold text-xl mb-2">Business Inquiries</h3>
            <p className="text-muted-foreground">
              If you are a service provider and would like to be listed on our platform, please send us an email. We are currently building an onboarding process and will get back to you soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
