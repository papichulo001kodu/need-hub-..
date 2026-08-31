export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  iconName: string;
  isEnabled: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  image: string;
  unit: string;
  inStock: boolean;
  stockCount: number;
  isPopular: boolean;
  deliveryCharge?: number;
  rating?: number;
  tags?: string[];
}

export interface Service {
  id: string;
  name: string;
  category: string;
  startingPrice: number;
  priceType: 'fixed' | 'hourly' | 'starting';
  description: string;
  image: string;
  isAvailable: boolean;
  duration: string;
  rating: number;
  popular?: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export interface BookedService {
  serviceId: string;
  name: string;
  price: number;
  date: string;
  timeSlot: string;
  notes?: string;
}

export type OrderStatus = 'Pending' | 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItem[];
  services?: BookedService[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: OrderStatus;
  statusHistory: { status: OrderStatus; timestamp: string; note?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface DeliverySettings {
  standardFee: number;
  freeDeliveryThreshold: number;
  isFreeDeliveryEnabled: boolean;
  estimatedMinutes: string;
  isStoreOpen: boolean;
  supportPhone: string;
  currencySymbol: string;
  isBannerVisible?: boolean;
  bannerTagline?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerBadgeText?: string;
  bannerTheme?: 'emerald' | 'sunset' | 'ocean' | 'purple' | 'amber' | 'dark' | 'rose';
  bannerLinkUrl?: string;
  
  // App Update Announcement Banner
  isAppUpdateBannerVisible?: boolean;
  appUpdateTagline?: string;
  appUpdateTitle?: string;
  appUpdateSubtitle?: string;
  appUpdateVersion?: string;
  appUpdateActionText?: string;
  appUpdateActionUrl?: string;
  appUpdateTheme?: 'emerald' | 'sunset' | 'ocean' | 'purple' | 'amber' | 'dark' | 'rose';
  apkDownloadUrl?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}

export interface CustomerProfile {
  name: string;
  phone: string;
  address: string;
  email?: string;
  hasSeenWelcome?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
