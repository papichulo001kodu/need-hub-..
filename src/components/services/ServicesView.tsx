import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wrench, Star, Clock, ShieldCheck, ArrowRight, Sparkles, Check } from 'lucide-react';
import { api } from '../../services/api';
import { Service } from '../../types';
import { useApp } from '../../context/AppContext';
import { BookServiceModal } from './BookServiceModal';

export const ServicesView: React.FC = () => {
  const { deliverySettings, showToast } = useApp();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeBookingService, setActiveBookingService] = useState<Service | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await api.getServices({ availableOnly: true });
      setServices(data);
    } catch (err) {
      console.error('Failed to load services', err);
      showToast('Could not load services', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const categories = ['all', ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = selectedCategory === 'all'
    ? services
    : services.filter(s => s.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-200 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Need Hub Home Care</span>
        </div>
        <h1 className="text-xl font-black">Doorstep Expert Services</h1>
        <p className="text-xs text-emerald-100 mt-1 max-w-xs leading-relaxed">
          Cleaners, plumbers, electricians & appliance technicians verified and ready to serve.
        </p>

        <div className="flex items-center gap-4 mt-3 text-[11px] font-semibold text-emerald-100">
          <div className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-emerald-300" />
            <span>Fixed Transparent Pricing</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>30-Day Warranty</span>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap capitalize transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading verified services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          No services found in this category.
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredServices.map(srv => (
            <motion.div
              key={srv.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row"
            >
              {/* Image Container with aspect ratio safety */}
              <div className="relative w-full sm:w-40 aspect-video sm:aspect-square bg-slate-100 dark:bg-slate-700 shrink-0 overflow-hidden">
                <img
                  src={srv.image}
                  alt={srv.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {srv.category}
                </span>
              </div>

              {/* Service details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {srv.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{srv.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {srv.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {srv.duration}
                    </span>
                  </div>
                </div>

                {/* Price & Book Button */}
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">
                      {srv.priceType === 'starting' ? 'Starting From' : 'Standard Rate'}
                    </span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {deliverySettings.currencySymbol} {srv.startingPrice}
                    </span>
                  </div>

                  <button
                    id={`book-service-btn-${srv.id}`}
                    onClick={() => setActiveBookingService(srv)}
                    className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {activeBookingService && (
        <BookServiceModal
          service={activeBookingService}
          onClose={() => setActiveBookingService(null)}
        />
      )}
    </div>
  );
};
