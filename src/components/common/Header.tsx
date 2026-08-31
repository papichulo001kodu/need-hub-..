import React from 'react';
import { MapPin, ShoppingBag, Search, ChevronDown, Download, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/appConfig';

export const Header: React.FC = () => {
  const {
    customer,
    cartCount,
    setIsCartOpen,
    setIsAddressEditOpen,
    setActiveTab,
    isAppInstalled,
    installApp
  } = useApp();

  const displayAddress = customer.address
    ? customer.address.split(',')[0]
    : 'Select delivery address';

  const handleGetApp = () => {
    console.log('[NeedHub] GET APP BUTTON CLICKED');
    installApp();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-md mx-auto px-3.5 sm:px-4 py-2.5 flex items-center justify-between gap-2.5">
        {/* Brand & Location Header */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              <span className="text-emerald-600 dark:text-emerald-400">Need</span>Hub
            </span>
          </div>

          <button
            id="header-delivery-address-btn"
            onClick={() => setIsAddressEditOpen(true)}
            className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left truncate mt-0.5 cursor-pointer"
            title={customer.address || 'Click to set address'}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px] sm:max-w-[190px]">
              {displayAddress}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>
        </div>

        {/* Right Actions: App Download, Search & Cart */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* PWA Official Install Button */}
          {!isAppInstalled ? (
            <button
              id="header-download-app-btn"
              onClick={handleGetApp}
              title={`Install ${APP_CONFIG.appName} App`}
              aria-label="Install NeedHub App"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 animate-pulse text-emerald-600 dark:text-emerald-400" />
              <span>Get App</span>
            </button>
          ) : (
            <button
              id="header-app-installed-btn"
              onClick={handleGetApp}
              title="NeedHub App is installed"
              aria-label="NeedHub App Installed"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs transition-all shadow-2xs cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xs:inline sm:inline">Installed</span>
              <span className="xs:hidden sm:hidden">App</span>
            </button>
          )}

          <button
            id="header-search-btn"
            onClick={() => setActiveTab('search')}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-xs cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            id="header-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="relative w-9 h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center transition-all shadow-sm shadow-emerald-600/30 cursor-pointer"
            aria-label="Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
