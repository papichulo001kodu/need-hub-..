import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, X, AlertTriangle, ArrowLeft, PackageCheck, ShoppingBag, MapPin, Clock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Order } from '../../types';

export const OrderCountdownModal: React.FC = () => {
  const {
    countdownOrderData,
    setCountdownOrderData,
    clearCart,
    deliverySettings,
    setActiveTab,
    setIsCartOpen,
    showToast
  } = useApp();

  const [countdown, setCountdown] = useState<number>(3);
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const orderCreatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!countdownOrderData) {
      setCountdown(3);
      setConfirmedOrder(null);
      setIsCreatingOrder(false);
      orderCreatedRef.current = false;
      return;
    }

    setCountdown(3);
    setConfirmedOrder(null);
    orderCreatedRef.current = false;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Zero reached: create order automatically!
          finalizeOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownOrderData]);

  const finalizeOrder = async () => {
    if (orderCreatedRef.current || !countdownOrderData) return;
    orderCreatedRef.current = true;
    setIsCreatingOrder(true);

    try {
      const newOrder = await api.createOrder({
        customerName: countdownOrderData.customerName,
        customerPhone: countdownOrderData.customerPhone,
        deliveryAddress: countdownOrderData.deliveryAddress,
        items: countdownOrderData.items.map((i: any) => ({
          productId: i.productId,
          quantity: i.quantity
        })),
        paymentMethod: countdownOrderData.paymentMethod
      });

      setConfirmedOrder(newOrder);
      clearCart();
      setIsCreatingOrder(false);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      showToast(`Order ${newOrder.orderNumber} placed successfully!`, 'success');
    } catch (err: any) {
      console.error('Failed to create order', err);
      showToast(err.message || 'Failed to place order. Please retry.', 'error');
      setCountdownOrderData(null);
      setIsCreatingOrder(false);
    }
  };

  const handleCancelCountdown = () => {
    setCountdownOrderData(null);
    showToast('Order placement cancelled', 'info');
  };

  const handleModifyCart = () => {
    setCountdownOrderData(null);
    setIsCartOpen(true);
    showToast('You can modify cart items or quantities now', 'info');
  };

  const handleViewOrders = () => {
    setCountdownOrderData(null);
    setConfirmedOrder(null);
    setActiveTab('orders');
  };

  if (!countdownOrderData && !confirmedOrder) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {!confirmedOrder ? (
            /* --- COUNTDOWN STATE --- */
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                {/* Glowing animated countdown circle */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-emerald-100 dark:border-emerald-950/80 animate-ping opacity-25" />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/30 text-white">
                    <span className="text-4xl font-black tracking-tighter">
                      {countdown > 0 ? countdown : '✓'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Placing your Need Hub Order...
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                  You can pause, cancel, or modify items during this 3-second safeguard countdown.
                </p>
              </div>

              {/* Order preview details */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 text-left space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>Order Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {deliverySettings.currencySymbol} {countdownOrderData.total}
                  </span>
                </div>
                <div className="truncate text-slate-500">
                  Deliver to: <span className="text-slate-800 dark:text-slate-200">{countdownOrderData.deliveryAddress}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {countdownOrderData.items?.length} items • {countdownOrderData.paymentMethod}
                </div>
              </div>

              {/* Countdown actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="countdown-cancel-btn"
                  onClick={handleCancelCountdown}
                  className="py-3 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel Order</span>
                </button>

                <button
                  id="countdown-modify-cart-btn"
                  onClick={handleModifyCart}
                  className="py-3 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Modify Cart</span>
                </button>
              </div>
            </div>
          ) : (
            /* --- ORDER CONFIRMED STATE --- */
            <div className="space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400">
                  Payment: {confirmedOrder.paymentMethod}
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  Order Confirmed!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your order is received and our delivery partner is preparing your items.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Order ID</span>
                    <span className="font-mono font-extrabold text-slate-900 dark:text-white text-sm">
                      {confirmedOrder.orderNumber}
                    </span>
                  </div>
                  <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full text-[11px]">
                    {confirmedOrder.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    Est. Arrival
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {deliverySettings.estimatedMinutes}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    Delivery To
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {confirmedOrder.deliveryAddress}
                  </span>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-black text-slate-900 dark:text-white text-sm">
                  <span>Grand Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {deliverySettings.currencySymbol} {confirmedOrder.total}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="space-y-2">
                <button
                  id="view-my-orders-cta-btn"
                  onClick={handleViewOrders}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition-all"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Track in My Orders</span>
                </button>

                <button
                  id="continue-shopping-cta-btn"
                  onClick={() => {
                    setCountdownOrderData(null);
                    setConfirmedOrder(null);
                    setActiveTab('home');
                  }}
                  className="w-full py-2.5 px-4 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold text-xs transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
