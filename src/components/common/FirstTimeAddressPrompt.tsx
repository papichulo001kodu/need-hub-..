import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, X, ArrowRight, ShieldCheck, Sparkles, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FirstTimeAddressPrompt: React.FC = () => {
  const { customer, setIsAddressEditOpen } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if the customer hasn't set an address yet AND hasn't dismissed the prompt before
    try {
      const dismissed = localStorage.getItem('needhub_address_prompt_dismissed');
      if (!customer.address && !dismissed) {
        // Small delay for smooth entry after app mount
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, [customer.address]);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('needhub_address_prompt_dismissed', 'true');
    } catch (e) {}
  };

  const handleOpenAddressSetup = () => {
    handleDismiss();
    setIsAddressEditOpen(true);
  };

  if (!isVisible || customer.address) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-35 flex items-end sm:items-center justify-center p-3 sm:p-4 pointer-events-none">
        {/* Subtle backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="fixed inset-0 bg-slate-950/30 backdrop-blur-xs pointer-events-auto"
        />

        {/* Notification card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-emerald-100 dark:border-emerald-950/80 pointer-events-auto overflow-hidden"
        >
          {/* Top accent glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close 'X' Button */}
          <button
            id="first-time-address-close-btn"
            onClick={handleDismiss}
            aria-label="Dismiss address setup"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
              <MapPin className="w-6 h-6 animate-bounce" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Fast Delivery</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                Set up your address if you want
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Add your delivery address to see live availability, estimated delivery times, and enjoy seamless 1-click checkout.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
            <button
              id="first-time-address-setup-btn"
              onClick={handleOpenAddressSetup}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Set Up Address</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="first-time-address-skip-btn"
              onClick={handleDismiss}
              className="py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs rounded-xl transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
