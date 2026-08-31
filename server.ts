import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db, OrderStatus } from './server/db.ts';

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'needhub-secret-key-2026-auth-token-secure';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ----------------------------------------------------
// Authentication Middleware for Admin routes
// ----------------------------------------------------
interface AuthRequest extends Request {
  admin?: {
    id: string;
    email: string;
    role: string;
  };
}

function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin token required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

// ----------------------------------------------------
// Public / Customer API Endpoints
// ----------------------------------------------------

// Explicit PWA Static Assets, Manifest & Service Worker Routes with Strict Headers
const publicDir = path.join(process.cwd(), 'public');

app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(publicDir, 'manifest.json'));
});

app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(publicDir, 'sw.js'));
});

app.get('/offline.html', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(publicDir, 'offline.html'));
});

// Explicit Image Routes for PWA Builder & Crawlers
app.get(['/icon-192.png', '/icon-512.png', '/icon-maskable.png', '/needhub-logo.png'], (req, res) => {
  const filename = path.basename(req.path);
  const iconPath = path.join(publicDir, filename);
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(iconPath);
});

app.get('/icon.svg', (req, res) => {
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(publicDir, 'icon.svg'));
});

app.get('/favicon.ico', (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(publicDir, 'icon-192.png'));
});

// Explicit Android APK Download Route with standard APK MIME headers
app.get(['/NeedHub_v1.0.apk', '/download-apk', '/needhub.apk', '/app-release.apk'], (req, res) => {
  const delivery = db.getDeliverySettings();
  if (delivery.apkDownloadUrl && delivery.apkDownloadUrl.startsWith('http')) {
    return res.redirect(delivery.apkDownloadUrl);
  }

  const possiblePaths = [
    path.join(process.cwd(), 'public', 'NeedHub_v1.0.apk'),
    path.join(process.cwd(), 'dist', 'NeedHub_v1.0.apk'),
    path.join(process.cwd(), 'android', 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk')
  ];

  for (const apkPath of possiblePaths) {
    if (fs.existsSync(apkPath) && fs.statSync(apkPath).size > 1024 * 100) {
      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', 'attachment; filename="NeedHub_v1.0.apk"');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.sendFile(apkPath);
    }
  }

  // If no physical APK exists on server, redirect to home page with PWA install flow
  return res.redirect('/?install=true');
});

// 1. Health check & configuration
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/config', (req, res) => {
  const delivery = db.getDeliverySettings();
  res.json({
    appName: 'Need Hub',
    tagline: 'Instant Groceries & Trusted Services',
    deliverySettings: delivery,
    categoriesCount: db.getCategories().filter(c => c.isEnabled).length,
    productsCount: db.getProducts().filter(p => p.inStock).length,
    servicesCount: db.getServices().filter(s => s.isAvailable).length
  });
});

// 2. Categories
app.get('/api/categories', (req, res) => {
  const all = req.query.all === 'true';
  const cats = db.getCategories();
  if (all) {
    return res.json(cats);
  }
  // Return only enabled categories sorted
  const enabled = cats.filter(c => c.isEnabled).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  res.json(enabled);
});

