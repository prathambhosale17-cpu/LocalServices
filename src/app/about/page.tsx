import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold font-headline">About Us</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-lg">
          <p className="text-muted-foreground">
            LocalFind is a platform dedicated to connecting communities with trusted local service providers. Our mission is to make it easy to find reliable professionals in your neighborhood.
          </p>
          <div className="pt-4">
            <h3 className="font-semibold text-xl mb-2">Version Information</h3>
            <p className="text-muted-foreground">
              Developer Version
            </p>
          </div>
          <div className="pt-4">
            <h3 className="font-semibold text-xl mb-2">Development Team</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Pratham Bhosale</li>
              <li>Parth Shekte</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
