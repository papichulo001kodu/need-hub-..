import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Grid,
  Wrench,
  Package,
  Truck,
  ShieldCheck,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Search,
  KeyRound,
  Sparkles,
  Eye,
  EyeOff,
  Palette,
  Type,
  Tag,
  Zap,
  RotateCcw,
  Smartphone,
  Download,
  ExternalLink,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Category, Product, Service, Order, OrderStatus, DeliverySettings } from '../../types';
import { AdminLoginModal } from './AdminLoginModal';

export const AdminPortal: React.FC = () => {
  const { adminUser, adminLogout, setIsAdminPortalOpen, refreshConfig, showToast, adminPortalTab, setAdminPortalTab } = useApp();

  const activeTab = adminPortalTab;
  const setActiveTab = setAdminPortalTab;
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Management State
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings | null>(null);

  // Modals & Editing forms
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);

  // Security credentials form
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  // Fetch all admin data
  const loadAdminData = async () => {
    if (!adminUser) return;
    setLoading(true);
    try {
      const [s, c, p, srv, ord, cfg] = await Promise.all([
        api.getAdminStats(),
        api.getCategories(true),
        api.getProducts(),
        api.getServices(),
        api.getAdminOrders(),
        api.getConfig()
      ]);
      setStats(s);
      setCategories(c);
      setProducts(p);
      setServices(srv);
      setOrders(ord);
      setDeliverySettings(cfg.deliverySettings);
    } catch (err: any) {
      console.error('Failed to load admin data', err);
      showToast(err.message || 'Error loading dashboard', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadAdminData();
    }
  }, [adminUser]);

  if (!adminUser) {
    return (
      <AdminLoginModal
        onClose={() => setIsAdminPortalOpen(false)}
        onLoginSuccess={() => loadAdminData()}
      />
    );
  }

  // Handle Product Save (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || editingProduct.price === undefined) return;

    try {
      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, editingProduct);
        showToast(`Product "${editingProduct.name}" updated!`);
      } else {
        await api.createProduct(editingProduct);
        showToast(`Product "${editingProduct.name}" created!`);
      }
      setEditingProduct(null);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.deleteProduct(id);
      showToast(`Product "${name}" deleted`);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    }
  };

  // Handle Category Save
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    try {
      if (editingCategory.id) {
        await api.updateCategory(editingCategory.id, editingCategory);
        showToast(`Category "${editingCategory.name}" updated!`);
      } else {
        await api.createCategory(editingCategory);
        showToast(`Category "${editingCategory.name}" created!`);
      }
      setEditingCategory(null);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await api.deleteCategory(id);
      showToast(`Category "${name}" deleted`);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    }
  };

  // Handle Service Save
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.name || editingService.startingPrice === undefined) return;

    try {
      if (editingService.id) {
        await api.updateService(editingService.id, editingService);
        showToast(`Service "${editingService.name}" updated!`);
      } else {
        await api.createService(editingService);
        showToast(`Service "${editingService.name}" created!`);
      }
      setEditingService(null);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save service', 'error');
    }
  };

  const handleDeleteService = async (id: string, name: string) => {
    if (!confirm(`Delete service "${name}"?`)) return;
    try {
      await api.deleteService(id);
      showToast(`Service "${name}" deleted`);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete service', 'error');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, status);
      showToast(`Order status updated to ${status}`);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  // Handle Delivery Settings Update
  const handleSaveDeliverySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverySettings) return;

    try {
      await api.updateDeliverySettings(deliverySettings);
      await refreshConfig();
      showToast('Delivery settings updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update delivery settings', 'error');
    }
  };

  // Handle Admin Security Update
  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.changeAdminCredentials({
        newEmail: newAdminEmail || undefined,
        newPassword: newAdminPassword || undefined,
        currentPassword: currentPassword || undefined
      });
      localStorage.setItem('needhub_admin_token', res.token);
      showToast('Admin credentials updated securely!');
      setNewAdminEmail('');
      setCurrentPassword('');
      setNewAdminPassword('');
    } catch (err: any) {
      showToast(err.message || 'Failed to change admin credentials', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdminPortalOpen(false)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Store App</span>
          </button>
          <div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="text-emerald-600 dark:text-emerald-400">Need Hub</span>
              <span className="text-xs bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                Admin Console
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            {adminUser.email}
          </span>
          <button
            onClick={adminLogout}
            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Admin Tab Navigation */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 flex gap-2 overflow-x-auto no-scrollbar py-2 shadow-xs">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'products', label: 'Products', icon: ShoppingBag },
          { id: 'categories', label: 'Categories', icon: Grid },
          { id: 'services', label: 'Services', icon: Wrench },
          { id: 'orders', label: 'Orders', icon: Package },
          { id: 'banner', label: 'Home Banner', icon: Sparkles },
          { id: 'delivery', label: 'Delivery', icon: Truck },
          { id: 'security', label: 'Security', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6 pb-20">
        {/* ================= DASHBOARD TAB ================= */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Live Store Overview</h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Total Revenue</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                  ₨ {stats.totalRevenue}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Total Orders</span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                  {stats.totalOrders}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-amber-600 dark:text-amber-400 block">Pending Orders</span>
                <span className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 block">
                  {stats.pendingOrders}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block">Completed</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {stats.completedOrders}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Products</span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                  {stats.totalProducts}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block">Services</span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                  {stats.totalServices}
                </span>
              </div>
            </div>

            {/* Quick Promo Banner Management Widget */}
            {deliverySettings && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">Home Promo & App Update Banners</h3>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        deliverySettings.isBannerVisible !== false
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      }`}>
                        {deliverySettings.isBannerVisible !== false ? '● PROMO: ACTIVE' : '○ PROMO: HIDDEN'}
                      </span>
                      {deliverySettings.isAppUpdateBannerVisible && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          📲 UPDATE ALERT: ON
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Current Promo: "{deliverySettings.bannerTitle || 'Fresh Groceries & Daily Essentials'}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab('banner')}
                    className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Manage Banners & Update Alert</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Recent Orders */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-2">
                {orders.slice(0, 4).map(o => (
                  <div
                    key={o.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">{o.orderNumber}</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] block">{o.customerName} • {o.items?.length || 0} items</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 block">₨ {o.total}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= PRODUCTS TAB ================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Product Management</h2>
              <button
                onClick={() =>
                  setEditingProduct({
                    name: '',
                    categoryId: categories[0]?.id || 'cat-grocery',
                    price: 250,
                    oldPrice: 300,
                    unit: '1 unit',
                    description: 'Fresh top quality item guaranteed by Need Hub.',
                    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
                    inStock: true,
                    stockCount: 50,
                    isPopular: false
                  })
                }
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product List Table / Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {products.map(p => (
                <div
                  key={p.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col justify-between shadow-sm"
                >
                  <div className="flex gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">
                          {p.unit}
                        </span>
                        {p.isPopular && (
                          <span className="text-[9px] bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 px-1.5 py-0.5 rounded font-bold">
                            Popular
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate mt-1">{p.name}</h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">₨ {p.price}</span>
                        {p.oldPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₨ {p.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className={p.inStock ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                      {p.inStock ? `In Stock (${p.stockCount})` : 'Out of Stock'}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                        title="Edit Product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= CATEGORIES TAB ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Category Management</h2>
              <button
                onClick={() =>
                  setEditingCategory({
                    name: '',
                    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
                    isEnabled: true,
                    sortOrder: categories.length + 1
                  })
                }
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 flex flex-col justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{cat.name}</h4>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Order: {cat.sortOrder}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${cat.isEnabled ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'}`}>
                      {cat.isEnabled ? 'Active' : 'Disabled'}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditingCategory(cat)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SERVICES TAB ================= */}
        {activeTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Service Management</h2>
              <button
                onClick={() =>
                  setEditingService({
                    name: '',
                    category: 'Cleaning',
                    startingPrice: 1200,
                    priceType: 'starting',
                    description: 'Professional verified doorstep service with 30-day warranty.',
                    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
                    isAvailable: true,
                    duration: '45 - 60 mins',
                    rating: 4.8
                  })
                }
                className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {services.map(s => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col justify-between shadow-sm"
                >
                  <div className="flex gap-3">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {s.category}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate mt-1">{s.name}</h4>
                      <span className="font-black text-sm text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                        ₨ {s.startingPrice}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{s.description}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className={s.isAvailable ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-rose-600 dark:text-rose-400 font-semibold'}>
                      {s.isAvailable ? 'Available' : 'Disabled'}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditingService(s)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(s.id, s.name)}
                        className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">All Customer Orders ({orders.length})</h2>

            <div className="space-y-3">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">{order.orderNumber}</span>
                      <span className="text-slate-500 dark:text-slate-400 block">{order.customerName} • {order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                      <select
                        value={order.status}
                        onChange={e => handleUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <p><span className="text-slate-400">Address:</span> {order.deliveryAddress}</p>
                    <p><span className="text-slate-400">Total Amount:</span> <span className="font-black text-slate-900 dark:text-white">₨ {order.total}</span> ({order.paymentMethod})</p>
                  </div>

                  {/* Items summary */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-200">
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                    {order.services?.map((s, idx) => (
                      <span key={idx} className="text-[11px] bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 px-2 py-1 rounded-lg text-sky-700 dark:text-sky-300">
                        {s.name} (Service on {s.date})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= HOME BANNER / PROMO BOX TAB ================= */}
        {activeTab === 'banner' && deliverySettings && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Home Promo Announcement Box</span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Write, edit, customize colors, or remove the announcement banner on the customer Home page.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Banner Status Toggle */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs font-bold px-2">
                    {deliverySettings.isBannerVisible !== false ? (
                      <>
                        <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400">Banner Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-rose-500" />
                        <span className="text-rose-600 dark:text-rose-400">Banner Hidden / Removed</span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = deliverySettings.isBannerVisible === false ? true : false;
                      setDeliverySettings({ ...deliverySettings, isBannerVisible: nextVal });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      deliverySettings.isBannerVisible !== false
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/80 dark:hover:bg-rose-900 dark:text-rose-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    }`}
                  >
                    {deliverySettings.isBannerVisible !== false ? 'Hide / Remove' : 'Show Banner'}
                  </button>
                </div>
              </div>

              {/* Real-time Interactive Live Preview */}
              <div className="mt-6 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Real-Time Live Preview (Customer View)</span>
                  </span>
                  {deliverySettings.isBannerVisible === false && (
                    <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800">
                      Currently Hidden from Customers
                    </span>
                  )}
                </div>

                {deliverySettings.isBannerVisible !== false ? (
                  <div
                    className={`relative rounded-3xl p-5 text-white shadow-lg overflow-hidden flex items-center justify-between transition-all ${
                      deliverySettings.bannerTheme === 'sunset'
                        ? 'bg-gradient-to-r from-orange-500 via-amber-600 to-red-600'
                        : deliverySettings.bannerTheme === 'ocean'
                        ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700'
                        : deliverySettings.bannerTheme === 'purple'
                        ? 'bg-gradient-to-r from-purple-600 via-violet-700 to-fuchsia-800'
                        : deliverySettings.bannerTheme === 'amber'
                        ? 'bg-gradient-to-r from-amber-600 via-amber-700 to-orange-800'
                        : deliverySettings.bannerTheme === 'rose'
                        ? 'bg-gradient-to-r from-rose-600 via-pink-700 to-red-700'
                        : deliverySettings.bannerTheme === 'dark'
                        ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 border border-slate-700'
                        : 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800'
                    }`}
                  >
                    <div className="absolute -right-4 -top-4 w-28 h-28 bg-white/10 rounded-full blur-lg pointer-events-none" />
                    <div className="relative z-10 max-w-[80%]">
                      <div className="flex items-center gap-1.5 text-[11px] uppercase font-black tracking-widest text-white/90">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>{deliverySettings.bannerTagline || 'Need Hub Express'}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-extrabold leading-tight mt-1">
                        {deliverySettings.bannerTitle || 'Fresh Groceries & Daily Essentials'}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/90 mt-1 font-medium">
                        {deliverySettings.bannerSubtitle || (
                          deliverySettings.isFreeDeliveryEnabled
                            ? '⚡ FREE Delivery on all orders today!'
                            : `⚡ Free delivery on orders over ${deliverySettings.currencySymbol} ${deliverySettings.freeDeliveryThreshold}`
                        )}
                      </p>
                    </div>
                    <div className="relative z-10 flex flex-col items-end gap-1.5 shrink-0">
                      {deliverySettings.bannerBadgeText && (
                        <div className="px-3 py-2 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-black text-xs text-white border border-white/20 text-center shadow-xs">
                          {deliverySettings.bannerBadgeText}
                        </div>
                      )}
                      {deliverySettings.bannerLinkUrl && deliverySettings.bannerLinkUrl.trim() !== '' && (
                        <div className="flex items-center gap-1 text-[10px] font-black bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/30 text-white">
                          <span>🔗 Linked to Website</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs">
                    <p className="font-bold">The Home Announcement Box is currently disabled.</p>
                    <p className="text-[11px] mt-1">Customers will not see this banner on the home screen.</p>
                  </div>
                )}
              </div>

              {/* Quick 1-Click Preset Templates */}
              <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  ⚡ Quick 1-Click Banner Presets:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() =>
                      setDeliverySettings({
                        ...deliverySettings,
                        isBannerVisible: true,
                        bannerTagline: 'Need Hub Express',
                        bannerTitle: 'Fresh Groceries & Daily Essentials',
                        bannerSubtitle: '⚡ Free delivery on orders over ₨ 299',
                        bannerBadgeText: '⚡ Fast',
                        bannerTheme: 'emerald'
                      })
                    }
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left font-bold transition-colors"
                  >
                    <span className="text-emerald-600 block">🛒 Grocery Express</span>
                    <span className="text-[10px] text-slate-500 font-normal">Emerald Green</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeliverySettings({
                        ...deliverySettings,
                        isBannerVisible: true,
                        bannerTagline: 'Mega Flash Sale',
                        bannerTitle: 'Flat 30% Off on Fresh Snacks & Drinks',
                        bannerSubtitle: '🔥 Use code FLASH30 at checkout today!',
                        bannerBadgeText: '30% OFF',
                        bannerTheme: 'sunset'
                      })
                    }
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-amber-500 text-left font-bold transition-colors"
                  >
                    <span className="text-orange-500 block">🔥 Mega Discount</span>
                    <span className="text-[10px] text-slate-500 font-normal">Sunset Orange</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeliverySettings({
                        ...deliverySettings,
                        isBannerVisible: true,
                        bannerTagline: 'Festive Special',
                        bannerTitle: 'Ramadan & Weekend Specials Delivered',
                        bannerSubtitle: '🌙 Special discounts on juices, fruits & bakery items',
                        bannerBadgeText: '⭐ Deal',
                        bannerTheme: 'purple'
                      })
                    }
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-left font-bold transition-colors"
                  >
                    <span className="text-purple-600 block">🌙 Festive Offer</span>
                    <span className="text-[10px] text-slate-500 font-normal">Royal Purple</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeliverySettings({
                        ...deliverySettings,
                        isBannerVisible: true,
                        bannerTagline: 'Doorstep Services',
                        bannerTitle: 'Certified Electrician & Home Repair',
                        bannerSubtitle: '🔧 Verified technicians at your doorstep in 30 mins',
                        bannerBadgeText: 'Verified',
                        bannerTheme: 'ocean'
                      })
                    }
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-left font-bold transition-colors"
                  >
                    <span className="text-blue-600 block">🛠️ Home Services</span>
                    <span className="text-[10px] text-slate-500 font-normal">Ocean Blue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeliverySettings({
                        ...deliverySettings,
                        isBannerVisible: true,
                        bannerTagline: 'NEW APP UPDATE',
                        bannerTitle: 'Naya Update Aa Gaya! App Update Karein',
                        bannerSubtitle: '📲 Fast speed aur naye features ke liye website se update karein',
                        bannerBadgeText: 'v2.1',
                        bannerTheme: 'purple'
                      })
                    }
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-left font-bold transition-colors col-span-2 sm:col-span-4"
                  >
                    <span className="text-purple-600 block">📲 App Update Alert (Website Download / Update)</span>
                    <span className="text-[10px] text-slate-500 font-normal">Apply announcement for new app update / website download</span>
                  </button>
                </div>
              </div>

              {/* Detailed Edit Form */}
              <form onSubmit={handleSaveDeliverySettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Top Tagline */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Small Top Tagline / Category</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Need Hub Express, Flash Sale, Festive Deal"
                      value={deliverySettings.bannerTagline || ''}
                      onChange={e => setDeliverySettings({ ...deliverySettings, bannerTagline: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Corner Badge */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Right Corner Badge Text</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ⚡ Fast, 🔥 20% OFF, NEW, ⭐ Top"
                      value={deliverySettings.bannerBadgeText || ''}
                      onChange={e => setDeliverySettings({ ...deliverySettings, bannerBadgeText: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Main Headline */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Main Title / Big Heading</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fresh Groceries & Daily Essentials"
                    value={deliverySettings.bannerTitle || ''}
                    onChange={e => setDeliverySettings({ ...deliverySettings, bannerTitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Subtitle / Offer Details */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subtitle / Promotional Offer Details
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ⚡ Free delivery on orders over ₨ 299"
                    value={deliverySettings.bannerSubtitle || ''}
                    onChange={e => setDeliverySettings({ ...deliverySettings, bannerSubtitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Website / App Update Link Box */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-black text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Website Link / App Update Link (Clickable Action)</span>
                    </label>
                    <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 rounded-md">
                      Optional
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    Yahan apni website ka link paste karein (e.g. <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded text-emerald-600 font-bold">https://mywebsite.com</code>). Customer jab is banner par click karega to sidha aapki website par ja kar app update/download kar sakega.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        placeholder="https://yourwebsite.com/download"
                        value={deliverySettings.bannerLinkUrl || ''}
                        onChange={e => setDeliverySettings({ ...deliverySettings, bannerLinkUrl: e.target.value })}
                        className="w-full p-2.5 pl-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    {deliverySettings.bannerLinkUrl && deliverySettings.bannerLinkUrl.trim() !== '' && (
                      <button
                        type="button"
                        onClick={() => {
                          let targetUrl = deliverySettings.bannerLinkUrl!.trim();
                          if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
                            targetUrl = `https://${targetUrl}`;
                          }
                          window.open(targetUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                        title="Test link in new tab"
                      >
                        <span>Test Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Color Theme Selector */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Banner Color Gradient Theme</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {[
                      { id: 'emerald', label: 'Emerald', bg: 'from-emerald-600 to-teal-800' },
                      { id: 'sunset', label: 'Sunset', bg: 'from-orange-500 to-red-600' },
                      { id: 'ocean', label: 'Ocean', bg: 'from-blue-600 to-cyan-700' },
                      { id: 'purple', label: 'Purple', bg: 'from-purple-600 to-fuchsia-800' },
                      { id: 'amber', label: 'Amber', bg: 'from-amber-600 to-orange-800' },
                      { id: 'rose', label: 'Rose', bg: 'from-rose-600 to-red-700' },
                      { id: 'dark', label: 'Dark', bg: 'from-slate-900 to-zinc-900' }
                    ].map(theme => {
                      const isSelected = (deliverySettings.bannerTheme || 'emerald') === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setDeliverySettings({ ...deliverySettings, bannerTheme: theme.id as any })}
                          className={`p-2 rounded-xl text-white font-bold text-[11px] bg-gradient-to-r ${theme.bg} flex items-center justify-between border-2 transition-all ${
                            isSelected ? 'border-emerald-400 ring-2 ring-emerald-500 shadow-md scale-105' : 'border-transparent opacity-85 hover:opacity-100'
                          }`}
                        >
                          <span>{theme.label}</span>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Save & Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Apply Banner Changes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeliverySettings({
                        ...deliverySettings,
                        isBannerVisible: true,
                        bannerTagline: 'Need Hub Express',
                        bannerTitle: 'Fresh Groceries & Daily Essentials',
                        bannerSubtitle: '⚡ Free delivery on orders over ₨ 299',
                        bannerBadgeText: '⚡ Fast',
                        bannerTheme: 'emerald'
                      })
                    }
                    className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Dedicated App Update Announcement Banner Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>📲 "App Update Available" Notification Banner</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        WEBSITE DOWNLOAD / UPDATE
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Jab aapki app ka naya version ya website update aaye, is banner ko ON karein taake customer website se app update kar sakein.
                    </p>
                  </div>
                </div>

                {/* App Update Toggle */}
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className={`text-xs font-bold px-2 ${deliverySettings.isAppUpdateBannerVisible ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`}>
                    {deliverySettings.isAppUpdateBannerVisible ? '● Active' : '○ Off'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setDeliverySettings({
                        ...deliverySettings,
                        isAppUpdateBannerVisible: !deliverySettings.isAppUpdateBannerVisible
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                      deliverySettings.isAppUpdateBannerVisible
                        ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                    }`}
                  >
                    {deliverySettings.isAppUpdateBannerVisible ? 'Turn OFF' : 'Turn ON Update Alert'}
                  </button>
                </div>
              </div>

              {/* App Update Banner Live Preview */}
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                  <Eye className="w-3.5 h-3.5 text-purple-600" />
                  <span>Update Banner Live Preview</span>
                </span>

                <div
                  className={`relative rounded-3xl p-4 text-white shadow-lg overflow-hidden border transition-all ${
                    deliverySettings.appUpdateTheme === 'sunset'
                      ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-red-600 border-orange-400/40'
                      : deliverySettings.appUpdateTheme === 'ocean'
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-700 border-blue-400/40'
                      : deliverySettings.appUpdateTheme === 'amber'
                      ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-orange-700 border-amber-300/40'
                      : deliverySettings.appUpdateTheme === 'rose'
                      ? 'bg-gradient-to-r from-rose-600 via-pink-600 to-red-700 border-rose-400/40'
                      : deliverySettings.appUpdateTheme === 'emerald'
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 border-emerald-400/40'
                      : deliverySettings.appUpdateTheme === 'dark'
                      ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-950 border-slate-700'
                      : 'bg-gradient-to-r from-purple-600 via-violet-700 to-fuchsia-800 border-purple-400/40'
                  }`}
                >
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white shrink-0 border border-white/25 shadow-inner mt-0.5">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full border border-white/30 text-white">
                            {deliverySettings.appUpdateTagline || 'NEW VERSION AVAILABLE'}
                          </span>
                          <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                            {deliverySettings.appUpdateVersion || 'v2.1'}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-extrabold leading-snug text-white">
                          {deliverySettings.appUpdateTitle || 'App Update Aa Gai Hai!'}
                        </h3>
                        <p className="text-[11px] text-white/90 font-medium leading-relaxed">
                          {deliverySettings.appUpdateSubtitle || 'Website se latest app update karein naye features aur fast delivery ke liye.'}
                        </p>
                        <div className="pt-1.5 flex items-center gap-2">
                          <span className="px-3 py-1.5 bg-white text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{deliverySettings.appUpdateActionText || 'Update App Now 📲'}</span>
                            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Controls for App Update */}
              <form onSubmit={handleSaveDeliverySettings} className="space-y-4 text-xs pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Version Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. v2.1, v3.0, NEW"
                      value={deliverySettings.appUpdateVersion || ''}
                      onChange={e => setDeliverySettings({ ...deliverySettings, appUpdateVersion: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Tagline / Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. NEW VERSION AVAILABLE"
                      value={deliverySettings.appUpdateTagline || ''}
                      onChange={e => setDeliverySettings({ ...deliverySettings, appUpdateTagline: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Update App Now 📲"
                      value={deliverySettings.appUpdateActionText || ''}
                      onChange={e => setDeliverySettings({ ...deliverySettings, appUpdateActionText: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Update Heading Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. App Update Aa Gai Hai!"
                      value={deliverySettings.appUpdateTitle || ''}
                      onChange={e => setDeliverySettings({ ...deliverySettings, appUpdateTitle: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-purple-600" />
                      <span>Website / Download Link (Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://your-website.com/download (blank for direct install)"
                      value={deliverySettings.appUpdateActionUrl || ''}
                      onChange={e => setDeliverySettings({ ...deliverySettings, appUpdateActionUrl: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Update Message / Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Website se latest version update karein aur tezi aur naye features ka faida uthayein."
                    value={deliverySettings.appUpdateSubtitle || ''}
                    onChange={e => setDeliverySettings({ ...deliverySettings, appUpdateSubtitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                {/* Color Theme Selector for Update Banner */}
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-purple-600" />
                    <span>Update Banner Theme</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                    {[
                      { id: 'purple', label: 'Purple Alert', bg: 'from-purple-600 to-fuchsia-800' },
                      { id: 'sunset', label: 'Sunset Fire', bg: 'from-orange-500 to-red-600' },
                      { id: 'amber', label: 'Amber Gold', bg: 'from-amber-600 to-orange-800' },
                      { id: 'emerald', label: 'Emerald Green', bg: 'from-emerald-600 to-teal-800' },
                      { id: 'ocean', label: 'Ocean Blue', bg: 'from-blue-600 to-cyan-700' },
                      { id: 'rose', label: 'Rose Pink', bg: 'from-rose-600 to-red-700' },
                      { id: 'dark', label: 'Dark Midnight', bg: 'from-slate-900 to-zinc-900' }
                    ].map(theme => {
                      const isSelected = (deliverySettings.appUpdateTheme || 'purple') === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setDeliverySettings({ ...deliverySettings, appUpdateTheme: theme.id as any })}
                          className={`p-2 rounded-xl text-white font-bold text-[11px] bg-gradient-to-r ${theme.bg} flex items-center justify-between border-2 transition-all ${
                            isSelected ? 'border-purple-400 ring-2 ring-purple-500 shadow-md scale-105' : 'border-transparent opacity-85 hover:opacity-100'
                          }`}
                        >
                          <span>{theme.label}</span>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save & Update All Banner Settings</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= DELIVERY SETTINGS TAB ================= */}
        {activeTab === 'delivery' && deliverySettings && (
          <div className="max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Delivery Charges & Store Rules</h2>
            <form onSubmit={handleSaveDeliverySettings} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Standard Delivery Fee (₨)</label>
                <input
                  type="number"
                  required
                  value={deliverySettings.standardFee}
                  onChange={e => setDeliverySettings({ ...deliverySettings, standardFee: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Free Delivery Threshold (₨)</label>
                <input
                  type="number"
                  required
                  value={deliverySettings.freeDeliveryThreshold}
                  onChange={e => setDeliverySettings({ ...deliverySettings, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300">Enable 100% Free Delivery Promotion</span>
                <input
                  type="checkbox"
                  checked={deliverySettings.isFreeDeliveryEnabled}
                  onChange={e => setDeliverySettings({ ...deliverySettings, isFreeDeliveryEnabled: e.target.checked })}
                  className="w-5 h-5 accent-emerald-600 rounded"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estimated Delivery Time Label</label>
                <input
                  type="text"
                  required
                  value={deliverySettings.estimatedMinutes}
                  onChange={e => setDeliverySettings({ ...deliverySettings, estimatedMinutes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Direct Android APK Download URL (Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://your-domain.com/NeedHub.apk or Google Drive/Mediafire link"
                  value={deliverySettings.apkDownloadUrl || ''}
                  onChange={e => setDeliverySettings({ ...deliverySettings, apkDownloadUrl: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
                />
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Optional direct link to download the compiled Android APK file from your website/server.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}

        {/* ================= SECURITY TAB ================= */}
        {activeTab === 'security' && (
          <div className="max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Admin Security Credentials</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Update your login email or password. Passwords are encrypted with bcrypt.
              </p>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Change Admin Email</label>
                <input
                  type="email"
                  placeholder={adminUser.email}
                  value={newAdminEmail}
                  onChange={e => setNewAdminEmail(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Current Password (Required to verify)</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">New Password (Min 6 chars)</label>
                <input
                  type="password"
                  placeholder="Enter new strong password"
                  value={newAdminPassword}
                  onChange={e => setNewAdminPassword(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Save New Credentials</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setEditingProduct(null)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select
                  value={editingProduct.categoryId || categories[0]?.id}
                  onChange={e => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (₨) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Old Price (₨)</label>
                  <input
                    type="number"
                    value={editingProduct.oldPrice || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, oldPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit / Pack Size</label>
                <input
                  type="text"
                  value={editingProduct.unit || '1 unit'}
                  onChange={e => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct.image || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock ?? true}
                    onChange={e => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="accent-emerald-600"
                  />
                  <span>In Stock</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingProduct.isPopular ?? false}
                    onChange={e => setEditingProduct({ ...editingProduct, isPopular: e.target.checked })}
                    className="accent-emerald-600"
                  />
                  <span>Mark as Popular</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Edit / Create Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingCategory.id ? 'Edit Category' : 'Add Category'}
              </h3>
              <button onClick={() => setEditingCategory(null)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingCategory.image || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, image: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>Active Status</span>
                <input
                  type="checkbox"
                  checked={editingCategory.isEnabled ?? true}
                  onChange={e => setEditingCategory({ ...editingCategory, isEnabled: e.target.checked })}
                  className="accent-emerald-600 w-4 h-4"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                Save Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Service Edit / Create Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingService.id ? 'Edit Service' : 'Add Service'}
              </h3>
              <button onClick={() => setEditingService(null)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={editingService.name || ''}
                  onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  value={editingService.category || 'Cleaning'}
                  onChange={e => setEditingService({ ...editingService, category: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Price (₨) *</label>
                  <input
                    type="number"
                    required
                    value={editingService.startingPrice || ''}
                    onChange={e => setEditingService({ ...editingService, startingPrice: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingService.duration || '45 mins'}
                    onChange={e => setEditingService({ ...editingService, duration: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingService.image || ''}
                  onChange={e => setEditingService({ ...editingService, image: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingService.description || ''}
                  onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white resize-none focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between py-1 text-slate-700 dark:text-slate-300">
                <span>Available</span>
                <input
                  type="checkbox"
                  checked={editingService.isAvailable ?? true}
                  onChange={e => setEditingService({ ...editingService, isAvailable: e.target.checked })}
                  className="accent-emerald-600 w-4 h-4"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors"
              >
                Save Service
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