// 3. Products
app.get('/api/products', (req, res) => {
  const { categoryId, search, popular, inStockOnly } = req.query;
  let products = db.getProducts();

  if (categoryId && typeof categoryId === 'string' && categoryId !== 'all') {
    products = products.filter(p => p.categoryId === categoryId);
  }

  if (popular === 'true') {
    products = products.filter(p => p.isPopular);
  }

  if (inStockOnly === 'true') {
    products = products.filter(p => p.inStock);
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProducts().find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// 4. Services
app.get('/api/services', (req, res) => {
  const { category, search, availableOnly } = req.query;
  let services = db.getServices();

  if (availableOnly === 'true') {
    services = services.filter(s => s.isAvailable);
  }

  if (category && typeof category === 'string' && category !== 'all') {
    services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    services = services.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }

  res.json(services);
});

app.get('/api/services/:id', (req, res) => {
  const service = db.getServices().find(s => s.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(service);
});

// 5. Global Search across products, categories & services
app.get('/api/search', (req, res) => {
  const q = (req.query.q as string || '').toLowerCase().trim();
  if (!q) {
    return res.json({ products: [], categories: [], services: [] });
  }

  const matchingCategories = db.getCategories().filter(c => 
    c.isEnabled && (c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q))
  );

  const matchingProducts = db.getProducts().filter(p => 
    p.name.toLowerCase().includes(q) || 
    p.description.toLowerCase().includes(q)
  );

  const matchingServices = db.getServices().filter(s => 
    s.name.toLowerCase().includes(q) || 
    s.description.toLowerCase().includes(q) || 
    s.category.toLowerCase().includes(q)
  );

  res.json({
    categories: matchingCategories,
    products: matchingProducts,
    services: matchingServices
  });
});

// 6. Orders
app.get('/api/orders', (req, res) => {
  const phone = req.query.phone as string;
  let orders = db.getOrders();
  if (phone) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    orders = orders.filter(o => o.customerPhone.replace(/[^0-9]/g, '').includes(cleanPhone));
  }
  res.json(orders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = db.getOrders().find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  try {
    const { customerName, customerPhone, deliveryAddress, items, services, paymentMethod } = req.body;

    if (!customerName || !customerPhone || !deliveryAddress) {
      return res.status(400).json({ error: 'Customer name, phone and address are required' });
    }

    if ((!items || items.length === 0) && (!services || services.length === 0)) {
      return res.status(400).json({ error: 'Order must contain at least one product or service' });
    }

    // Save customer info automatically
    db.saveCustomer({ name: customerName, phone: customerPhone, address: deliveryAddress });

    // Calculate subtotal securely from server prices
    let subtotal = 0;
    const verifiedItems = [];

    if (items && Array.isArray(items)) {
      for (const item of items) {
        const prod = db.getProducts().find(p => p.id === item.productId);
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
        const srv = db.getServices().find(sv => sv.id === s.serviceId);
        if (srv) {
          subtotal += srv.startingPrice;
          verifiedServices.push({
            serviceId: srv.id,
            name: srv.name,
            price: srv.startingPrice,
            date: s.date || new Date().toISOString().split('T')[0],
            timeSlot: s.timeSlot || 'Anytime between 10 AM - 6 PM',
            notes: s.notes || ''
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
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Confirmed' // Once created after countdown, confirmed!
    });

    res.status(201).json(newOrder);
  } catch (err: any) {
    console.error('Failed to create order', err);
    res.status(500).json({ error: err.message || 'Internal server error creating order' });
  }
});

// Customer can cancel order if still Pending or Confirmed
app.put('/api/orders/:id/cancel', (req, res) => {
  const { reason } = req.body;
  const order = db.getOrders().find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (order.status === 'Delivered' || order.status === 'Cancelled') {
    return res.status(400).json({ error: `Cannot cancel order with status '${order.status}'` });
  }

  const updated = db.updateOrderStatus(order.id, 'Cancelled', reason || 'Cancelled by customer');
  res.json(updated);
});

// Customer Profile
app.post('/api/customer/save', (req, res) => {
  const { name, phone, address, email } = req.body;
  if (!name || !phone || !address) {
    return res.status(400).json({ error: 'Name, phone, and address are required' });
  }
  const saved = db.saveCustomer({ name, phone, address, email });
  res.json(saved);
});

// ----------------------------------------------------
// Admin API Endpoints (Secured with JWT)
// ----------------------------------------------------

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const admin = db.getAdminUsers().find(a => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!admin) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    JWT_SECRET,
    { expiresIn: '7d' }
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

// Verify Admin Token
app.get('/api/admin/verify', requireAdmin, (req: AuthRequest, res) => {
  res.json({ valid: true, admin: req.admin });
});

// Change Admin Credentials (Email & Password)
app.post('/api/admin/change-credentials', requireAdmin, (req: AuthRequest, res) => {
  const { newEmail, newPassword, currentPassword } = req.body;
  const adminEmail = req.admin?.email;
  if (!adminEmail) {
    return res.status(400).json({ error: 'Missing admin session' });
  }

  const currentAdmin = db.getAdminUsers().find(a => a.email.toLowerCase() === adminEmail.toLowerCase());
  if (!currentAdmin) {
    return res.status(404).json({ error: 'Admin account not found' });
  }

  if (currentPassword) {
    const isCurrentValid = bcrypt.compareSync(currentPassword, currentAdmin.passwordHash);
    if (!isCurrentValid) {
      return res.status(400).json({ error: 'Current password does not match' });
    }
  }

  const result = db.updateAdminCredentials(adminEmail, newEmail, newPassword);
  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }

  // Issue new token if email changed
  const newToken = jwt.sign(
    { id: result.admin!.id, email: result.admin!.email, name: result.admin!.name, role: result.admin!.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    message: result.message,
    token: newToken,
    admin: {
      id: result.admin!.id,
      email: result.admin!.email,
      name: result.admin!.name,
      role: result.admin!.role
    }
  });
});

// Admin Stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  const orders = db.getOrders();
  const products = db.getProducts();
  const categories = db.getCategories();
  const services = db.getServices();

  const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Preparing' || o.status === 'Out for Delivery').length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  res.json({
    totalProducts: products.length,
    activeProducts: products.filter(p => p.inStock).length,
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

// Admin Category CRUD
app.post('/api/admin/categories', requireAdmin, (req, res) => {
  const { name, image, iconName, isEnabled, sortOrder } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const newCat = db.addCategory({
    name,
    slug,
    image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
    iconName: iconName || 'ShoppingBag',
    isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true,
    sortOrder: Number(sortOrder) || 1
  });
  res.status(201).json(newCat);
});

app.put('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json(updated);
});

app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
  const success = db.deleteCategory(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Category not found' });
  }
  res.json({ success: true, message: 'Category deleted successfully' });
});

// Admin Product CRUD
app.post('/api/admin/products', requireAdmin, (req, res) => {
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

  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }

  const numPrice = Number(price);
  const numOldPrice = oldPrice ? Number(oldPrice) : undefined;
  const calcDiscount = discountPercent !== undefined 
    ? Number(discountPercent) 
    : (numOldPrice && numOldPrice > numPrice ? Math.round(((numOldPrice - numPrice) / numOldPrice) * 100) : 0);

  const newProd = db.addProduct({
    categoryId: categoryId || 'cat-grocery',
    name,
    description: description || 'Fresh high-quality item guaranteed by Need Hub.',
    price: numPrice,
    oldPrice: numOldPrice,
    discountPercent: calcDiscount,
    image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    unit: unit || '1 unit',
    inStock: inStock !== undefined ? Boolean(inStock) : true,
    stockCount: stockCount !== undefined ? Number(stockCount) : 50,
    isPopular: Boolean(isPopular),
    deliveryCharge: Number(deliveryCharge) || 0,
    rating: Number(rating) || 4.8
  });

  res.status(201).json(newProd);
});

app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
  const updates = { ...req.body };
  if (updates.price !== undefined) updates.price = Number(updates.price);
  if (updates.oldPrice !== undefined) updates.oldPrice = Number(updates.oldPrice);
  if (updates.stockCount !== undefined) updates.stockCount = Number(updates.stockCount);
  if (updates.inStock !== undefined) updates.inStock = Boolean(updates.inStock);
  if (updates.isPopular !== undefined) updates.isPopular = Boolean(updates.isPopular);

  if (updates.oldPrice && updates.price && updates.oldPrice > updates.price && updates.discountPercent === undefined) {
    updates.discountPercent = Math.round(((updates.oldPrice - updates.price) / updates.oldPrice) * 100);
  }

  const updated = db.updateProduct(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(updated);
});

