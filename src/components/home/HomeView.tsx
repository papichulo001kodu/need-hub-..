import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, ArrowRight, Zap, ShieldCheck, Flame, ChevronRight, RefreshCw, Star, Clock, Download, Smartphone, ExternalLink, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Category, Product, Service } from '../../types';
import { ProductCard } from '../products/ProductCard';
import { BookServiceModal } from '../services/BookServiceModal';

export const HomeView: React.FC = () => {
  const { setActiveTab, setIsAddressEditOpen, customer, deliverySettings, showToast, installApp } = useApp();
  const [isUpdateBannerDismissed, setIsUpdateBannerDismissed] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedBookingService, setSelectedBookingService] = useState<Service | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, prods, srvs] = await Promise.all([
        api.getCategories(),
        api.getProducts(),
        api.getServices({ availableOnly: true })
      ]);
      setCategories(cats);
      setAllProducts(prods);
      setPopularProducts(prods.filter(p => p.isPopular));
      setServices(srvs);
    } catch (err) {
      console.error('Failed to load home data', err);
      showToast('Could not load catalog data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const displayedProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(p => p.categoryId === selectedCategory);

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-24 space-y-5">
      {/* Search Bar (Clicking activates search view or queries) */}
      <div
        id="home-search-trigger"
        onClick={() => setActiveTab('search')}
        className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl cursor-pointer shadow-sm hover:border-emerald-500 transition-colors"
      >
        <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs text-slate-400 font-medium">
          Search products, categories, services...
        </span>
      </div>

      {/* App Update Announcement Banner (Configurable in Admin) */}
      {deliverySettings.isAppUpdateBannerVisible && !isUpdateBannerDismissed && (
        <div
          id="app-update-alert-banner"
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
                <Smartphone className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full border border-white/30 text-white">
                    {deliverySettings.appUpdateTagline || 'NEW VERSION AVAILABLE'}
                  </span>
                  {deliverySettings.appUpdateVersion && (
                    <span className="text-[10px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-xs">
                      {deliverySettings.appUpdateVersion}
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-extrabold leading-snug text-white">
                  {deliverySettings.appUpdateTitle || 'App Update Aa Gai Hai!'}
                </h3>
                <p className="text-[11px] text-white/90 font-medium leading-relaxed">
                  {deliverySettings.appUpdateSubtitle || 'Website se latest app update karein naye features aur fast delivery ke liye.'}
                </p>

                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      if (deliverySettings.appUpdateActionUrl && deliverySettings.appUpdateActionUrl.trim() !== '') {
                        let targetUrl = deliverySettings.appUpdateActionUrl.trim();
                        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
                          targetUrl = `https://${targetUrl}`;
                        }
                        window.open(targetUrl, '_blank', 'noopener,noreferrer');
                      } else {
                        installApp();
                      }
                    }}
                    className="px-3.5 py-1.5 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{deliverySettings.appUpdateActionText || 'Update App Now 📲'}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsUpdateBannerDismissed(true)}
                    className="px-2.5 py-1.5 bg-black/20 hover:bg-black/40 text-white/90 hover:text-white rounded-xl text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsUpdateBannerDismissed(true)}
              className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              title="Dismiss announcement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Express Promise / Promo Announcement Banner */}
      {deliverySettings.isBannerVisible !== false && (
        <div
          id="home-promo-banner"
          onClick={() => {
            if (deliverySettings.bannerLinkUrl && deliverySettings.bannerLinkUrl.trim() !== '') {
              let targetUrl = deliverySettings.bannerLinkUrl.trim();
              if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
                targetUrl = `https://${targetUrl}`;
              }
              window.open(targetUrl, '_blank', 'noopener,noreferrer');
            }
          }}
          className={`relative rounded-3xl p-4 text-white shadow-md overflow-hidden flex items-center justify-between transition-all ${
            deliverySettings.bannerLinkUrl && deliverySettings.bannerLinkUrl.trim() !== ''
              ? 'cursor-pointer hover:shadow-lg active:scale-[0.99] ring-1 ring-white/20'
              : ''
          } ${
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
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-lg pointer-events-none" />
          <div className="relative z-10 max-w-[260px]">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-emerald-200 opacity-90">
              <Zap className="w-3 h-3 fill-current" />
              <span>{deliverySettings.bannerTagline || 'Need Hub Express'}</span>
            </div>
            <h2 className="text-base font-extrabold leading-tight mt-0.5">
              {deliverySettings.bannerTitle || 'Fresh Groceries & Daily Essentials'}
            </h2>
            <p className="text-[11px] text-white/90 mt-0.5 font-medium">
              {deliverySettings.bannerSubtitle || (
                deliverySettings.isFreeDeliveryEnabled
                  ? '⚡ FREE Delivery on all orders today!'
                  : `⚡ Free delivery on orders over ${deliverySettings.currencySymbol} ${deliverySettings.freeDeliveryThreshold}`
              )}
            </p>
          </div>
          
          <div className="relative z-10 flex flex-col items-end gap-1.5 shrink-0">
            {deliverySettings.bannerBadgeText && (
              <div className="px-2.5 py-2 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-black text-xs text-white border border-white/20 text-center shadow-xs">
                {deliverySettings.bannerBadgeText}
              </div>
            )}
            {deliverySettings.bannerLinkUrl && deliverySettings.bannerLinkUrl.trim() !== '' && (
              <div className="flex items-center gap-1 text-[10px] font-black bg-white/20 hover:bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/30">
                <span>Open Link</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </div>
            )}
          </div>
        </div>
      )}


      {/* Categories Grid / Horizontal Chips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Explore Categories</span>
          </h2>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {categories.length} Departments
          </span>
        </div>

        {/* Category Icons Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`cat-pill-${cat.id}`}
                onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                className={`p-2 rounded-2xl border flex flex-col items-center justify-between text-center transition-all ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800/80 hover:bg-slate-50'
                }`}
              >
                <div className="w-11 h-11 rounded-xl overflow-hidden mb-1.5 bg-slate-100 dark:bg-slate-700">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span
                  className={`text-[11px] font-bold leading-tight line-clamp-2 ${
                    isSelected
                      ? 'text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Popular Products Carousel (Horizontal carousel ~2 cards visible on mobile) */}
      {popularProducts.length > 0 && selectedCategory === 'all' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Popular & Trending</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-400">
              Scroll →
            </span>
          </div>

          {/* Horizontal Carousel with 2 cards visible on mobile */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 snap-x snap-mandatory">
            {popularProducts.map(prod => (
              <div key={prod.id} className="snap-start shrink-0">
                <ProductCard product={prod} horizontalMode={true} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Services Section Preview */}
      {services.length > 0 && selectedCategory === 'all' && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Doorstep Home Services</span>
            </h2>
            <button
              onClick={() => setActiveTab('services')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Featured Service Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            {services.slice(0, 2).map(srv => (
              <div
                key={srv.id}
                onClick={() => setSelectedBookingService(srv)}
                className="p-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm cursor-pointer hover:border-emerald-500 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-2 bg-slate-100 dark:bg-slate-700">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1.5 left-1.5 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {srv.category}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {srv.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {deliverySettings.currencySymbol} {srv.startingPrice}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md">
                      Book
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Catalog Products Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {selectedCategory === 'all'
                ? 'All Products'
                : categories.find(c => c.id === selectedCategory)?.name || 'Products'}
            </h2>
            <span className="text-[11px] text-slate-500">
              {displayedProducts.length} items available
            </span>
          </div>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400"
            >
              Show All
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Refreshing Need Hub products...</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            No products found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayedProducts.map(prod => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        )}
      </div>

      {/* Service booking modal */}
      {selectedBookingService && (
        <BookServiceModal
          service={selectedBookingService}
          onClose={() => setSelectedBookingService(null)}
        />
      )}
    </div>
  );
};
