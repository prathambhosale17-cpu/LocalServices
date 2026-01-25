import {
  Home,
  Car,
  UtensilsCrossed,
  HeartPulse,
  Sparkles,
  BookOpen,
  Truck,
  PartyPopper,
  Vote,
  type LucideIcon
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export const categories: Category[] = [
  {
    id: 'home-services',
    name: 'Home Services',
    icon: Home,
    description: 'Find trusted electricians, plumbers, carpenters, and painters for all your home needs.',
  },
  {
    id: 'tutors-education',
    name: 'Tutors & Education',
    icon: BookOpen,
    description: 'Connect with experienced tutors and coaching classes for academic excellence.',
  },
  {
    id: 'automobile-services',
    name: 'Automobile',
    icon: Car,
    description: 'Reliable mechanics for car and bike repairs, servicing, and washing.',
  },
  {
    id: 'food-services',
    name: 'Food & Catering',
    icon: UtensilsCrossed,
    description: 'Discover local tiffin services, home chefs, and professional caterers.',
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    icon: HeartPulse,
    description: 'Access local doctors, gyms, yoga instructors, and wellness experts.',
  },
  {
    id: 'movers-packers',
    name: 'Movers & Packers',
    icon: Truck,
    description: 'Get professional and hassle-free services for your home or office relocation.',
  },
  {
    id: 'beauty-salon',
    name: 'Beauty & Salon',
    icon: Sparkles,
    description: 'Pamper yourself with services from local salons, spas, and makeup artists.',
  },
  {
    id: 'events-weddings',
    name: 'Events & Weddings',
    icon: PartyPopper,
    description: 'Find the best planners, photographers, and decorators for your special occasions.',
  },
  {
    id: 'election-services',
    name: 'Election Services',
    icon: Vote,
    description: 'Find providers for election-related equipment, materials, and logistical support.',
  },
];
