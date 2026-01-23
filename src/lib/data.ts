import { Wrench, Zap, SprayCan, Trees, BookOpen, Dog, Building, Utensils, HeartPulse, type LucideIcon } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Provider {
  id: string;
  name: string;
  category: string;
  tagline: string;
  location: string;
  phone: string;
  email: string;
  description: string;
  services: string[];
  reviews: Review[];
  imageId: string;
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

const reviews: Review[] = [
    { id: 'rev-1', author: 'Alice Johnson', rating: 5, comment: 'Fantastic service! Quick, professional, and solved my issue in no time. Highly recommend.', date: 'June 15, 2024' },
    { id: 'rev-2', author: 'Bob Williams', rating: 4, comment: 'Good work, though they arrived a bit later than scheduled. The quality of the work was excellent.', date: 'June 12, 2024' },
    { id: 'rev-3', author: 'Charlie Brown', rating: 3, comment: 'The job was done, but it took longer than expected and was a bit messy.', date: 'May 30, 2024' },
    { id: 'rev-4', author: 'Diana Miller', rating: 5, comment: 'Absolutely the best! I will be using their services again for sure.', date: 'May 25, 2024' },
    { id: 'rev-5', author: 'Ethan Davis', rating: 4, comment: 'Very knowledgeable and friendly staff.', date: 'April 19, 2024' },
    { id: 'rev-6', author: 'Fiona Clark', rating: 5, comment: 'Exceeded all expectations. Worth every penny.', date: 'April 5, 2024' },
];

export const providers: Provider[] = [
  {
    id: 'provider-1',
    name: 'ProFlow Plumbing',
    category: 'Plumbing',
    tagline: 'Your #1 choice for plumbing solutions.',
    location: 'New York, NY',
    phone: '212-555-0101',
    email: 'contact@proflow.com',
    description: 'With over 20 years of experience, ProFlow Plumbing offers comprehensive plumbing services for both residential and commercial properties. We pride ourselves on our reliability and quality workmanship.',
    services: ['Leak Repair', 'Drain Cleaning', 'Water Heater Installation', 'Pipe Replacement'],
    reviews: [reviews[0], reviews[2]],
    imageId: 'provider-1',
  },
  {
    id: 'provider-2',
    name: 'VoltRight Electricians',
    category: 'Electrical',
    tagline: 'Safe, reliable, and efficient electrical work.',
    location: 'Brooklyn, NY',
    phone: '718-555-0102',
    email: 'support@voltright.com',
    description: 'VoltRight is a team of certified electricians ready to tackle any electrical challenge. From minor repairs to full-scale installations, we ensure your home or business is safely powered.',
    services: ['Wiring & Rewiring', 'Lighting Installation', 'Panel Upgrades', 'Outlet Repair'],
    reviews: [reviews[1], reviews[3], reviews[4]],
    imageId: 'provider-2',
  },
  {
    id: 'provider-3',
    name: 'SparkleClean Home',
    category: 'Cleaning',
    tagline: 'We don\'t cut corners, we clean them!',
    location: 'New York, NY',
    phone: '212-555-0103',
    email: 'hello@sparkleclean.com',
    description: 'Let us make your home shine. SparkleClean offers flexible cleaning plans tailored to your needs, using eco-friendly products to ensure a healthy environment for your family.',
    services: ['Deep Cleaning', 'Weekly Maintenance', 'Move-in/Move-out Cleaning', 'Window Washing'],
    reviews: [reviews[5]],
    imageId: 'provider-3',
  },
  {
    id: 'provider-4',
    name: 'EverGreen Landscaping',
    category: 'Landscaping',
    tagline: 'Crafting beautiful outdoor spaces.',
    location: 'Queens, NY',
    phone: '718-555-0104',
    email: 'info@evergreen.com',
    description: 'EverGreen Landscaping transforms ordinary yards into stunning landscapes. Our services range from basic lawn care to complete garden design and installation.',
    services: ['Lawn Mowing', 'Garden Design', 'Tree Trimming', 'Patio Installation'],
    reviews: [reviews[0], reviews[1], reviews[4]],
    imageId: 'provider-4',
  },
  {
    id: 'provider-5',
    name: 'BrightMind Tutors',
    category: 'Tutoring',
    tagline: 'Unlocking student potential, one session at a time.',
    location: 'New York, NY',
    phone: '646-555-0105',
    email: 'learn@brightmind.com',
    description: 'We offer personalized one-on-one and group tutoring for all K-12 subjects. Our experienced tutors are dedicated to helping students build confidence and achieve academic success.',
    services: ['Math Tutoring', 'SAT/ACT Prep', 'English & Writing', 'Science Help'],
    reviews: [reviews[3]],
    imageId: 'provider-5',
  },
  {
    id: 'provider-6',
    name: 'Paws & Claws Pet Care',
    category: 'Pet Services',
    tagline: 'Loving care for your furry friends.',
    location: 'Bronx, NY',
    phone: '347-555-0106',
    email: 'care@pawsandclaws.com',
    description: 'Paws & Claws provides a full range of pet services, including grooming, walking, and boarding. We treat every pet like a member of our own family.',
    services: ['Dog Walking', 'Pet Grooming', 'Overnight Boarding', 'Cat Sitting'],
    reviews: [reviews[0], reviews[5]],
    imageId: 'provider-6',
  },
  {
    id: 'provider-7',
    name: 'SolidRock Construction',
    category: 'Construction',
    tagline: 'Building your vision from the ground up.',
    location: 'Staten Island, NY',
    phone: '718-555-0107',
    email: 'projects@solidrock.com',
    description: 'A full-service construction company specializing in residential and commercial projects. Quality, integrity, and client satisfaction are the cornerstones of our business.',
    services: ['Home Remodeling', 'New Construction', 'Kitchen & Bath', 'Deck & Patio'],
    reviews: [],
    imageId: 'provider-7',
  },
  {
    id: 'provider-8',
    name: 'Gourmet Gatherings Catering',
    category: 'Catering',
    tagline: 'Exquisite food for memorable events.',
    location: 'New York, NY',
    phone: '212-555-0108',
    email: 'events@gourmetgatherings.com',
    description: 'From intimate dinners to large corporate events, we provide exceptional catering services with customizable menus featuring locally sourced ingredients.',
    services: ['Wedding Catering', 'Corporate Events', 'Private Parties', 'Buffet Service'],
    reviews: [reviews[3], reviews[5]],
    imageId: 'provider-8',
  },
  {
    id: 'provider-9',
    name: 'Apex Fitness Training',
    category: 'Personal Training',
    tagline: 'Reach your peak performance.',
    location: 'Brooklyn, NY',
    phone: '718-555-0109',
    email: 'train@apexfitness.com',
    description: 'Our certified personal trainers create customized workout and nutrition plans to help you achieve your fitness goals, whether it\'s weight loss, muscle gain, or athletic performance.',
    services: ['1-on-1 Training', 'Group Classes', 'Nutrition Planning', 'Online Coaching'],
    reviews: [reviews[0]],
    imageId: 'provider-9',
  },
  {
    id: 'provider-10',
    name: 'Current Solutions Electric',
    category: 'Electrical',
    tagline: 'Modern solutions for your electrical needs.',
    location: 'New York, NY',
    phone: '212-555-0110',
    email: 'contact@currentsolutions.com',
    description: 'We specialize in smart home installations and energy-efficient electrical upgrades. Trust our tech-savvy electricians to bring your home into the 21st century.',
    services: ['Smart Home Setup', 'EV Charger Installation', 'LED Lighting Retrofits', 'General Repairs'],
    reviews: [reviews[4], reviews[5]],
    imageId: 'provider-10'
  },
   {
    id: 'provider-11',
    name: 'Reliable Rooter',
    category: 'Plumbing',
    tagline: 'Fast help for clogged drains.',
    location: 'Brooklyn, NY',
    phone: '718-555-0111',
    email: 'help@reliablerooter.com',
    description: 'Specializing in emergency drain cleaning and sewer line repair. We offer 24/7 service to tackle your toughest plumbing problems whenever they arise.',
    services: ['24/7 Emergency Service', 'Sewer Line Repair', 'Hydro Jetting', 'Drain Unclogging'],
    reviews: [reviews[1]],
    imageId: 'provider-11'
  }
];
