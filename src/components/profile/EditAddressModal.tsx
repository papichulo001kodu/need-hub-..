import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, User, Phone, Save, Navigation, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EditAddressModal: React.FC = () => {
  const { isAddressEditOpen, setIsAddressEditOpen, customer, updateCustomerProfile, showToast } = useApp();

  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [address, setAddress] = useState(customer.address || '');
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (isAddressEditOpen) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
    }
  }, [isAddressEditOpen, customer]);

  if (!isAddressEditOpen) return null;

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'info');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        const coordsText = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
        if (!address) {
          setAddress(`Current Location (${coordsText})`);
        }
        updateCustomerProfile({
          locationCoordinates: { lat: latitude, lng: longitude }
        });
        showToast('GPS Location captured successfully!', 'success');
        setLocating(false);
      },
      error => {
        console.warn('Geolocation error:', error);
        showToast('Could not fetch GPS location. Please enter address manually.', 'info');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      showToast('Please enter a delivery address', 'error');
      return;
    }

    updateCustomerProfile({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      hasSeenWelcome: true
    });

    try {
      localStorage.setItem('needhub_address_prompt_dismissed', 'true');
    } catch (e) {}

    setIsAddressEditOpen(false);
    showToast('Delivery address saved successfully', 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAddressEditOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Set Delivery Address</span>
            </h2>
            <button
              onClick={() => setIsAddressEditOpen(false)}
              aria-label="Close"
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="mt-4 space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="edit-address-name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number <span className="text-slate-400 font-normal">(for order updates)</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="edit-address-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Delivery Address <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleLocateMe}
                  disabled={locating}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
                >
                  {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                  <span>{locating ? 'Detecting...' : 'Use GPS Location'}</span>
                </button>
              </div>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  id="edit-address-textarea"
                  rows={3}
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="House/Apartment #, Building, Street, Area, Landmark"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>

            <button
              id="save-address-btn"
              type="submit"
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-xs transition-all mt-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Delivery Address</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
