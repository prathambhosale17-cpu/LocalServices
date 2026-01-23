import { Home, Car, UtensilsCrossed, HeartPulse, ShoppingBag, Sparkles, Trees, Dog, type LucideIcon } from 'lucide-react';

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
    description: 'Expert solutions for plumbing, electrical, and all your home maintenance needs.',
  },
  {
    id: 'auto-repair',
    name: 'Auto Repair',
    icon: Car,
    description: 'Reliable mechanics for car servicing, repairs, and inspections.',
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    icon: UtensilsCrossed,
    description: 'Discover local dining spots, from casual eateries to fine dining experiences.',
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    icon: HeartPulse,
    description: 'Find doctors, gyms, and wellness centers to support a healthy lifestyle.',
  },
  {
    id: 'retail-shopping',
    name: 'Retail & Shopping',
    icon: ShoppingBag,
    description: 'Explore local shops and boutiques for unique products and great deals.',
  },
  {
    id: 'beauty-spas',
    name: 'Beauty & Spas',
    icon: Sparkles,
    description: 'Indulge in relaxation with salons, spas, and personal care services.',
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    icon: Trees,
    description: 'Transform your outdoor spaces with professional garden and lawn care.',
  },
  {
    id: 'pet-services',
    name: 'Pet Services',
    icon: Dog,
    description: 'Top-quality care for your furry friends, from grooming to veterinary services.',
  },
];
