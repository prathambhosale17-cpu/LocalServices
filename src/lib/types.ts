export interface ProviderProfile {
  id: string;
  name: string;
  category: string;
  tagline?: string;
  location: string;
  phone?: string;
  email: string;
  description?: string;
  services?: string[];
  imageUrl?: string;
}
