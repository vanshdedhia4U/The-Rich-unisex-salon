export type ServiceCategory = 
  | 'haircut'
  | 'haircolor'
  | 'treatment'
  | 'skin'
  | 'beard'
  | 'spa'
  | 'bridal';

export type GenderTarget = 'women' | 'men' | 'unisex';

export interface SalonService {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryLabel: string;
  gender: GenderTarget;
  durationMinutes: number;
  price: number;
  originalPrice?: number;
  description: string;
  benefits: string[];
  popular?: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  available: boolean;
  avatarSeed: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  stylistName: string;
  serviceId?: string;
  description: string;
  tags: string[];
  gradientTheme: string;
  imageUrl?: string;
  aspectRatio?: '4:3' | '1:1' | '16:9';
  iconType: 'scissors' | 'sparkles' | 'crown' | 'feather' | 'droplet';
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'pay_at_salon';

export type PaymentStatus = 'paid_full' | 'paid_deposit' | 'pay_at_salon';

export type AppointmentStatus = 'confirmed' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  bookingCode: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientNotes?: string;
  services: SalonService[];
  stylistId: string;
  stylistName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "11:30 AM"
  totalAmount: number;
  depositPaid: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface SalonSettings {
  salonName: string;
  tagline: string;
  phonePrimary: string;
  phoneSecondary: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pincode: string;
  googleMapsUrl: string;
  operatingHours: string;
  minAdvanceDeposit: number; // in INR
  ownerEmail: string;
  currencySymbol: string;
}

export interface ClientProfile {
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
}
