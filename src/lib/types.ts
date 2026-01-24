export interface ProviderProfile {
  userId?: string;
  name: string;
  category: string;
  tagline?: string;
  location: string;
  address?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  email?: string;
  description?: string;
  services?: string[];
  imageUrl?: string;
}

// Represents a review document from Firestore, without the document ID
export interface Review {
  providerId: string;
  userId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: any; // Can be a Firestore Timestamp
}
