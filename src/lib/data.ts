import {
  Home,
  Car,
  UtensilsCrossed,
  HeartPulse,
  Sparkles,
  BookOpen,
  Truck,
  PartyPopper,
  Wrench,
  Gavel,
  PawPrint,
  Laptop,
  KeyRound,
  Camera,
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
    id: 'home-services',
    name: 'Home Services',
    icon: Home,
    description: 'Find trusted electricians, plumbers, carpenters, and painters for all your home needs.',
    subServices: [
        'Plumber',
        'Electrician',
        'Carpenter',
        'Painter',
        'House Cleaning',
        'Pest Control',
        'Water Tank Cleaning'
    ]
  },
  {
    id: 'tutors-education',
    name: 'Tutors & Education',
    icon: BookOpen,
    description: 'Connect with experienced tutors and coaching classes for academic excellence.',
    subServices: [
        'Home Tutor',
        'Online Tutor',
        'School Subject Coaching',
        'Competitive Exam Coaching',
        'Skill Training (Computer, Spoken English)',
        'Music / Dance / Art Classes'
    ]
  },
  {
    id: 'automobile-services',
    name: 'Automobile',
    icon: Car,
    description: 'Reliable mechanics for car and bike repairs, servicing, and washing.',
    subServices: [
        'Car Repair & Service',
        'Bike Repair',
        'Car Washing',
        'Breakdown Assistance',
        'Towing Service',
        'Driver on Demand'
    ]
  },
  {
    id: 'food-services',
    name: 'Food & Catering',
    icon: UtensilsCrossed,
    description: 'Discover local tiffin services, home chefs, and professional caterers.',
    subServices: [
        'Event Catering',
        'Home Tiffin Service',
        'Cloud Kitchen',
        'Bakery Services',
        'Bulk Food Orders'
    ]
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    icon: HeartPulse,
    description: 'Access local doctors, gyms, yoga instructors, and wellness experts.',
    subServices: [
        'Yoga Trainer',
        'Fitness Trainer',
        'Physiotherapist',
        'Dietitian',
        'Home Nursing Care',
        'Medical Equipment Rental'
    ]
  },
  {
    id: 'movers-packers',
    name: 'Movers & Packers',
    icon: Truck,
    description: 'Get professional and hassle-free services for your home or office relocation.',
    subServices: [
        'Local Shifting',
        'Domestic Shifting',
        'Office Relocation',
        'Packing Services',
        'Warehouse & Storage'
    ]
  },
  {
    id: 'beauty-salon',
    name: 'Beauty & Salon',
    icon: Sparkles,
    description: 'Pamper yourself with services from local salons, spas, and makeup artists.',
    subServices: [
        'Women Salon at Home',
        'Men Grooming',
        'Bridal Makeup',
        'Hair Styling',
        'Spa & Massage'
    ]
  },
  {
    id: 'events-weddings',
    name: 'Events & Weddings',
    icon: PartyPopper,
    description: 'Find the best planners, photographers, and decorators for your special occasions.',
    subServices: [
        'Wedding Planner',
        'Birthday / Party Planner',
        'Decorators',
        'Photographers & Videographers',
        'DJ & Sound Services'
    ]
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: Camera,
    description: 'Capture your special moments with professional photographers for any occasion.',
    subServices: [
        'Wedding Photography',
        'Event Photography',
        'Portrait Photoshoots',
        'Product Photography',
        'Drone Photography'
    ]
  },
  {
    id: 'appliance-repair',
    name: 'Appliance Repair',
    icon: Wrench,
    description: 'Expert repair for your AC, fridge, washing machine, and other home appliances.',
    subServices: [
        'AC Repair',
        'Refrigerator Repair',
        'Washing Machine Repair',
        'TV Repair',
        'RO / Water Purifier Service'
    ]
  },
  {
    id: 'legal-services',
    name: 'Legal Services',
    icon: Gavel,
    description: 'Consult with local lawyers, notaries, and legal advisors for your needs.',
    subServices: [
        'Advocate / Lawyer',
        'Legal Consultation',
        'Property Legal Services',
        'Documentation & Agreements',
        'Company Registration'
    ]
  },
  {
    id: 'pet-services',
    name: 'Pet Services',
    icon: PawPrint,
    description: 'Find veterinarians, groomers, and pet sitters for your furry friends.',
    subServices: [
        'Pet Grooming',
        'Veterinary Services',
        'Pet Boarding',
        'Pet Training',
        'Pet Walking'
    ]
  },
  {
    id: 'it-computer-repair',
    name: 'IT & Computer Repair',
    icon: Laptop,
    description: 'Get help with your laptop, desktop, and other IT-related issues.',
    subServices: [
        'Laptop Repair',
        'Desktop Repair',
        'Mobile Repair',
        'Network Setup',
        'Software Installation',
        'CCTV Installation'
    ]
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: KeyRound,
    description: 'Connect with real estate agents and brokers for buying, selling, or renting property.',
    subServices: [
        'Buy Property',
        'Sell Property',
        'Rent Property',
        'Property Valuation',
        'Real Estate Agent Services'
    ]
  },
];
