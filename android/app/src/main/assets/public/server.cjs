var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path2 = __toESM(require("path"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);

// server/db.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var DB_FILE = import_path.default.join(DATA_DIR, "db.json");
function getInitialData() {
  const envAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase() || "admin@needhub.com";
  const envAdminPassword = (process.env.ADMIN_PASSWORD || "").trim() || "Admin@NeedHub2026!";
  const defaultAdminPasswordHash = import_bcryptjs.default.hashSync(envAdminPassword, 10);
  return {
    deliverySettings: {
      standardFee: 25,
      freeDeliveryThreshold: 299,
      isFreeDeliveryEnabled: false,
      estimatedMinutes: "15-25 mins",
      isStoreOpen: true,
      supportPhone: "+92 300 1234567",
      currencySymbol: "\u20A8"
    },
    adminUsers: [
      {
        id: "admin-1",
        email: envAdminEmail,
        name: "Need Hub Superadmin",
        passwordHash: defaultAdminPasswordHash,
        role: "admin",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    ],
    customers: [],
    categories: [
      {
        id: "cat-grocery",
        name: "Grocery",
        slug: "grocery",
        image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
        iconName: "ShoppingBag",
        isEnabled: true,
        sortOrder: 1
      },
      {
        id: "cat-chips",
        name: "Chips",
        slug: "chips",
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80",
        iconName: "Cookie",
        isEnabled: true,
        sortOrder: 2
      },
      {
        id: "cat-drinks",
        name: "Cold Drinks",
        slug: "cold-drinks",
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80",
        iconName: "CupSoda",
        isEnabled: true,
        sortOrder: 3
      },
      {
        id: "cat-biscuits",
        name: "Biscuits",
        slug: "biscuits",
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=80",
        iconName: "Cookie",
        isEnabled: true,
        sortOrder: 4
      },
      {
        id: "cat-chocolates",
        name: "Chocolates",
        slug: "chocolates",
        image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&auto=format&fit=crop&q=80",
        iconName: "Gift",
        isEnabled: true,
        sortOrder: 5
      },
      {
        id: "cat-snacks",
        name: "Snacks",
        slug: "snacks",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
        iconName: "Sparkles",
        isEnabled: true,
        sortOrder: 6
      },
      {
        id: "cat-dairy",
        name: "Dairy",
        slug: "dairy",
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=500&auto=format&fit=crop&q=80",
        iconName: "Milk",
        isEnabled: true,
        sortOrder: 7
      },
      {
        id: "cat-bakery",
        name: "Bakery",
        slug: "bakery",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
        iconName: "Cake",
        isEnabled: true,
        sortOrder: 8
      },
      {
        id: "cat-beverages",
        name: "Beverages",
        slug: "beverages",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=80",
        iconName: "Coffee",
        isEnabled: true,
        sortOrder: 9
      },
      {
        id: "cat-household",
        name: "Household",
        slug: "household",
        image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&auto=format&fit=crop&q=80",
        iconName: "Home",
        isEnabled: true,
        sortOrder: 10
      },
      {
        id: "cat-personal-care",
        name: "Personal Care",
        slug: "personal-care",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=80",
        iconName: "Smile",
        isEnabled: true,
        sortOrder: 11
      }
    ],
    products: [
      {
        id: "prod-1",
        categoryId: "cat-dairy",
        name: "Fresh Farm Whole Milk",
        description: "Pure, pasteurized farm fresh homogenized milk rich in calcium and essential vitamins.",
        price: 34,
        oldPrice: 38,
        discountPercent: 10,
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80",
        unit: "500 ml pouch",
        inStock: true,
        stockCount: 85,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.9
      },
      {
        id: "prod-2",
        categoryId: "cat-chips",
        name: "Classic Salted Potato Crisps",
        description: "Thinly sliced golden potatoes crisped to perfection and lightly sprinkled with rock salt.",
        price: 20,
        oldPrice: 25,
        discountPercent: 20,
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80",
        unit: "75 g pack",
        inStock: true,
        stockCount: 140,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.8
      },
      {
        id: "prod-3",
        categoryId: "cat-drinks",
        name: "Sparkling Lemon Lime Fizz",
        description: "Chilled, crisp sparkling soda with a natural burst of fresh citrus lime zest.",
        price: 45,
        oldPrice: 50,
        discountPercent: 10,
        image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
        unit: "750 ml bottle",
        inStock: true,
        stockCount: 65,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.7
      },
      {
        id: "prod-4",
        categoryId: "cat-chocolates",
        name: "Artisan Rich Dark Chocolate 70%",
        description: "Velvety smooth single-origin cocoa blend with notes of roasted hazelnut and bourbon vanilla.",
        price: 95,
        oldPrice: 120,
        discountPercent: 21,
        image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80",
        unit: "100 g bar",
        inStock: true,
        stockCount: 45,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.9
      },
      {
        id: "prod-5",
        categoryId: "cat-bakery",
        name: "Freshly Baked Whole Wheat Bread",
        description: "Soft, fibrous 100% whole grain loaf baked fresh each morning with zero preservatives.",
        price: 45,
        oldPrice: 55,
        discountPercent: 18,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
        unit: "400 g loaf",
        inStock: true,
        stockCount: 30,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.8
      },
      {
        id: "prod-6",
        categoryId: "cat-biscuits",
        name: "Butter Chocochip Crunch Cookies",
        description: "Golden oven-baked butter cookies loaded with melted milk chocolate chips.",
        price: 40,
        oldPrice: 50,
        discountPercent: 20,
        image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
        unit: "200 g pack",
        inStock: true,
        stockCount: 90,
        isPopular: false,
        deliveryCharge: 0,
        rating: 4.6
      },
      {
        id: "prod-7",
        categoryId: "cat-grocery",
        name: "Organic Basmati Royal Rice",
        description: "Aged long-grain aromatic basmati rice known for its delicate fragrance and fluffy texture.",
        price: 160,
        oldPrice: 190,
        discountPercent: 16,
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
        unit: "1 kg pack",
        inStock: true,
        stockCount: 50,
        isPopular: false,
        deliveryCharge: 0,
        rating: 4.9
      },
      {
        id: "prod-8",
        categoryId: "cat-snacks",
        name: "Spicy Crunchy Masala Peanuts",
        description: "Roasted peanuts coated in traditional chickpea flour batter with fiery spices.",
        price: 35,
        oldPrice: 40,
        discountPercent: 12,
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
        unit: "150 g pack",
        inStock: true,
        stockCount: 110,
        isPopular: false,
        deliveryCharge: 0,
        rating: 4.7
      },
      {
        id: "prod-9",
        categoryId: "cat-beverages",
        name: "Premium Roasted Arabica Coffee",
        description: "Medium roast 100% pure Arabica ground coffee with caramel undertones.",
        price: 180,
        oldPrice: 220,
        discountPercent: 18,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
        unit: "200 g jar",
        inStock: true,
        stockCount: 40,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.9
      },
      {
        id: "prod-10",
        categoryId: "cat-household",
        name: "Eco Dishwash Gel Active Lemon",
        description: "Tough on grease, gentle on hands. Made with natural citrus degreasers.",
        price: 75,
        oldPrice: 90,
        discountPercent: 17,
        image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80",
        unit: "750 ml bottle",
        inStock: true,
        stockCount: 70,
        isPopular: false,
        deliveryCharge: 0,
        rating: 4.8
      },
      {
        id: "prod-11",
        categoryId: "cat-personal-care",
        name: "Gentle Aloe & Vitamin E Body Wash",
        description: "Hydrating, sulfate-free daily cleansing gel enriched with pure organic aloe vera.",
        price: 140,
        oldPrice: 175,
        discountPercent: 20,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
        unit: "300 ml pump",
        inStock: true,
        stockCount: 55,
        isPopular: false,
        deliveryCharge: 0,
        rating: 4.8
      },
      {
        id: "prod-12",
        categoryId: "cat-dairy",
        name: "Farm Fresh Organic Eggs (Pack of 6)",
        description: "Graded grade-A free-range brown eggs packed with clean protein.",
        price: 65,
        oldPrice: 75,
        discountPercent: 13,
        image: "https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=600&auto=format&fit=crop&q=80",
        unit: "6 pieces box",
        inStock: true,
        stockCount: 60,
        isPopular: true,
        deliveryCharge: 0,
        rating: 4.9
      }
    ],
    services: [
      {
        id: "srv-1",
        name: "Deep Home Cleaning",
        category: "Cleaning",
        startingPrice: 599,
        priceType: "starting",
        description: "Comprehensive top-to-bottom sanitize and deep scrubbing for kitchen, bathrooms, floors and living spaces by verified professionals.",
        image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
        duration: "2 - 4 hours",
        rating: 4.9,
        popular: true
      },
      {
        id: "srv-2",
        name: "AC Master Service & Gas Check",
        category: "Appliance",
        startingPrice: 399,
        priceType: "fixed",
        description: "Complete high-pressure jet wash of indoor/outdoor coils, filter cleaning, cooling check, and gas pressure diagnostics.",
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
        duration: "45 - 60 mins",
        rating: 4.8,
        popular: true
      },
      {
        id: "srv-3",
        name: "Expert Plumber On-Demand",
        category: "Plumbing",
        startingPrice: 199,
        priceType: "starting",
        description: "Fix leakages, pipe joints, tap replacements, flush tank repairs, water motor troubleshooting, and drain clearance.",
        image: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
        duration: "30 - 90 mins",
        rating: 4.7,
        popular: false
      },
      {
        id: "srv-4",
        name: "Certified Electrician Visit",
        category: "Electrical",
        startingPrice: 199,
        priceType: "starting",
        description: "Short circuit diagnosis, switchboard repairs, appliance installations, fan replacements, and LED fixture installations.",
        image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
        duration: "30 - 60 mins",
        rating: 4.8,
        popular: true
      },
      {
        id: "srv-5",
        name: "Eco Car Wash & Interior Detailing",
        category: "Automotive",
        startingPrice: 349,
        priceType: "fixed",
        description: "Doorstep waterless foam wash, high-power vacuuming, dashboard polish, glass shine, and tire dressing.",
        image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
        duration: "45 mins",
        rating: 4.9,
        popular: false
      },
      {
        id: "srv-6",
        name: "Herbal Pest Control Treatment",
        category: "Pest Control",
        startingPrice: 499,
        priceType: "starting",
        description: "Odorless, pet-safe and child-safe gel and spray treatment for cockroaches, ants, and termites with 90-day warranty.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
        isAvailable: true,
        duration: "1 - 2 hours",
        rating: 4.7,
        popular: false
      }
    ],
    orders: [
      {
        id: "ord-1001",
        orderNumber: "NH-94821",
        customerName: "Rahul Verma",
        customerPhone: "+91 98765 43210",
        deliveryAddress: "Flat 402, Green Meadows, MG Road, Sector 4",
        items: [
          {
            productId: "prod-1",
            name: "Fresh Farm Whole Milk",
            price: 34,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80",
            unit: "500 ml pouch"
          },
          {
            productId: "prod-5",
            name: "Freshly Baked Whole Wheat Bread",
            price: 45,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
            unit: "400 g loaf"
          }
        ],
        subtotal: 113,
        deliveryFee: 25,
        discount: 0,
        total: 138,
        paymentMethod: "Cash on Delivery",
        status: "Delivered",
        statusHistory: [
          { status: "Pending", timestamp: new Date(Date.now() - 36e5 * 5).toISOString() },
          { status: "Confirmed", timestamp: new Date(Date.now() - 36e5 * 4.8).toISOString() },
          { status: "Preparing", timestamp: new Date(Date.now() - 36e5 * 4.5).toISOString() },
          { status: "Out for Delivery", timestamp: new Date(Date.now() - 36e5 * 4.2).toISOString() },
          { status: "Delivered", timestamp: new Date(Date.now() - 36e5 * 4).toISOString() }
        ],
        createdAt: new Date(Date.now() - 36e5 * 5).toISOString(),
        updatedAt: new Date(Date.now() - 36e5 * 4).toISOString()
      },
      {
        id: "ord-1002",
        orderNumber: "NH-94822",
        customerName: "Priya Sharma",
        customerPhone: "+91 98111 22334",
        deliveryAddress: "House 14B, Palm Grove Avenue",
        items: [
          {
            productId: "prod-4",
            name: "Artisan Rich Dark Chocolate 70%",
            price: 95,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80",
            unit: "100 g bar"
          },
          {
            productId: "prod-9",
            name: "Premium Roasted Arabica Coffee",
            price: 180,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80",
            unit: "200 g jar"
          }
        ],
        subtotal: 370,
        deliveryFee: 0,
        discount: 25,
        total: 345,
        paymentMethod: "UPI / Online",
        status: "Out for Delivery",
        statusHistory: [
          { status: "Pending", timestamp: new Date(Date.now() - 36e5 * 0.5).toISOString() },
          { status: "Confirmed", timestamp: new Date(Date.now() - 36e5 * 0.4).toISOString() },
          { status: "Preparing", timestamp: new Date(Date.now() - 36e5 * 0.25).toISOString() },
          { status: "Out for Delivery", timestamp: new Date(Date.now() - 36e5 * 0.1).toISOString() }
        ],
        createdAt: new Date(Date.now() - 36e5 * 0.5).toISOString(),
        updatedAt: new Date(Date.now() - 36e5 * 0.1).toISOString()
      }
    ]
  };
}
var Database = class {
  constructor() {
    this.data = this.load();
  }
  ensureDir() {
    if (!import_fs.default.existsSync(DATA_DIR)) {
      import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
    }
  }
  load() {
    this.ensureDir();
    let data;
    try {
      if (import_fs.default.existsSync(DB_FILE)) {
        const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.deliverySettings) {
          parsed.deliverySettings.currencySymbol = "\u20A8";
        }
        data = parsed;
      } else {
        data = getInitialData();
        this.saveDirect(data);
      }
    } catch (err) {
      console.error("Error reading db.json, generating default data", err);
      data = getInitialData();
      this.saveDirect(data);
    }
    const envAdminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const envAdminPassword = (process.env.ADMIN_PASSWORD || "").trim();
    if (envAdminEmail && envAdminPassword) {
      if (!data.adminUsers) data.adminUsers = [];
      const existing = data.adminUsers.find((a) => a.email.toLowerCase() === envAdminEmail);
      if (existing) {
        existing.passwordHash = import_bcryptjs.default.hashSync(envAdminPassword, 10);
        existing.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      } else {
        data.adminUsers.push({
          id: `admin-${Date.now()}`,
          email: envAdminEmail,
          name: "Store Administrator",
          passwordHash: import_bcryptjs.default.hashSync(envAdminPassword, 10),
          role: "admin",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      this.saveDirect(data);
    }
    return data;
  }
  saveDirect(data) {
    this.ensureDir();
    try {
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving db.json", err);
    }
  }
  save() {
    this.saveDirect(this.data);
  }
  // Getters
  getCategories() {
    return this.data.categories;
  }
  getProducts() {
    return this.data.products;
  }
  getServices() {
    return this.data.services;
  }
  getOrders() {
    return this.data.orders;
  }
  getDeliverySettings() {
    return this.data.deliverySettings;
  }
  getAdminUsers() {
    return this.data.adminUsers;
  }
  getCustomers() {
    return this.data.customers;
  }
  // Category Operations
  addCategory(cat) {
    const newCat = {
      ...cat,
      id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    this.data.categories.push(newCat);
    this.save();
    return newCat;
  }
  updateCategory(id, updates) {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }
  deleteCategory(id) {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
  // Product Operations
  addProduct(prod) {
    const newProd = {
      ...prod,
      id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    this.data.products.push(newProd);
    this.save();
    return newProd;
  }
  updateProduct(id, updates) {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };
    this.save();
    return this.data.products[idx];
  }
  deleteProduct(id) {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter((p) => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
  // Service Operations
  addService(srv) {
    const newSrv = {
      ...srv,
      id: `srv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`
    };
    this.data.services.push(newSrv);
    this.save();
    return newSrv;
  }
  updateService(id, updates) {
    const idx = this.data.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.data.services[idx] = { ...this.data.services[idx], ...updates };
    this.save();
    return this.data.services[idx];
  }
  deleteService(id) {
    const initialLen = this.data.services.length;
    this.data.services = this.data.services.filter((s) => s.id !== id);
    if (this.data.services.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
  // Order Operations
  createOrder(orderData) {
    const id = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const randomSuffix = Math.floor(1e4 + Math.random() * 9e4);
    const orderNumber = `NH-${randomSuffix}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newOrder = {
      ...orderData,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: orderData.status || "Pending",
          timestamp: now,
          note: "Order placed by customer"
        }
      ]
    };
    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }
  updateOrderStatus(id, status, note) {
    const order = this.data.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    order.statusHistory.push({
      status,
      timestamp: order.updatedAt,
      note: note || `Status updated to ${status}`
    });
    this.save();
    return order;
  }
  updateDeliverySettings(settings) {
    this.data.deliverySettings = { ...this.data.deliverySettings, ...settings };
    this.save();
    return this.data.deliverySettings;
  }
  saveCustomer(profile) {
    const existingIdx = this.data.customers.findIndex((c) => c.phone === profile.phone);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    if (existingIdx >= 0) {
      this.data.customers[existingIdx] = {
        ...this.data.customers[existingIdx],
        ...profile,
        savedAt: now
      };
      this.save();
      return this.data.customers[existingIdx];
    } else {
      const newCust = {
        id: `cust-${Date.now()}`,
        ...profile,
        savedAt: now
      };
      this.data.customers.push(newCust);
      this.save();
      return newCust;
    }
  }
  updateAdminCredentials(currentEmail, newEmail, newPassword) {
    const admin = this.data.adminUsers.find((a) => a.email.toLowerCase() === currentEmail.toLowerCase());
    if (!admin) {
      return { success: false, message: "Admin account not found" };
    }
    if (newEmail && newEmail.trim() !== "") {
      admin.email = newEmail.trim().toLowerCase();
    }
    if (newPassword && newPassword.trim().length >= 6) {
      admin.passwordHash = import_bcryptjs.default.hashSync(newPassword.trim(), 10);
    } else if (newPassword && newPassword.trim().length < 6) {
      return { success: false, message: "Password must be at least 6 characters" };
    }
    admin.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.save();
    return { success: true, message: "Credentials updated securely", admin };
  }
};
var db = new Database();

// server.ts
var app = (0, import_express.default)();
var PORT = 3e3;
var JWT_SECRET = process.env.JWT_SECRET || "needhub-secret-key-2026-auth-token-secure";
app.use(import_express.default.json({ limit: "10mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "10mb" }));
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Admin token required." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden. Admin privileges required." });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired authentication token." });
  }
}
var publicDir = import_path2.default.join(process.cwd(), "public");
app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.sendFile(import_path2.default.join(publicDir, "manifest.json"));
});
app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Service-Worker-Allowed", "/");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.sendFile(import_path2.default.join(publicDir, "sw.js"));
});
app.get("/offline.html", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.sendFile(import_path2.default.join(publicDir, "offline.html"));
});
app.get(["/icon-192.png", "/icon-512.png", "/icon-maskable.png", "/needhub-logo.png"], (req, res) => {
  const filename = import_path2.default.basename(req.path);
  const iconPath = import_path2.default.join(publicDir, filename);
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.sendFile(iconPath);
});
app.get("/icon.svg", (req, res) => {
  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.sendFile(import_path2.default.join(publicDir, "icon.svg"));
});
app.get("/favicon.ico", (req, res) => {
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.sendFile(import_path2.default.join(publicDir, "icon-192.png"));
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/config", (req, res) => {
  const delivery = db.getDeliverySettings();
  res.json({
    appName: "Need Hub",
    tagline: "Instant Groceries & Trusted Services",
    deliverySettings: delivery,
    categoriesCount: db.getCategories().filter((c) => c.isEnabled).length,
    productsCount: db.getProducts().filter((p) => p.inStock).length,
    servicesCount: db.getServices().filter((s) => s.isAvailable).length
  });
});
app.get("/api/categories", (req, res) => {
  const all = req.query.all === "true";
  const cats = db.getCategories();
  if (all) {
    return res.json(cats);
  }
  const enabled = cats.filter((c) => c.isEnabled).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  res.json(enabled);
});
app.get("/api/products", (req, res) => {
  const { categoryId, search, popular, inStockOnly } = req.query;
  let products = db.getProducts();
  if (categoryId && typeof categoryId === "string" && categoryId !== "all") {
    products = products.filter((p) => p.categoryId === categoryId);
  }
  if (popular === "true") {
    products = products.filter((p) => p.isPopular);
  }
  if (inStockOnly === "true") {
    products = products.filter((p) => p.inStock);
  }
  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.toLowerCase().trim();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags && p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }
  res.json(products);
});
app.get("/api/products/:id", (req, res) => {
  const product = db.getProducts().find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});
app.get("/api/services", (req, res) => {
  const { category, search, availableOnly } = req.query;
  let services = db.getServices();
  if (availableOnly === "true") {
    services = services.filter((s) => s.isAvailable);
  }
  if (category && typeof category === "string" && category !== "all") {
    services = services.filter((s) => s.category.toLowerCase() === category.toLowerCase());
  }
  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.toLowerCase().trim();
    services = services.filter(
      (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }
  res.json(services);
});
app.get("/api/services/:id", (req, res) => {
  const service = db.getServices().find((s) => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json(service);
});
app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) {
    return res.json({ products: [], categories: [], services: [] });
  }
  const matchingCategories = db.getCategories().filter(
    (c) => c.isEnabled && (c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
  );
  const matchingProducts = db.getProducts().filter(
    (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );
  const matchingServices = db.getServices().filter(
    (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
  );
  res.json({
    categories: matchingCategories,
    products: matchingProducts,
    services: matchingServices
  });
});
app.get("/api/orders", (req, res) => {
  const phone = req.query.phone;
  let orders = db.getOrders();
  if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    orders = orders.filter((o) => o.customerPhone.replace(/[^0-9]/g, "").includes(cleanPhone));
  }
  res.json(orders);
});
app.get("/api/orders/:id", (req, res) => {
  const order = db.getOrders().find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
});
app.post("/api/orders", (req, res) => {
  try {
    const { customerName, customerPhone, deliveryAddress, items, services, paymentMethod } = req.body;
    if (!customerName || !customerPhone || !deliveryAddress) {
      return res.status(400).json({ error: "Customer name, phone and address are required" });
    }
    if ((!items || items.length === 0) && (!services || services.length === 0)) {
      return res.status(400).json({ error: "Order must contain at least one product or service" });
    }
    db.saveCustomer({ name: customerName, phone: customerPhone, address: deliveryAddress });
    let subtotal = 0;
    const verifiedItems = [];
    if (items && Array.isArray(items)) {
      for (const item of items) {
        const prod = db.getProducts().find((p) => p.id === item.productId);
        if (prod) {
          const qty = Math.max(1, Number(item.quantity) || 1);
          const price = prod.price;
          subtotal += price * qty;
          verifiedItems.push({
            productId: prod.id,
            name: prod.name,
            price: prod.price,
            quantity: qty,
            image: prod.image,
            unit: prod.unit
          });
        }
      }
    }
    const verifiedServices = [];
    if (services && Array.isArray(services)) {
      for (const s of services) {
        const srv = db.getServices().find((sv) => sv.id === s.serviceId);
        if (srv) {
          subtotal += srv.startingPrice;
          verifiedServices.push({
            serviceId: srv.id,
            name: srv.name,
            price: srv.startingPrice,
            date: s.date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
            timeSlot: s.timeSlot || "Anytime between 10 AM - 6 PM",
            notes: s.notes || ""
          });
        }
      }
    }
    const deliveryConfig = db.getDeliverySettings();
    let deliveryFee = deliveryConfig.standardFee;
    if (deliveryConfig.isFreeDeliveryEnabled || subtotal >= deliveryConfig.freeDeliveryThreshold) {
      deliveryFee = 0;
    }
    const discount = 0;
    const total = subtotal + deliveryFee - discount;
    const newOrder = db.createOrder({
      customerName,
      customerPhone,
      deliveryAddress,
      items: verifiedItems,
      services: verifiedServices,
      subtotal,
      deliveryFee,
      discount,
      total,
      paymentMethod: paymentMethod || "Cash on Delivery",
      status: "Confirmed"
      // Once created after countdown, confirmed!
    });
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Failed to create order", err);
    res.status(500).json({ error: err.message || "Internal server error creating order" });
  }
});
app.put("/api/orders/:id/cancel", (req, res) => {
  const { reason } = req.body;
  const order = db.getOrders().find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  if (order.status === "Delivered" || order.status === "Cancelled") {
    return res.status(400).json({ error: `Cannot cancel order with status '${order.status}'` });
  }
  const updated = db.updateOrderStatus(order.id, "Cancelled", reason || "Cancelled by customer");
  res.json(updated);
});
app.post("/api/customer/save", (req, res) => {
  const { name, phone, address, email } = req.body;
  if (!name || !phone || !address) {
    return res.status(400).json({ error: "Name, phone, and address are required" });
  }
  const saved = db.saveCustomer({ name, phone, address, email });
  res.json(saved);
});
app.post("/api/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  const admin = db.getAdminUsers().find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!admin) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }
  const isMatch = import_bcryptjs2.default.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }
  const token = import_jsonwebtoken.default.sign(
    { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role
    }
  });
});
app.get("/api/admin/verify", requireAdmin, (req, res) => {
  res.json({ valid: true, admin: req.admin });
});
app.post("/api/admin/change-credentials", requireAdmin, (req, res) => {
  const { newEmail, newPassword, currentPassword } = req.body;
  const adminEmail = req.admin?.email;
  if (!adminEmail) {
    return res.status(400).json({ error: "Missing admin session" });
  }
  const currentAdmin = db.getAdminUsers().find((a) => a.email.toLowerCase() === adminEmail.toLowerCase());
  if (!currentAdmin) {
    return res.status(404).json({ error: "Admin account not found" });
  }
  if (currentPassword) {
    const isCurrentValid = import_bcryptjs2.default.compareSync(currentPassword, currentAdmin.passwordHash);
    if (!isCurrentValid) {
      return res.status(400).json({ error: "Current password does not match" });
    }
  }
  const result = db.updateAdminCredentials(adminEmail, newEmail, newPassword);
  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }
  const newToken = import_jsonwebtoken.default.sign(
    { id: result.admin.id, email: result.admin.email, name: result.admin.name, role: result.admin.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.json({
    message: result.message,
    token: newToken,
    admin: {
      id: result.admin.id,
      email: result.admin.email,
      name: result.admin.name,
      role: result.admin.role
    }
  });
});
app.get("/api/admin/stats", requireAdmin, (req, res) => {
  const orders = db.getOrders();
  const products = db.getProducts();
  const categories = db.getCategories();
  const services = db.getServices();
  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Confirmed" || o.status === "Preparing" || o.status === "Out for Delivery").length;
  const completedOrders = orders.filter((o) => o.status === "Delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "Cancelled").length;
  const totalRevenue = orders.filter((o) => o.status !== "Cancelled").reduce((sum, o) => sum + (o.total || 0), 0);
  res.json({
    totalProducts: products.length,
    activeProducts: products.filter((p) => p.inStock).length,
    totalCategories: categories.length,
    totalServices: services.length,
    totalOrders: orders.length,
    pendingOrders,
    completedOrders,
    cancelledOrders,
    totalRevenue,
    recentOrders: orders.slice(0, 5)
  });
});
app.post("/api/admin/categories", requireAdmin, (req, res) => {
  const { name, image, iconName, isEnabled, sortOrder } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Category name is required" });
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const newCat = db.addCategory({
    name,
    slug,
    image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80",
    iconName: iconName || "ShoppingBag",
    isEnabled: isEnabled !== void 0 ? Boolean(isEnabled) : true,
    sortOrder: Number(sortOrder) || 1
  });
  res.status(201).json(newCat);
});
app.put("/api/admin/categories/:id", requireAdmin, (req, res) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: "Category not found" });
  }
  res.json(updated);
});
app.delete("/api/admin/categories/:id", requireAdmin, (req, res) => {
  const success = db.deleteCategory(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Category not found" });
  }
  res.json({ success: true, message: "Category deleted successfully" });
});
app.post("/api/admin/products", requireAdmin, (req, res) => {
  const {
    categoryId,
    name,
    description,
    price,
    oldPrice,
    discountPercent,
    image,
    unit,
    inStock,
    stockCount,
    isPopular,
    deliveryCharge,
    rating
  } = req.body;
  if (!name || price === void 0) {
    return res.status(400).json({ error: "Product name and price are required" });
  }
  const numPrice = Number(price);
  const numOldPrice = oldPrice ? Number(oldPrice) : void 0;
  const calcDiscount = discountPercent !== void 0 ? Number(discountPercent) : numOldPrice && numOldPrice > numPrice ? Math.round((numOldPrice - numPrice) / numOldPrice * 100) : 0;
  const newProd = db.addProduct({
    categoryId: categoryId || "cat-grocery",
    name,
    description: description || "Fresh high-quality item guaranteed by Need Hub.",
    price: numPrice,
    oldPrice: numOldPrice,
    discountPercent: calcDiscount,
    image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
    unit: unit || "1 unit",
    inStock: inStock !== void 0 ? Boolean(inStock) : true,
    stockCount: stockCount !== void 0 ? Number(stockCount) : 50,
    isPopular: Boolean(isPopular),
    deliveryCharge: Number(deliveryCharge) || 0,
    rating: Number(rating) || 4.8
  });
  res.status(201).json(newProd);
});
app.put("/api/admin/products/:id", requireAdmin, (req, res) => {
  const updates = { ...req.body };
  if (updates.price !== void 0) updates.price = Number(updates.price);
  if (updates.oldPrice !== void 0) updates.oldPrice = Number(updates.oldPrice);
  if (updates.stockCount !== void 0) updates.stockCount = Number(updates.stockCount);
  if (updates.inStock !== void 0) updates.inStock = Boolean(updates.inStock);
  if (updates.isPopular !== void 0) updates.isPopular = Boolean(updates.isPopular);
  if (updates.oldPrice && updates.price && updates.oldPrice > updates.price && updates.discountPercent === void 0) {
    updates.discountPercent = Math.round((updates.oldPrice - updates.price) / updates.oldPrice * 100);
  }
  const updated = db.updateProduct(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(updated);
});
app.delete("/api/admin/products/:id", requireAdmin, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ success: true, message: "Product deleted successfully" });
});
app.post("/api/admin/services", requireAdmin, (req, res) => {
  const { name, category, startingPrice, priceType, description, image, isAvailable, duration, rating, popular } = req.body;
  if (!name || startingPrice === void 0) {
    return res.status(400).json({ error: "Service name and price are required" });
  }
  const newSrv = db.addService({
    name,
    category: category || "Home Services",
    startingPrice: Number(startingPrice),
    priceType: priceType || "starting",
    description: description || "Professional doorstep service by verified Need Hub experts.",
    image: image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
    isAvailable: isAvailable !== void 0 ? Boolean(isAvailable) : true,
    duration: duration || "30 - 60 mins",
    rating: Number(rating) || 4.8,
    popular: Boolean(popular)
  });
  res.status(201).json(newSrv);
});
app.put("/api/admin/services/:id", requireAdmin, (req, res) => {
  const updates = { ...req.body };
  if (updates.startingPrice !== void 0) updates.startingPrice = Number(updates.startingPrice);
  if (updates.isAvailable !== void 0) updates.isAvailable = Boolean(updates.isAvailable);
  if (updates.popular !== void 0) updates.popular = Boolean(updates.popular);
  const updated = db.updateService(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json(updated);
});
app.delete("/api/admin/services/:id", requireAdmin, (req, res) => {
  const success = db.deleteService(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json({ success: true, message: "Service deleted successfully" });
});
app.get("/api/admin/orders", requireAdmin, (req, res) => {
  const { status, search } = req.query;
  let orders = db.getOrders();
  if (status && typeof status === "string" && status !== "all") {
    orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
  }
  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.toLowerCase().trim();
    orders = orders.filter(
      (o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q) || o.deliveryAddress.toLowerCase().includes(q)
    );
  }
  res.json(orders);
});
app.put("/api/admin/orders/:id/status", requireAdmin, (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
  }
  const updated = db.updateOrderStatus(req.params.id, status, note);
  if (!updated) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(updated);
});
app.put("/api/admin/delivery-settings", requireAdmin, (req, res) => {
  const { standardFee, freeDeliveryThreshold, isFreeDeliveryEnabled, estimatedMinutes, isStoreOpen, supportPhone, currencySymbol } = req.body;
  const updates = {};
  if (standardFee !== void 0) updates.standardFee = Number(standardFee);
  if (freeDeliveryThreshold !== void 0) updates.freeDeliveryThreshold = Number(freeDeliveryThreshold);
  if (isFreeDeliveryEnabled !== void 0) updates.isFreeDeliveryEnabled = Boolean(isFreeDeliveryEnabled);
  if (estimatedMinutes !== void 0) updates.estimatedMinutes = String(estimatedMinutes);
  if (isStoreOpen !== void 0) updates.isStoreOpen = Boolean(isStoreOpen);
  if (supportPhone !== void 0) updates.supportPhone = String(supportPhone);
  if (currencySymbol !== void 0) updates.currencySymbol = String(currencySymbol);
  const newSettings = db.updateDeliverySettings(updates);
  res.json(newSettings);
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path2.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path2.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Need Hub Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
