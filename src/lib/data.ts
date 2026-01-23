import { Wrench, Zap, SprayCan, Trees, BookOpen, Dog, Building, Utensils, HeartPulse, type LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  { id: 'plumbing', name: 'Plumbing', icon: Wrench },
  { id: 'electrical', name: 'Electrical', icon: Zap },
  { id: 'cleaning', name: 'Cleaning', icon: SprayCan },
  { id: 'landscaping', name: 'Landscaping', icon: Trees },
  { id: 'tutoring', name: 'Tutoring', icon: BookOpen },
  { id: 'pet-services', name: 'Pet Services', icon: Dog },
  { id: 'construction', name: 'Construction', icon: Building },
  { id: 'catering', name: 'Catering', icon: Utensils },
  { id: 'personal-training', name: 'Personal Training', icon: HeartPulse },
];
