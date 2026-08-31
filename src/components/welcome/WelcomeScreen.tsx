import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, Sparkles, MapPin, Phone, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WelcomeScreen: React.FC = () => {
  const { customer, updateCustomerProfile, showToast } = useApp();

  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [address, setAddress] = useState(customer.address || '');

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      showToast('Please enter your phone number to continue', 'info');
      return;
    }

    updateCustomerProfile({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      hasSeenWelcome: true
    });
    showToast('Welcome to Need Hub!');
  };

  const handleSkip = () => {
    // If they typed something, save it, but allow skipping
    updateCustomerProfile({
      name: name.trim() || customer.name || '',
      phone: phone.trim() || customer.phone || '',
      address: address.trim() || customer.address || '',
      hasSeenWelcome: true
    });
    showToast('Browsing as guest. You can set address at checkout.', 'info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Decorative background accent circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-64 h-64 bg-emerald-400/15 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Logo */}
      <div className="pt-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-600 shadow-xl shadow-emerald-500/25 mb-4 text-white">
          <ShoppingBag className="w-10 h-10 stroke-[2.2]" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Need<span className="text-emerald-600 dark:text-emerald-400">Hub</span>
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
          Fresh Groceries & Home Services in 15 Minutes
        </p>

        {/* Feature Badges */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Instant Delivery</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Verified Experts</span>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="my-auto py-6 relative z-10">
        <form onSubmit={handleContinue} className="space-y-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg">
          <div className="text-left mb-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Quick Start</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your details for fast doorstep delivery
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name (Optional)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="welcome-name-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="welcome-phone-input"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter phone number (e.g. 0300 1234567)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Delivery Address (Optional)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <textarea
                id="welcome-address-input"
                rows={2}
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="House/Flat number, building, street, landmark"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
          </div>

          <button
            id="welcome-continue-btn"
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition-all"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Skip Button & Footer */}
      <div className="pb-4 text-center relative z-10">
        <button
          id="welcome-skip-btn"
          type="button"
          onClick={handleSkip}
          className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 py-2 px-4 rounded-xl transition-colors"
        >
          Skip for now
        </button>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
          By continuing, you agree to Need Hub's Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};
