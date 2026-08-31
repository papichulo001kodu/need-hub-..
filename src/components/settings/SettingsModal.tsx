import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Moon, Sun, Bell, Shield, Info, LogOut, Trash2, KeyRound, ChevronRight, Check, Download, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/appConfig';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    darkMode,
    toggleDarkMode,
    clearSavedInfo,
    signOutCustomer,
    setIsAdminPortalOpen,
    adminUser,
    isAppInstalled,
    installApp,
    showToast
  } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);

  if (!isSettingsOpen) return null;

  const handleInstallApp = () => {
    console.log('[NeedHub] GET APP BUTTON CLICKED (Settings)');
    installApp();
  };

  const handleToggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    showToast(`Order notifications ${!notificationsEnabled ? 'enabled' : 'disabled'}`, 'info');
  };

  const handleOpenAdmin = () => {
    setIsSettingsOpen(false);
    setIsAdminPortalOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsSettingsOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">Settings</h2>
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Settings List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 divide-y divide-slate-100 dark:divide-slate-800">
            {/* Appearance / Dark Mode */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Appearance
              </span>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Dark Theme
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {darkMode ? 'Dark mode enabled' : 'Light mode enabled'}
                    </span>
                  </div>
                </div>

                <button
                  id="settings-dark-mode-toggle"
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

            {/* Notifications */}
            <div className="pt-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Notifications
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Order & Delivery Status
                      </span>
                      <span className="text-[10px] text-slate-500">Real-time status updates</span>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleNotifications}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      notificationsEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Saved Data */}
            <div className="pt-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Saved Information
              </span>
              <button
                id="settings-clear-info-btn"
                onClick={() => {
                  clearSavedInfo();
                  setIsSettingsOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      Clear Saved Info
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Clears name & phone (orders are kept safe)
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* App Installation */}
            <div className="pt-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Application &amp; Installation
              </span>
              <button
                id="settings-install-app-btn"
                onClick={handleInstallApp}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-100 transition-colors text-left shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    {isAppInstalled ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {isAppInstalled ? 'NeedHub App Installed' : 'Install NeedHub App'}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-200/80 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                        {isAppInstalled ? 'Active' : 'Mobile & PC'}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {isAppInstalled ? 'Standalone app mode active on this device' : 'Instant install on Mobile and PC'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>

            {/* About Need Hub */}
            <div className="pt-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                About Need Hub
              </span>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Version</span>
                  <span>2.4.0 (Need Hub Native)</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Delivery Promise</span>
                  <span>15-25 Mins Doorstep</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1 leading-relaxed">
                  Need Hub is your dedicated hyper-local grocery and essential home services delivery platform.
                </p>
              </div>
            </div>

            {/* Admin Portal Gateway */}
            <div className="pt-4 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Administration
              </span>
              <button
                id="settings-admin-portal-btn"
                onClick={handleOpenAdmin}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 transition-colors text-left shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-700 text-emerald-400 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {adminUser ? 'Open Admin Dashboard' : 'Need Hub Admin Login'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {adminUser ? `Logged in as ${adminUser.email}` : 'Authorized store managers only'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Sign Out */}
            <div className="pt-4">
              <button
                id="settings-signout-btn"
                onClick={() => {
                  setIsSettingsOpen(false);
                  signOutCustomer();
                }}
                className="w-full py-3 px-4 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Need Hub</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
