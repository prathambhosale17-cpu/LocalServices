import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card text-muted-foreground mt-auto border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-16 md:px-6">
        <div>
          <h3 className="font-bold text-foreground text-xl mb-2 font-headline">LocalFind</h3>
          <p className="text-sm max-w-xs">Connecting communities with trusted local services. Find what you need, right in your neighborhood.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-4">For Users</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/search" className="hover:text-primary">Browse Categories</Link></li>
            <li><Link href="/search" className="hover:text-primary">Search Providers</Link></li>
            <li><Link href="/list-your-business" className="hover:text-primary">List Your Business</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
            <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="bg-muted/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm space-y-2">
          <p>&copy; {new Date().getFullYear()} LocalFind. All rights reserved.</p>
          <p>
            Developed by Pratham Bhosale | Idea by Partha Shekte
          </p>
        </div>
      </div>
    </footer>
  );
}
