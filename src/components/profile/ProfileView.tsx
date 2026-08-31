import React from 'react';
import { Settings, User, Phone, MapPin, Edit3, ShoppingBag, Moon, Sun, Trash2, LogOut, ShieldCheck, ChevronRight, Sparkles, Download, Smartphone, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/appConfig';

export const ProfileView: React.FC = () => {
  const {
    customer,
    setIsAddressEditOpen,
    setIsSettingsOpen,
    setActiveTab,
    darkMode,
    toggleDarkMode,
    clearSavedInfo,
    signOutCustomer,
    isAppInstalled,
    installApp
  } = useApp();

  const handleInstallApp = () => {
    console.log('[NeedHub] GET APP BUTTON CLICKED (Profile)');
    installApp();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Top Header with Profile title & Top-Right Settings ⚙ icon */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Profile</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your account & preferences
          </p>
        </div>

        {/* Small Settings ⚙ icon placed strictly at top right */}
        <button
          id="profile-settings-btn"
          onClick={() => setIsSettingsOpen(true)}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition-colors shadow-sm"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* User Card */}
      <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/90 dark:to-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/25">
              {customer.name ? customer.name.charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                {customer.name || 'Guest User'}
              </h2>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-emerald-600" />
                {customer.phone || 'No phone set'}
              </span>
            </div>
          </div>

          <button
            id="profile-edit-btn"
            onClick={() => setIsAddressEditOpen(true)}
            className="py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold text-xs flex items-center gap-1 hover:bg-emerald-100 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Address preview block */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3 text-emerald-600" />
            Default Delivery Address
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {customer.address || 'No address added yet. Click edit to set address.'}
          </p>
        </div>
      </div>

      {/* Quick Navigation Items */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 divide-y divide-slate-100 dark:divide-slate-700/60 shadow-sm overflow-hidden">
        {/* My Orders */}
        <button
          id="profile-my-orders-btn"
          onClick={() => setActiveTab('orders')}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                My Orders
              </span>
              <span className="text-[11px] text-slate-500">
                Track active deliveries & order history
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Edit Profile */}
        <button
          id="profile-edit-details-btn"
          onClick={() => setIsAddressEditOpen(true)}
          className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Edit Profile & Address
              </span>
              <span className="text-[11px] text-slate-500">
                Change phone, delivery notes, and location
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Install Official App (PWA) */}
        <button
          id="profile-install-app-btn"
          onClick={handleInstallApp}
          className="w-full flex items-center justify-between p-4 hover:bg-emerald-50/50 dark:hover:bg-slate-800 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              {isAppInstalled ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 animate-bounce" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {isAppInstalled ? 'NeedHub App Installed' : 'Install NeedHub App'}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {isAppInstalled ? 'Active' : 'Official App'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                {isAppInstalled ? 'Running with standalone offline capabilities' : 'Instant install on Mobile &amp; PC'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-slate-700 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Dark Mode
              </span>
              <span className="text-[11px] text-slate-500">
                Toggle eye-friendly dark theme
              </span>
            </div>
          </div>

          <button
            id="profile-dark-mode-switch"
            onClick={toggleDarkMode}
            className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
              darkMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Profile Management Actions */}
      <div className="space-y-2.5 pt-2">
        <button
          id="profile-clear-info-btn"
          onClick={clearSavedInfo}
          className="w-full py-3 px-4 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Saved Info</span>
        </button>

        <button
          id="profile-signout-btn"
          onClick={signOutCustomer}
          className="w-full py-3 px-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
