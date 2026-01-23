import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-muted/50 text-muted-foreground mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-12 md:px-6">
        <div>
          <h3 className="font-bold text-foreground mb-2 font-headline">LocalFind</h3>
          <p className="text-sm">Connecting communities with trusted local services.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">For Users</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/search" className="hover:text-primary">Browse Categories</Link></li>
            <li><Link href="#" className="hover:text-primary">Search Providers</Link></li>
            <li><Link href="#" className="hover:text-primary">How it works</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">For Businesses</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="#" className="hover:text-primary">List Your Business</Link></li>
            <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
            <li><Link href="#" className="hover:text-primary">Support</Link></li>
          </ul>
        </div>
      </div>
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} LocalFind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
