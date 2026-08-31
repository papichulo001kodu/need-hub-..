import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  iconName: string;
  itemCount?: number;
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
  passwordHash: string;
  role: 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  address: string;
  email?: string;
  savedAt: string;
}

export interface DatabaseSchema {
  categories: Category[];
  products: Product[];
  services: Service[];
  orders: Order[];
  deliverySettings: DeliverySettings;
  adminUsers: AdminUser[];
  customers: CustomerProfile[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data with high-quality, reliable, aspect-ratio perfect Unsplash imagery
function getInitialData(): DatabaseSchema {
  const envAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase() || 'admin@needhub.com';
  const envAdminPassword = (process.env.ADMIN_PASSWORD || '').trim() || 'Admin@NeedHub2026!';
  const defaultAdminPasswordHash = bcrypt.hashSync(envAdminPassword, 10);

  return {
    deliverySettings: {
      standardFee: 25,
      freeDeliveryThreshold: 299,
      isFreeDeliveryEnabled: false,
      estimatedMinutes: '15-25 mins',
      isStoreOpen: true,
      supportPhone: '+92 300 1234567',
      currencySymbol: '₨',
      isBannerVisible: true,
      bannerTagline: 'Need Hub Express',
      bannerTitle: 'Fresh Groceries & Daily Essentials',
      bannerSubtitle: '⚡ Free delivery on orders over ₨ 299',
      bannerBadgeText: '⚡ Fast',
      bannerTheme: 'emerald'
    },
    adminUsers: [
      {
        id: 'admin-1',
        email: envAdminEmail,
        name: 'Need Hub Superadmin',
        passwordHash: defaultAdminPasswordHash,
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    customers: [],
    categories: [
      {
        id: 'cat-grocery',
        name: 'Grocery',
        slug: 'grocery',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
        iconName: 'ShoppingBag',
        isEnabled: true,
        sortOrder: 1
      },
      {
        id: 'cat-chips',
        name: 'Chips',
        slug: 'chips',
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
        iconName: 'Cookie',
        isEnabled: true,
        sortOrder: 2
      },
      {
        id: 'cat-drinks',
        name: 'Cold Drinks',
        slug: 'cold-drinks',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
        iconName: 'CupSoda',
        isEnabled: true,
        sortOrder: 3
      },
      {
        id: 'cat-biscuits',
        name: 'Biscuits',
        slug: 'biscuits',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80',
        iconName: 'Cookie',
        isEnabled: true,
        sortOrder: 4
      },
      {
        id: 'cat-chocolates',
        name: 'Chocolates',
        slug: 'chocolates',
        image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80',
        iconName: 'Gift',
        isEnabled: true,
        sortOrder: 5
      },
      {
        id: 'cat-snacks',
        name: 'Snacks',
        slug: 'snacks',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80',
        iconName: 'Sparkles',
        isEnabled: true,
        sortOrder: 6
      },
      {
        id: 'cat-dairy',
        name: 'Dairy',
        slug: 'dairy',
        image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&auto=format&fit=crop&q=80',
        iconName: 'Milk',
        isEnabled: true,
        sortOrder: 7
      },
      {
        id: 'cat-bakery',
        name: 'Bakery',
        slug: 'bakery',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
        iconName: 'Cake',
        isEnabled: true,
        sortOrder: 8
      },
      {
        id: 'cat-beverages',
        name: 'Beverages',
        slug: 'beverages',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80',
        iconName: 'Coffee',
        isEnabled: true,
        sortOrder: 9
      },
      {
        id: 'cat-household',
        name: 'Household',
        slug: 'household',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80',
        iconName: 'Home',
        isEnabled: true,
        sortOrder: 10
      },
      {
        id: 'cat-personal-care',
        name: 'Personal Care',
        slug: 'personal-care',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80',
        iconName: 'Smile',
        isEnabled: true,
        sortOrder: 11
      }
    ],
    products: [
      {
        id: 'prod-1',
        categoryId: 'cat-dairy',
        name: 'Fresh Farm Whole Milk',
        description: 'Pure, pasteurized farm fresh homogenized milk rich in calcium and essential vitamins.',
        price: 34,
        oldPrice: 38,
        discountPercent: 10,
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
        unit: '500 ml pouch',
        inStock: true,
        stockCount: 85,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.9
      },
      {
        id: 'prod-2',
        categoryId: 'cat-chips',
        name: 'Classic Salted Potato Crisps',
        description: 'Thinly sliced golden potatoes crisped to perfection and lightly sprinkled with rock salt.',
        price: 20,
        oldPrice: 25,
        discountPercent: 20,
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
        unit: '75 g pack',
        inStock: true,
        stockCount: 140,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.8
      },
      {
        id: 'prod-3',
        categoryId: 'cat-drinks',
        name: 'Sparkling Lemon Lime Fizz',
        description: 'Chilled, crisp sparkling soda with a natural burst of fresh citrus lime zest.',
        price: 45,
        oldPrice: 50,
        discountPercent: 10,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80',
        unit: '750 ml bottle',
        inStock: true,
        stockCount: 65,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.7
      },
      {
        id: 'prod-4',
        categoryId: 'cat-chocolates',
        name: 'Artisan Rich Dark Chocolate 70%',
        description: 'Velvety smooth single-origin cocoa blend with notes of roasted hazelnut and bourbon vanilla.',
        price: 95,
        oldPrice: 120,
        discountPercent: 21,
        image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
        unit: '100 g bar',
        inStock: true,
        stockCount: 45,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.9
      },
      {
        id: 'prod-5',
        categoryId: 'cat-bakery',
        name: 'Freshly Baked Whole Wheat Bread',
        description: 'Soft, fibrous 100% whole grain loaf baked fresh each morning with zero preservatives.',
        price: 45,
        oldPrice: 55,
        discountPercent: 18,
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        unit: '400 g loaf',
        inStock: true,
        stockCount: 30,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.8
      },
      {
        id: 'prod-6',
        categoryId: 'cat-biscuits',
        name: 'Butter Chocochip Crunch Cookies',
        description: 'Golden oven-baked butter cookies loaded with melted milk chocolate chips.',
        price: 40,
        oldPrice: 50,
        discountPercent: 20,
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
        unit: '200 g pack',
        inStock: true,
        stockCount: 90,
        isPopular: false,
        deliveryCharge: 0,
        rating: 4.6
      },
      {
        id: 'prod-7',
        categoryId: 'cat-grocery',
        name: 'Organic Basmati Royal Rice',
        description: 'Aged long-grain aromatic basmati rice known for its delicate fragrance and fluffy texture.',
        price: 160,
        oldPrice: 190,
        discountPercent: 16,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        unit: '1 kg pack',
        inStock: true,
        stockCount: 50,
        isPopular: false,
        deliveryCharge: 0,
        rating: 4.9
      },
      {
        id: 'prod-8',
        categoryId: 'cat-snacks',
        name: 'Spicy Crunchy Masala Peanuts',
        description: 'Roasted peanuts coated in traditional chickpea flour batter with fiery spices.',
        price: 35,
        oldPrice: 40,
        discountPercent: 12,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
        unit: '150 g pack',
        inStock: true,
        stockCount: 110,
        isPopular: false,
        deliveryCharge: 0,
        rating: 4.7
      },
      {
        id: 'prod-9',
        categoryId: 'cat-beverages',
        name: 'Premium Roasted Arabica Coffee',
        description: 'Medium roast 100% pure Arabica ground coffee with caramel undertones.',
        price: 180,
        oldPrice: 220,
        discountPercent: 18,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
        unit: '200 g jar',
        inStock: true,
        stockCount: 40,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.9
      },
      {
        id: 'prod-10',
        categoryId: 'cat-household',
        name: 'Eco Dishwash Gel Active Lemon',
        description: 'Tough on grease, gentle on hands. Made with natural citrus degreasers.',
        price: 75,
        oldPrice: 90,
        discountPercent: 17,
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
        unit: '750 ml bottle',
        inStock: true,
        stockCount: 70,
        isPopular: false,
        deliveryCharge: 0,
        rating: 4.8
      },
      {
        id: 'prod-11',
        categoryId: 'cat-personal-care',
        name: 'Gentle Aloe & Vitamin E Body Wash',
        description: 'Hydrating, sulfate-free daily cleansing gel enriched with pure organic aloe vera.',
        price: 140,
        oldPrice: 175,
        discountPercent: 20,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
        unit: '300 ml pump',
        inStock: true,
        stockCount: 55,
        isPopular: false,
        deliveryCharge: 0,
        rating: 4.8
      },
      {
        id: 'prod-12',
        categoryId: 'cat-dairy',
        name: 'Farm Fresh Organic Eggs (Pack of 6)',
        description: 'Graded grade-A free-range brown eggs packed with clean protein.',
        price: 65,
        oldPrice: 75,
        discountPercent: 13,
        image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600&auto=format&fit=crop&q=80',
        unit: '6 pieces box',
        inStock: true,
        stockCount: 60,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.9
      }
    ],
    services: [
      {
        id: 'srv-1',
        name: 'Deep Home Cleaning',
        category: 'Cleaning',
        startingPrice: 599,
        priceType: 'starting',
        description: 'Comprehensive top-to-bottom sanitize and deep scrubbing for kitchen, bathrooms, floors and living spaces by verified professionals.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        duration: '2 - 4 hours',
        rating: 4.9,
        popular: true
      },
      {
        id: 'srv-2',
        name: 'AC Master Service & Gas Check',
        category: 'Appliance',
        startingPrice: 399,
        priceType: 'fixed',
        description: 'Complete high-pressure jet wash of indoor/outdoor coils, filter cleaning, cooling check, and gas pressure diagnostics.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        duration: '45 - 60 mins',
        rating: 4.8,
        popular: true
      },
      {
        id: 'srv-3',
        name: 'Expert Plumber On-Demand',
        category: 'Plumbing',
        startingPrice: 199,
        priceType: 'starting',
        description: 'Fix leakages, pipe joints, tap replacements, flush tank repairs, water motor troubleshooting, and drain clearance.',
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        duration: '30 - 90 mins',
        rating: 4.7,
        popular: false
      },
      {
        id: 'srv-4',
        name: 'Certified Electrician Visit',
        category: 'Electrical',
        startingPrice: 199,
        priceType: 'starting',
        description: 'Short circuit diagnosis, switchboard repairs, appliance installations, fan replacements, and LED fixture installations.',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        duration: '30 - 60 mins',
        rating: 4.8,
        popular: true
      },
      {
        id: 'srv-5',
        name: 'Eco Car Wash & Interior Detailing',
        category: 'Automotive',
        startingPrice: 349,
        priceType: 'fixed',
        description: 'Doorstep waterless foam wash, high-power vacuuming, dashboard polish, glass shine, and tire dressing.',
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        duration: '45 mins',
        rating: 4.9,
        popular: false
      },
      {
        id: 'srv-6',
        name: 'Herbal Pest Control Treatment',
        category: 'Pest Control',
        startingPrice: 499,
        priceType: 'starting',
        description: 'Odorless, pet-safe and child-safe gel and spray treatment for cockroaches, ants, and termites with 90-day warranty.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        isAvailable: true,
        duration: '1 - 2 hours',
        rating: 4.7,
        popular: false
      }
    ],
    orders: [
      {
        id: 'ord-1001',
        orderNumber: 'NH-94821',
        customerName: 'Rahul Verma',
        customerPhone: '+91 98765 43210',
        deliveryAddress: 'Flat 402, Green Meadows, MG Road, Sector 4',
        items: [
          {
            productId: 'prod-1',
            name: 'Fresh Farm Whole Milk',
            price: 34,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
            unit: '500 ml pouch'
          },
          {
            productId: 'prod-5',
            name: 'Freshly Baked Whole Wheat Bread',
            price: 45,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
            unit: '400 g loaf'
          }
        ],
        subtotal: 113,
        deliveryFee: 25,
        discount: 0,
        total: 138,
        paymentMethod: 'Cash on Delivery',
        status: 'Delivered',
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 4.8).toISOString() },
          { status: 'Preparing', timestamp: new Date(Date.now() - 3600000 * 4.5).toISOString() },
          { status: 'Out for Delivery', timestamp: new Date(Date.now() - 3600000 * 4.2).toISOString() },
          { status: 'Delivered', timestamp: new Date(Date.now() - 3600000 * 4).toISOString() }
        ],
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'ord-1002',
        orderNumber: 'NH-94822',
        customerName: 'Priya Sharma',
        customerPhone: '+91 98111 22334',
        deliveryAddress: 'House 14B, Palm Grove Avenue',
        items: [
          {
            productId: 'prod-4',
            name: 'Artisan Rich Dark Chocolate 70%',
            price: 95,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
            unit: '100 g bar'
          },
          {
            productId: 'prod-9',
            name: 'Premium Roasted Arabica Coffee',
            price: 180,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
            unit: '200 g jar'
          }
        ],
        subtotal: 370,
        deliveryFee: 0,
        discount: 25,
        total: 345,
        paymentMethod: 'UPI / Online',
        status: 'Out for Delivery',
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 3600000 * 0.5).toISOString() },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 3600000 * 0.4).toISOString() },
          { status: 'Preparing', timestamp: new Date(Date.now() - 3600000 * 0.25).toISOString() },
          { status: 'Out for Delivery', timestamp: new Date(Date.now() - 3600000 * 0.1).toISOString() }
        ],
        createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 0.1).toISOString()
      }
    ]
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private ensureDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private load(): DatabaseSchema {
    this.ensureDir();
    let data: DatabaseSchema;
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.deliverySettings) {
          parsed.deliverySettings.currencySymbol = '₨';
        }
        data = parsed;
      } else {
        data = getInitialData();
        this.saveDirect(data);
      }
    } catch (err) {
      console.error('Error reading db.json, generating default data', err);
      data = getInitialData();
      this.saveDirect(data);
    }

    // Sync admin credentials from environment variables if specified
    const envAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const envAdminPassword = (process.env.ADMIN_PASSWORD || '').trim();

    if (envAdminEmail && envAdminPassword) {
      if (!data.adminUsers) data.adminUsers = [];
      const existing = data.adminUsers.find(a => a.email.toLowerCase() === envAdminEmail);
      if (existing) {
        existing.passwordHash = bcrypt.hashSync(envAdminPassword, 10);
        existing.updatedAt = new Date().toISOString();
      } else {
        data.adminUsers.push({
          id: `admin-${Date.now()}`,
          email: envAdminEmail,
          name: 'Store Administrator',
          passwordHash: bcrypt.hashSync(envAdminPassword, 10),
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
      this.saveDirect(data);
    }

    return data;
  }

  private saveDirect(data: DatabaseSchema) {
    this.ensureDir();
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json', err);
    }
  }

  public save() {
    this.saveDirect(this.data);
  }

  // Getters
  public getCategories() {
    return this.data.categories;
  }

  public getProducts() {
    return this.data.products;
  }

  public getServices() {
    return this.data.services;
  }

  public getOrders() {
    return this.data.orders;
  }

  public getDeliverySettings() {
    return this.data.deliverySettings;
  }

  public getAdminUsers() {
    return this.data.adminUsers;
  }

  public getCustomers() {
    return this.data.customers;
  }

  // Category Operations
  public addCategory(cat: Omit<Category, 'id'>): Category {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Product Operations
  public addProduct(prod: Omit<Product, 'id'>): Product {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    this.data.products.push(newProd);
    this.save();
    return newProd;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.save();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Service Operations
  public addService(srv: Omit<Service, 'id'>): Service {
    const newSrv: Service = {
      ...srv,
      id: `srv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    this.data.services.push(newSrv);
    this.save();
    return newSrv;
  }

  public updateService(id: string, updates: Partial<Service>): Service | null {
    const idx = this.data.services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = { ...this.data.services[idx], ...updates };
    this.save();
    return this.data.services[idx];
  }

  public deleteService(id: string): boolean {
    const initialLen = this.data.services.length;
    this.data.services = this.data.services.filter(s => s.id !== id);
    if (this.data.services.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // Order Operations
  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Order {
    const id = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `NH-${randomSuffix}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: orderData.status || 'Pending',
          timestamp: now,
          note: 'Order placed by customer'
        }
      ]
    };

    this.data.orders.unshift(newOrder); // Most recent first
    this.save();
    return newOrder;
  }

  public updateOrderStatus(id: string, status: OrderStatus, note?: string): Order | null {
    const order = this.data.orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    order.statusHistory.push({
      status,
      timestamp: order.updatedAt,
      note: note || `Status updated to ${status}`
    });

    this.save();
    return order;
  }

  public updateDeliverySettings(settings: Partial<DeliverySettings>): DeliverySettings {
    this.data.deliverySettings = { ...this.data.deliverySettings, ...settings };
    this.save();
    return this.data.deliverySettings;
  }

  public saveCustomer(profile: { name: string; phone: string; address: string; email?: string }): CustomerProfile {
    const existingIdx = this.data.customers.findIndex(c => c.phone === profile.phone);
    const now = new Date().toISOString();
    if (existingIdx >= 0) {
      this.data.customers[existingIdx] = {
        ...this.data.customers[existingIdx],
        ...profile,
        savedAt: now
      };
      this.save();
      return this.data.customers[existingIdx];
    } else {
      const newCust: CustomerProfile = {
        id: `cust-${Date.now()}`,
        ...profile,
        savedAt: now
      };
      this.data.customers.push(newCust);
      this.save();
      return newCust;
    }
  }

  public updateAdminCredentials(currentEmail: string, newEmail?: string, newPassword?: string): { success: boolean; message: string; admin?: AdminUser } {
    const admin = this.data.adminUsers.find(a => a.email.toLowerCase() === currentEmail.toLowerCase());
    if (!admin) {
      return { success: false, message: 'Admin account not found' };
    }

    if (newEmail && newEmail.trim() !== '') {
      admin.email = newEmail.trim().toLowerCase();
    }
    if (newPassword && newPassword.trim().length >= 6) {
      admin.passwordHash = bcrypt.hashSync(newPassword.trim(), 10);
    } else if (newPassword && newPassword.trim().length < 6) {
      return { success: false, message: 'Password must be at least 6 characters' };
    }

    admin.updatedAt = new Date().toISOString();
    this.save();
    return { success: true, message: 'Credentials updated securely', admin };
  }
}

export const db = new Database();
