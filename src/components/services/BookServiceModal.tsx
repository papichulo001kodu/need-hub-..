import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, MapPin, Phone, User, CheckCircle2, ShieldCheck, Star } from 'lucide-react';
import { Service } from '../../types';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

interface BookServiceModalProps {
  service: Service;
  onClose: () => void;
}

export const BookServiceModal: React.FC<BookServiceModalProps> = ({ service, onClose }) => {
  const { customer, updateCustomerProfile, deliverySettings, showToast, setActiveTab } = useApp();

  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [address, setAddress] = useState(customer.address || '');
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 01:00 PM');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  const timeSlots = [
    '08:00 AM - 11:00 AM',
    '11:00 AM - 02:00 PM',
    '02:00 PM - 05:00 PM',
    '05:00 PM - 08:00 PM'
  ];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      showToast('Please enter your contact phone number', 'error');
      return;
    }

    if (!address.trim()) {
      showToast('Please enter the service location address', 'error');
      return;
    }

    setBooking(true);

    try {
      updateCustomerProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        hasSeenWelcome: true
      });

      const order = await api.createOrder({
        customerName: name.trim() || 'Customer',
        customerPhone: phone.trim(),
        deliveryAddress: address.trim(),
        services: [
          {
            serviceId: service.id,
            date,
            timeSlot,
            notes: notes.trim()
          }
        ],
        paymentMethod: 'Pay After Service'
      });

      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast(`Service "${service.name}" booked successfully!`, 'success');
      onClose();
      setActiveTab('orders');
    } catch (err: any) {
      showToast(err.message || 'Failed to book service', 'error');
    } finally {
      setBooking(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              Book Doorstep Service
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleBook} className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Service Snapshot */}
            <div className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <img
                src={service.image}
                alt={service.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{service.rating} Rating</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {service.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xs text-slate-500">Starting at</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {deliverySettings.currencySymbol} {service.startingPrice}
                  </span>
                </div>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Select Date & Preferred Slot
              </label>

              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold transition-all text-center ${
                      timeSlot === slot
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Service Address & Contact
              </label>

              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  placeholder="Contact Phone Number *"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <textarea
                  required
                  rows={2}
                  placeholder="Complete Address (House/Flat, Street, Landmark) *"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Special instructions or service problem note (optional)"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Need Hub Guarantee */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Verified background-checked experts with 30-day service warranty.</span>
            </div>

            {/* Book CTA */}
            <button
              id="confirm-book-service-btn"
              type="submit"
              disabled={booking}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{booking ? 'Booking Appointment...' : `Confirm Booking • ${deliverySettings.currencySymbol} ${service.startingPrice}`}</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
