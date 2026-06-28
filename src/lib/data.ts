import {
  Car,
  Activity,
  Sparkles,
  UtensilsCrossed,
  Plane,
  Home,
  Armchair,
  Palette,
  ShoppingBag,
  HardHat,
  Briefcase,
  GraduationCap,
  Wallet,
  Building,
  PartyPopper,
  Shield,
  Cpu,
  Factory,
  PawPrint,
  Sprout,
  Dumbbell,
  Gamepad2,
  Church,
  Truck,
  BriefcaseBusiness,
  Wifi,
  Landmark,
  Flower,
  WashingMachine,
  Baby,
  Bird,
  Zap,
  Camera,
  Gift,
  Book,
  Scissors,
  Cog,
  StickyNote,
  Container,
  type LucideIcon
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  subServices: string[];
}

export const categories: Category[] = [
  {
    id: 'automotive',
    name: 'Automotive',
    icon: Car,
    description: 'Car and bike dealers, repair services, and automotive parts.',
    subServices: ['Car Dealers', 'Bike Dealers', 'Used Cars', 'Used Bikes', 'Car Service', 'Bike Service', 'Car Wash', 'Auto Parts', 'Tyre Shops', 'Battery Dealers', 'Driving Schools', 'Towing Services', 'EV Charging Stations', 'Car Accessories']
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Activity,
    description: 'Hospitals, clinics, pharmacies, and specialized medical care.',
    subServices: ['Hospitals', 'Clinics', 'Doctors', 'Dentists', 'Eye Care', 'Physiotherapy', 'Diagnostic Labs', 'Pharmacies', 'Ambulance', 'Blood Banks', 'Veterinary Clinics', 'Nursing Homes']
  },
  {
    id: 'beauty-wellness',
    name: 'Beauty & Wellness',
    icon: Sparkles,
    description: 'Salons, spas, gyms, and personal grooming services.',
    subServices: ['Beauty Parlours', 'Men\'s Salons', 'Barber Shops', 'Spa', 'Makeup Artists', 'Tattoo Studios', 'Nail Studios', 'Skin Clinics', 'Hair Clinics', 'Yoga Centers', 'Fitness Centers', 'Massage Centers']
  },
  {
    id: 'food-restaurants',
    name: 'Food & Restaurants',
    icon: UtensilsCrossed,
    description: 'Dining, cafes, catering, and food delivery services.',
    subServices: ['Restaurants', 'Cafes', 'Fast Food', 'Bakeries', 'Cake Shops', 'Sweet Shops', 'Ice Cream Parlours', 'Juice Centers', 'Catering Services', 'Tiffin Services', 'Cloud Kitchens', 'Food Trucks']
  },
  {
    id: 'hotels-travel',
    name: 'Hotels & Travel',
    icon: Plane,
    description: 'Accommodations, travel agencies, and transportation rentals.',
    subServices: ['Hotels', 'Resorts', 'Lodges', 'Homestays', 'Travel Agencies', 'Tour Operators', 'Taxi Services', 'Car Rentals', 'Bike Rentals', 'Bus Booking', 'Visa Consultants']
  },
  {
    id: 'home-services',
    name: 'Home Services',
    icon: Home,
    description: 'Repairs, cleaning, and maintenance for your residence.',
    subServices: ['Electricians', 'Plumbers', 'Carpenters', 'Painters', 'Pest Control', 'Cleaning Services', 'Housekeeping', 'AC Repair', 'Refrigerator Repair', 'Washing Machine Repair', 'RO Water Purifier Service', 'Water Tank Cleaning', 'CCTV Installation']
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: Armchair,
    description: 'Furniture stores and custom repair for home and office.',
    subServices: ['Furniture Stores', 'Office Furniture', 'Sofa Stores', 'Bed Stores', 'Mattress Stores', 'Dining Furniture', 'Modular Furniture', 'Custom Furniture', 'Antique Furniture', 'Furniture Repair']
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    icon: Palette,
    description: 'Interior design and decorative items for your space.',
    subServices: ['Home Decor Stores', 'Interior Designers', 'Wallpapers', 'Curtains & Blinds', 'Carpets & Rugs', 'Decorative Items', 'Artificial Plants', 'Lighting Stores', 'Modular Kitchen', 'Kitchen Accessories', 'Bathroom Accessories', 'Home Furnishing']
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: ShoppingBag,
    description: 'Local retail stores from groceries to electronics.',
    subServices: ['Grocery Stores', 'Supermarkets', 'Clothing Stores', 'Footwear Stores', 'Mobile Shops', 'Electronics Stores', 'Jewellery Shops', 'Gift Shops', 'Toy Stores', 'Book Stores', 'Optical Shops', 'Watch Stores']
  },
  {
    id: 'construction',
    name: 'Construction',
    icon: HardHat,
    description: 'Builders, architects, and hardware material suppliers.',
    subServices: ['Builders', 'Architects', 'Civil Contractors', 'Hardware Stores', 'Cement Dealers', 'Steel Suppliers', 'Tiles & Marble', 'Paint Dealers', 'Glass Dealers', 'Fabricators']
  },
  {
    id: 'business-services',
    name: 'Business Services',
    icon: Briefcase,
    description: 'Professional consulting, legal, and marketing services.',
    subServices: ['Chartered Accountants', 'Tax Consultants', 'Lawyers', 'Notary', 'Insurance Agents', 'Digital Marketing', 'Web Development', 'App Development', 'Software Companies', 'Printing Services', 'Advertising Agencies']
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    description: 'Schools, coaching, and skill development institutes.',
    subServices: ['Schools', 'Colleges', 'Coaching Classes', 'Tuition Classes', 'Computer Institutes', 'Spoken English', 'Dance Classes', 'Music Classes', 'Skill Development', 'Libraries']
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: Wallet,
    description: 'Banking, loans, and investment advisory services.',
    subServices: ['Banks', 'ATMs', 'Finance Companies', 'Loan Consultants', 'Mutual Fund Advisors', 'Stock Brokers', 'Gold Loan', 'Insurance Companies']
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: Building,
    description: 'Property dealers and rental property management.',
    subServices: ['Property Dealers', 'Builders', 'Rental Properties', 'PG & Hostels', 'Commercial Properties', 'Warehouses']
  },
  {
    id: 'events-wedding',
    name: 'Events & Wedding',
    icon: PartyPopper,
    description: 'Wedding planners, halls, and event photography.',
    subServices: ['Marriage Halls', 'Wedding Planners', 'Event Planners', 'DJs', 'Photographers', 'Videographers', 'Decorators', 'Mehendi Artists', 'Caterers', 'Flower Decorators']
  },
  {
    id: 'security',
    name: 'Security',
    icon: Shield,
    description: 'Security systems and professional guard services.',
    subServices: ['CCTV Dealers', 'Security Guards', 'Fire Safety', 'Alarm Systems', 'Access Control Systems']
  },
  {
    id: 'it-electronics',
    name: 'IT & Electronics',
    icon: Cpu,
    description: 'Computer, laptop, and mobile repair and networking.',
    subServices: ['Computer Repair', 'Laptop Repair', 'Mobile Repair', 'Printer Repair', 'Networking', 'Data Recovery', 'CCTV Dealers']
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Factory,
    description: 'Wholesalers, distributors, and industrial equipment.',
    subServices: ['Manufacturers', 'Wholesalers', 'Distributors', 'Packaging Companies', 'Industrial Equipment']
  },
  {
    id: 'pets',
    name: 'Pets',
    icon: PawPrint,
    description: 'Pet shops, grooming, and veterinary care.',
    subServices: ['Pet Shops', 'Veterinary Clinics', 'Pet Grooming', 'Pet Boarding']
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    icon: Sprout,
    description: 'Seeds, fertilizers, and agricultural equipment.',
    subServices: ['Seeds', 'Fertilizers', 'Tractor Dealers', 'Dairy Farms', 'Poultry Farms', 'Organic Farming']
  },
  {
    id: 'sports-fitness',
    name: 'Sports & Fitness',
    icon: Dumbbell,
    description: 'Gyms, sports clubs, and athletic training.',
    subServices: ['Gyms', 'Sports Clubs', 'Cricket Academies', 'Football Academies', 'Swimming Pools', 'Martial Arts', 'Sports Equipment']
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: Gamepad2,
    description: 'Movies, amusement parks, and gaming zones.',
    subServices: ['Movie Theatres', 'Gaming Zones', 'Amusement Parks', 'Water Parks', 'Bowling', 'Escape Rooms']
  },
  {
    id: 'religious-community',
    name: 'Religious & Community',
    icon: Church,
    description: 'Community halls and religious centers.',
    subServices: ['Temples', 'Mosques', 'Churches', 'Gurudwaras', 'Ashrams', 'Community Halls']
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: Truck,
    description: 'Movers, packers, and transport companies.',
    subServices: ['Packers & Movers', 'Courier Services', 'Warehousing', 'Transport Companies']
  },
  {
    id: 'jobs-career',
    name: 'Jobs & Career',
    icon: BriefcaseBusiness,
    description: 'Recruitment and career placement services.',
    subServices: ['Recruitment Agencies', 'Placement Services', 'HR Consultants']
  },
  {
    id: 'telecom',
    name: 'Telecom',
    icon: Wifi,
    description: 'Internet, broadband, and mobile services.',
    subServices: ['Internet Providers', 'Broadband Services', 'DTH Services', 'Mobile Recharge', 'SIM Card Stores']
  },
  {
    id: 'government-public',
    name: 'Government & Public Services',
    icon: Landmark,
    description: 'Public offices, police, and municipal services.',
    subServices: ['Government Offices', 'Police Stations', 'Fire Stations', 'Post Offices', 'Passport Services', 'RTO Agents', 'Municipal Offices']
  },
  {
    id: 'garden-outdoor',
    name: 'Garden & Outdoor',
    icon: Flower,
    description: 'Nurseries, landscaping, and outdoor decor.',
    subServices: ['Plant Nurseries', 'Landscaping', 'Garden Furniture', 'Outdoor Decor', 'Irrigation Services']
  },
  {
    id: 'laundry-cleaning',
    name: 'Laundry & Cleaning',
    icon: WashingMachine,
    description: 'Dry cleaning, laundry, and ironing services.',
    subServices: ['Laundry', 'Dry Cleaning', 'Ironing Services', 'Carpet Cleaning']
  },
  {
    id: 'kids-baby',
    name: 'Kids & Baby',
    icon: Baby,
    description: 'Baby stores, toy shops, and day care.',
    subServices: ['Baby Stores', 'Toy Stores', 'Day Care', 'Play Schools']
  },
  {
    id: 'animal-livestock',
    name: 'Animal & Livestock',
    icon: Bird,
    description: 'Dairy, poultry, and fish farming services.',
    subServices: ['Dairy Farms', 'Poultry Farms', 'Fish Farms', 'Animal Feed']
  },
  {
    id: 'energy-utilities',
    name: 'Energy & Utilities',
    icon: Zap,
    description: 'Solar panels, inverters, and water purifiers.',
    subServices: ['Solar Panel Dealers', 'Inverter Dealers', 'Generator Dealers', 'Water Purifier Dealers']
  },
  {
    id: 'media-photography',
    name: 'Media & Photography',
    icon: Camera,
    description: 'Professional studios and drone photography.',
    subServices: ['Photography Studios', 'Videography', 'Photo Printing', 'Drone Photography']
  },
  {
    id: 'gifts-crafts',
    name: 'Gifts & Crafts',
    icon: Gift,
    description: 'Gift shops, handicrafts, and flower shops.',
    subServices: ['Gift Shops', 'Handicrafts', 'Flower Shops', 'Personalized Gifts']
  },
  {
    id: 'books-stationery',
    name: 'Books & Stationery',
    icon: Book,
    description: 'Bookstores, stationery, and printing services.',
    subServices: ['Book Stores', 'Stationery Shops', 'Printing & Xerox']
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: Scissors,
    description: 'Boutiques, tailors, and fashion design.',
    subServices: ['Boutique', 'Tailors', 'Fashion Designers', 'Uniform Suppliers']
  },
  {
    id: 'industrial-services',
    name: 'Industrial Services',
    icon: Cog,
    description: 'Welding, machining, and fabrication services.',
    subServices: ['Welding', 'CNC Machining', 'Laser Cutting', 'Fabrication', 'Powder Coating']
  },
  {
    id: 'office-supplies',
    name: 'Office Supplies',
    icon: StickyNote,
    description: 'Office stationery and modular furniture.',
    subServices: ['Office Stationery', 'Office Equipment', 'Office Furniture']
  },
  {
    id: 'cleaning-products',
    name: 'Cleaning Products',
    icon: Container,
    description: 'Chemicals and housekeeping materials.',
    subServices: ['Cleaning Chemicals', 'Housekeeping Materials', 'Sanitary Products']
  },
];