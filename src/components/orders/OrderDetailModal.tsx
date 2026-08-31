import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Clock, MapPin, Phone, User, AlertCircle, ShoppingBag, ShieldAlert, Wrench, Trash2 } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onOrderUpdated: (updated: Order) => void;
  onRemoveFromHistory?: (orderId: string) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose, onOrderUpdated, onRemoveFromHistory }) => {
  const { deliverySettings, showToast } = useApp();
  const [cancelling, setCancelling] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [showRemovePrompt, setShowRemovePrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const statusSteps: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
  const currentStepIdx = statusSteps.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  const canCancel = order.status === 'Pending' || order.status === 'Confirmed' || order.status === 'Preparing';

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const updated = await api.cancelOrder(order.id, cancelReason || 'Cancelled by customer');
      onOrderUpdated(updated);
      showToast(`Order ${order.orderNumber} has been cancelled`, 'info');
      setShowCancelPrompt(false);
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel order', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleConfirmRemove = () => {
    if (onRemoveFromHistory) {
      onRemoveFromHistory(order.id);
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

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Order Tracking
              </span>
              <h2 className="font-mono font-black text-base text-slate-900 dark:text-white">
                {order.orderNumber}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable details */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Status Step Tracker */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase text-slate-500">Live Status</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isCancelled
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                      : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {!isCancelled ? (
                <div className="relative flex justify-between items-center px-1 pt-2">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{
                        width: `${Math.max(0, (currentStepIdx / (statusSteps.length - 1)) * 100)}%`
                      }}
                    />
                  </div>

                  {statusSteps.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={step} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                            isDone
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-100 dark:ring-emerald-900'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                          } ${isCurrent ? 'scale-110' : ''}`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </div>
                        <span
                          className={`text-[9px] mt-1 font-semibold max-w-[50px] text-center leading-tight ${
                            isCurrent
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : isDone
                              ? 'text-slate-800 dark:text-slate-200'
                              : 'text-slate-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 font-semibold p-2 bg-rose-50 dark:bg-rose-950/50 rounded-xl">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>This order was cancelled. Any charged amount will be refunded.</span>
                </div>
              )}
            </div>

            {/* Delivery Address & Customer */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    {order.customerName} ({order.customerPhone})
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {order.deliveryAddress}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-500 text-[11px]">
                <Clock className="w-3.5 h-3.5" />
                <span>Placed on {new Date(order.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Items Breakdown */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Items Ordered ({order.items?.length || 0})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 dark:text-white block truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {item.unit} • Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white shrink-0 ml-2">
                      {deliverySettings.currencySymbol} {item.price * item.quantity}
                    </span>
                  </div>
                ))}

                {order.services?.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-sky-600 shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          {s.name} (Service)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Scheduled: {s.date} • {s.timeSlot}
                        </span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white shrink-0">
                      {deliverySettings.currencySymbol} {s.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill Summary */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {deliverySettings.currencySymbol} {order.subtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {order.deliveryFee === 0 ? 'FREE' : `${deliverySettings.currencySymbol} ${order.deliveryFee}`}
                </span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-black text-slate-900 dark:text-white text-sm">
                <span>Total Paid ({order.paymentMethod})</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-base">
                  {deliverySettings.currencySymbol} {order.total}
                </span>
              </div>
            </div>

            {/* Cancel Action */}
            {canCancel && (
              <div className="pt-2">
                {!showCancelPrompt ? (
                  <button
                    onClick={() => setShowCancelPrompt(true)}
                    className="w-full py-2.5 px-4 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-bold border border-rose-200 dark:border-rose-900/60 transition-colors"
                  >
                    Cancel This Order
                  </button>
                ) : (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl border border-rose-200 dark:border-rose-900 space-y-2">
                    <p className="text-xs font-bold text-rose-800 dark:text-rose-200">
                      Are you sure you want to cancel this order?
                    </p>
                    <input
                      type="text"
                      placeholder="Reason for cancellation (optional)"
                      value={cancelReason}
                      onChange={e => setCancelReason(e.target.value)}
                      className="w-full p-2 text-xs bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-800 rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancelOrder}
                        disabled={cancelling}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg"
                      >
                        {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                      </button>
                      <button
                        onClick={() => setShowCancelPrompt(false)}
                        className="py-1.5 px-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Remove from Order History Action */}
            {onRemoveFromHistory && (
              <div className="pt-1">
                {!showRemovePrompt ? (
                  <button
                    type="button"
                    onClick={() => setShowRemovePrompt(true)}
                    className="w-full py-2.5 px-4 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove from Order History</span>
                  </button>
                ) : (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/60 rounded-xl border border-rose-200 dark:border-rose-900 space-y-2">
                    <p className="text-xs font-bold text-rose-800 dark:text-rose-200 text-center">
                      Remove this order from your order history?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmRemove}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRemovePrompt(false)}
                        className="py-1.5 px-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-lg border border-slate-300 dark:border-slate-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