app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted successfully' });
});

// Admin Service CRUD
app.post('/api/admin/services', requireAdmin, (req, res) => {
  const { name, category, startingPrice, priceType, description, image, isAvailable, duration, rating, popular } = req.body;
  if (!name || startingPrice === undefined) {
    return res.status(400).json({ error: 'Service name and price are required' });
  }

  const newSrv = db.addService({
    name,
    category: category || 'Home Services',
    startingPrice: Number(startingPrice),
    priceType: priceType || 'starting',
    description: description || 'Professional doorstep service by verified Need Hub experts.',
    image: image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    duration: duration || '30 - 60 mins',
    rating: Number(rating) || 4.8,
    popular: Boolean(popular)
  });

  res.status(201).json(newSrv);
});

app.put('/api/admin/services/:id', requireAdmin, (req, res) => {
  const updates = { ...req.body };
  if (updates.startingPrice !== undefined) updates.startingPrice = Number(updates.startingPrice);
  if (updates.isAvailable !== undefined) updates.isAvailable = Boolean(updates.isAvailable);
  if (updates.popular !== undefined) updates.popular = Boolean(updates.popular);

  const updated = db.updateService(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json(updated);
});

app.delete('/api/admin/services/:id', requireAdmin, (req, res) => {
  const success = db.deleteService(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Service not found' });
  }
  res.json({ success: true, message: 'Service deleted successfully' });
});

// Admin Order Management
app.get('/api/admin/orders', requireAdmin, (req, res) => {
  const { status, search } = req.query;
  let orders = db.getOrders();

  if (status && typeof status === 'string' && status !== 'all') {
    orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    orders = orders.filter(o =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.deliveryAddress.toLowerCase().includes(q)
    );
  }

  res.json(orders);
});

app.put('/api/admin/orders/:id/status', requireAdmin, (req, res) => {
  const { status, note } = req.body;
  const validStatuses: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const updated = db.updateOrderStatus(req.params.id, status, note);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(updated);
});

// Admin Delivery & Store Settings
app.put('/api/admin/delivery-settings', requireAdmin, (req, res) => {
  const {
    standardFee,
    freeDeliveryThreshold,
    isFreeDeliveryEnabled,
    estimatedMinutes,
    isStoreOpen,
    supportPhone,
    currencySymbol,
    isBannerVisible,
    bannerTagline,
    bannerTitle,
    bannerSubtitle,
    bannerBadgeText,
    bannerTheme,
    bannerLinkUrl,
    isAppUpdateBannerVisible,
    appUpdateTagline,
    appUpdateTitle,
    appUpdateSubtitle,
    appUpdateVersion,
    appUpdateActionText,
    appUpdateActionUrl,
    appUpdateTheme
  } = req.body;

  const updates: any = {};
  if (standardFee !== undefined) updates.standardFee = Number(standardFee);
  if (freeDeliveryThreshold !== undefined) updates.freeDeliveryThreshold = Number(freeDeliveryThreshold);
  if (isFreeDeliveryEnabled !== undefined) updates.isFreeDeliveryEnabled = Boolean(isFreeDeliveryEnabled);
  if (estimatedMinutes !== undefined) updates.estimatedMinutes = String(estimatedMinutes);
  if (isStoreOpen !== undefined) updates.isStoreOpen = Boolean(isStoreOpen);
  if (supportPhone !== undefined) updates.supportPhone = String(supportPhone);
  if (currencySymbol !== undefined) updates.currencySymbol = String(currencySymbol);
  if (isBannerVisible !== undefined) updates.isBannerVisible = Boolean(isBannerVisible);
  if (bannerTagline !== undefined) updates.bannerTagline = String(bannerTagline);
  if (bannerTitle !== undefined) updates.bannerTitle = String(bannerTitle);
  if (bannerSubtitle !== undefined) updates.bannerSubtitle = String(bannerSubtitle);
  if (bannerBadgeText !== undefined) updates.bannerBadgeText = String(bannerBadgeText);
  if (bannerTheme !== undefined) updates.bannerTheme = String(bannerTheme);
  if (bannerLinkUrl !== undefined) updates.bannerLinkUrl = String(bannerLinkUrl);

  // App Update Banner fields
  if (isAppUpdateBannerVisible !== undefined) updates.isAppUpdateBannerVisible = Boolean(isAppUpdateBannerVisible);
  if (appUpdateTagline !== undefined) updates.appUpdateTagline = String(appUpdateTagline);
  if (appUpdateTitle !== undefined) updates.appUpdateTitle = String(appUpdateTitle);
  if (appUpdateSubtitle !== undefined) updates.appUpdateSubtitle = String(appUpdateSubtitle);
  if (appUpdateVersion !== undefined) updates.appUpdateVersion = String(appUpdateVersion);
  if (appUpdateActionText !== undefined) updates.appUpdateActionText = String(appUpdateActionText);
  if (appUpdateActionUrl !== undefined) updates.appUpdateActionUrl = String(appUpdateActionUrl);
  if (appUpdateTheme !== undefined) updates.appUpdateTheme = String(appUpdateTheme);
  if (req.body.apkDownloadUrl !== undefined) updates.apkDownloadUrl = String(req.body.apkDownloadUrl);

  const newSettings = db.updateDeliverySettings(updates);
  res.json(newSettings);
});

// ----------------------------------------------------
// Vite Middleware / Static Asset Setup
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Need Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
