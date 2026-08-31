import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CustomerProfile, CartItem, Product, Service, Order, DeliverySettings, AdminUser } from '../types';
import { api } from '../services/api';
import { APP_CONFIG } from '../config/appConfig';

interface AppContextType {
  // Navigation & Modals
  activeTab: 'home' | 'search' | 'services' | 'orders' | 'profile';
  setActiveTab: (tab: 'home' | 'search' | 'services' | 'orders' | 'profile') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedService: Service | null;
  setSelectedService: (s: Service | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isAddressEditOpen: boolean;
  setIsAddressEditOpen: (open: boolean) => void;
  isAdminPortalOpen: boolean;
  setIsAdminPortalOpen: (open: boolean) => void;

  // Active Order / Countdown
  countdownOrderData: any | null;
  setCountdownOrderData: (data: any | null) => void;
  activeOrderReceipt: Order | null;
  setActiveOrderReceipt: (order: Order | null) => void;

  // Customer Profile
  customer: CustomerProfile;
  updateCustomerProfile: (profile: Partial<CustomerProfile>) => void;
  clearSavedInfo: () => void;
  signOutCustomer: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Global Config & Delivery
  deliverySettings: DeliverySettings;
  refreshConfig: () => Promise<void>;

  // Dark Mode
  darkMode: boolean;
  toggleDarkMode: () => void;

  // Admin Auth State
  adminUser: AdminUser | null;
  setAdminUser: (admin: AdminUser | null) => void;
  adminLogout: () => void;
  adminPortalTab: 'dashboard' | 'products' | 'categories' | 'services' | 'orders' | 'delivery' | 'banner' | 'security';
  setAdminPortalTab: (tab: 'dashboard' | 'products' | 'categories' | 'services' | 'orders' | 'delivery' | 'banner' | 'security') => void;
  openAdminPortal: (tab?: 'dashboard' | 'products' | 'categories' | 'services' | 'orders' | 'delivery' | 'banner' | 'security') => void;

  // Toast / Notification
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Native PWA Installation
  isAppInstalled: boolean;
  isInstallPromptAvailable: boolean;
  installApp: () => Promise<void>;
}

const defaultDeliverySettings: DeliverySettings = {
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
  bannerTheme: 'emerald',

  // App Update Announcement Banner defaults
  isAppUpdateBannerVisible: false,
  appUpdateTagline: 'NEW VERSION AVAILABLE',
  appUpdateTitle: 'App Update Aa Gai Hai!',
  appUpdateSubtitle: 'Website se latest app version download / update karein naye features aur tezi ke liye.',
  appUpdateVersion: 'v2.1',
  appUpdateActionText: 'Update App Now 📲',
  appUpdateActionUrl: '',
  appUpdateTheme: 'purple'
};

const defaultCustomer: CustomerProfile = {
  name: '',
  phone: '',
  address: '',
  email: '',
  hasSeenWelcome: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'services' | 'orders' | 'profile'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddressEditOpen, setIsAddressEditOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // Countdown & Confirmed Order
  const [countdownOrderData, setCountdownOrderData] = useState<any | null>(null);
  const [activeOrderReceipt, setActiveOrderReceipt] = useState<Order | null>(null);

  // Delivery Settings from Server
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(defaultDeliverySettings);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 3500);
  };

  // Native PWA Installation State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(() => {
    if (typeof window !== 'undefined' && (window as any).__deferredPrompt) {
      console.log('[NeedHub PWA] Initialized deferredPrompt from window.__deferredPrompt');
      return (window as any).__deferredPrompt;
    }
    return null;
  });
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone = (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://')
    );
    if (isStandalone) {
      console.log('[NeedHub PWA] App is running in standalone mode (installed)');
    }
    return isStandalone;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if early deferredPrompt was already captured
    if ((window as any).__deferredPrompt) {
      console.log('[NeedHub PWA] Synchronizing early deferredPrompt to React state');
      setDeferredPrompt((window as any).__deferredPrompt);
    }

    (window as any).__onPromptReady = (promptEvent: any) => {
      console.log('[NeedHub PWA] Received prompt event via __onPromptReady:', promptEvent);
      setDeferredPrompt(promptEvent);
    };

    // Detect if launched as standalone PWA
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      console.log('[NeedHub PWA] Display mode changed. Standalone:', e.matches);
      if (e.matches) {
        setIsAppInstalled(true);
        setDeferredPrompt(null);
      }
    };
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    }

    // Intercept native browser install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('[NeedHub PWA] 📲 beforeinstallprompt intercepted in AppContext listener:', e);
      e.preventDefault();
      (window as any).__deferredPrompt = e;
      setDeferredPrompt(e);
    };

    // Listen for successful installation
    const handleAppInstalled = (e: Event) => {
      console.log('[NeedHub PWA] 🎉 appinstalled event fired in AppContext:', e);
      setIsAppInstalled(true);
      (window as any).__deferredPrompt = null;
      setDeferredPrompt(null);
      showToast('NeedHub installed successfully on your device!', 'success');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installApp = async () => {
    console.log('[NeedHub] Get App clicked');
    
    // 1. If admin has configured a custom Direct APK Download URL
    if (deliverySettings?.apkDownloadUrl && deliverySettings.apkDownloadUrl.trim() !== '') {
      showToast('Starting Android APK download...', 'info');
      window.open(deliverySettings.apkDownloadUrl.trim(), '_blank', 'noopener,noreferrer');
      return;
    }

    // 2. If app is already installed
    if (isAppInstalled) {
      showToast('NeedHub is already installed & running on your device!', 'info');
      return;
    }

    // 3. Trigger Browser Native 1-Tap App Installation (PWA / Chrome / Edge / Android)
    const promptObj = deferredPrompt || (typeof window !== 'undefined' && (window as any).__deferredPrompt);

    if (promptObj) {
      try {
        console.log('[NeedHub] Native install prompt triggered');
        await promptObj.prompt();
        const choiceResult = await promptObj.userChoice;
        console.log('[NeedHub] Native prompt user choice outcome:', choiceResult?.outcome);
        
        if (choiceResult && choiceResult.outcome === 'accepted') {
          setIsAppInstalled(true);
          showToast('NeedHub installed successfully on your device!', 'success');
        }
        (window as any).__deferredPrompt = null;
        setDeferredPrompt(null);
        return;
      } catch (err) {
        console.warn('[NeedHub] Native install prompt error:', err);
      }
    }

    // 4. Platform specific messaging
    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');
    const isIOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent || '') || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent || '')));

    if (isIOS) {
      showToast('To install on iPhone: Tap Share (📤) → "Add to Home Screen"', 'info');
    } else if (isAndroid) {
      showToast('APK link not yet configured in Admin Settings. Tap browser menu (⋮) → "Install app" to install instantly!', 'info');
    } else {
      showToast('To install NeedHub: Tap browser menu (⋮) → "Install app"', 'info');
    }
  };

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('needhub_dark_mode');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('needhub_dark_mode', JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {}
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Customer Profile
  const [customer, setCustomer] = useState<CustomerProfile>(() => {
    try {
      const saved = localStorage.getItem('needhub_customer_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return defaultCustomer;
  });

  const updateCustomerProfile = (updates: Partial<CustomerProfile>) => {
    setCustomer(prev => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem('needhub_customer_profile', JSON.stringify(updated));
      } catch (e) {}
      
      // Also persist to backend if valid info exists
      if (updated.name && updated.phone && updated.address) {
        api.saveCustomerProfile({
          name: updated.name,
          phone: updated.phone,
          address: updated.address,
          email: updated.email
        }).catch(err => console.log('Profile background sync:', err));
      }
      
      return updated;
    });
  };

  const clearSavedInfo = () => {
    const cleared: CustomerProfile = {
      name: '',
      phone: '',
      address: '',
      email: '',
      hasSeenWelcome: true
    };
    setCustomer(cleared);
    try {
      localStorage.setItem('needhub_customer_profile', JSON.stringify(cleared));
    } catch (e) {}
    showToast('Saved profile information cleared (orders preserved)', 'info');
  };

  const signOutCustomer = () => {
    const resetProfile: CustomerProfile = {
      name: '',
      phone: '',
      address: '',
      email: '',
      hasSeenWelcome: false
    };
    setCustomer(resetProfile);
    try {
      localStorage.removeItem('needhub_customer_profile');
      localStorage.removeItem('needhub_cart');
    } catch (e) {}
    setCart([]);
    setActiveTab('home');
    showToast('Signed out of Need Hub', 'info');
  };

  // Cart Management
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('needhub_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('needhub_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    const itemToRemove = cart.find(item => item.product.id === productId);
    setCart(prev => prev.filter(item => item.product.id !== productId));
    if (itemToRemove) {
      showToast(`Removed "${itemToRemove.product.name}" from cart`, 'info');
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    if (cart.length === 0) return;
    setCart([]);
    try {
      localStorage.removeItem('needhub_cart');
    } catch (e) {}
    showToast('Cart cleared', 'info');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const cartDeliveryFee =
    cartSubtotal === 0
      ? 0
      : deliverySettings.isFreeDeliveryEnabled || cartSubtotal >= deliverySettings.freeDeliveryThreshold
      ? 0
      : deliverySettings.standardFee;

  const cartTotal = cartSubtotal + cartDeliveryFee;

  // Fetch Delivery Settings & App Config
  const refreshConfig = async () => {
    try {
      const res = await api.getConfig();
      if (res.deliverySettings) {
        setDeliverySettings(res.deliverySettings);
      }
    } catch (e) {
      console.error('Failed to load app config', e);
    }
  };

  useEffect(() => {
    refreshConfig();
  }, []);

  // Admin Auth State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminPortalTab, setAdminPortalTab] = useState<'dashboard' | 'products' | 'categories' | 'services' | 'orders' | 'delivery' | 'banner' | 'security'>('dashboard');

  const openAdminPortal = (tab?: 'dashboard' | 'products' | 'categories' | 'services' | 'orders' | 'delivery' | 'banner' | 'security') => {
    if (tab) {
      setAdminPortalTab(tab);
    }
    setIsAdminPortalOpen(true);
  };

  useEffect(() => {
    const token = localStorage.getItem('needhub_admin_token') || sessionStorage.getItem('needhub_admin_token');
    if (token) {
      api.verifyAdminToken()
        .then(res => {
          if (res.valid && res.admin) {
            setAdminUser(res.admin);
          } else {
            localStorage.removeItem('needhub_admin_token');
            sessionStorage.removeItem('needhub_admin_token');
            setAdminUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('needhub_admin_token');
          sessionStorage.removeItem('needhub_admin_token');
          setAdminUser(null);
        });
    }
  }, []);

  const adminLogout = () => {
    localStorage.removeItem('needhub_admin_token');
    sessionStorage.removeItem('needhub_admin_token');
    setAdminUser(null);
    setIsAdminPortalOpen(false);
    showToast('Admin logged out safely', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        selectedService,
        setSelectedService,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isAddressEditOpen,
        setIsAddressEditOpen,
        isAdminPortalOpen,
        setIsAdminPortalOpen,
        countdownOrderData,
        setCountdownOrderData,
        activeOrderReceipt,
        setActiveOrderReceipt,
        customer,
        updateCustomerProfile,
        clearSavedInfo,
        signOutCustomer,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,
        deliverySettings,
        refreshConfig,
        darkMode,
        toggleDarkMode,
        adminUser,
        setAdminUser,
        adminLogout,
        adminPortalTab,
        setAdminPortalTab,
        openAdminPortal,
        toast,
        showToast,
        isAppInstalled,
        isInstallPromptAvailable: !!deferredPrompt,
        installApp
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
