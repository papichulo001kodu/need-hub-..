import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Clock, MapPin, ChevronRight, RefreshCw, XCircle, CheckCircle, Package, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { OrderDetailModal } from './OrderDetailModal';

export const OrdersView: React.FC = () => {
  const { customer, deliverySettings, setActiveTab, showToast } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToRemove, setOrderToRemove] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Pass customer phone if available or fetch recent
      const data = await api.getOrders(customer.phone);
      // Filter out customer-hidden/removed orders
      let removedIds: string[] = [];
      try {
        const stored = localStorage.getItem('needhub_removed_orders');
        if (stored) removedIds = JSON.parse(stored);
      } catch (e) {}
      const visibleOrders = data.filter((o: Order) => !removedIds.includes(o.id));
      setOrders(visibleOrders);
    } catch (err: any) {
      console.error('Failed to load orders', err);
      showToast('Could not load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [customer.phone]);

  const handleConfirmRemoveOrder = (orderId: string) => {
    try {
      let removedIds: string[] = [];
      const stored = localStorage.getItem('needhub_removed_orders');
      if (stored) removedIds = JSON.parse(stored);
      if (!removedIds.includes(orderId)) {
        removedIds.push(orderId);
        localStorage.setItem('needhub_removed_orders', JSON.stringify(removedIds));
      }
      setOrders(prev => prev.filter(o => o.id !== orderId));
      showToast('Order removed from your history', 'info');
    } catch (e) {
      console.error('Error removing order', e);
    } finally {
      setOrderToRemove(null);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Cancelled':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'Out for Delivery':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse';
      default:
        return 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter === 'active') {
      return o.status !== 'Delivered' && o.status !== 'Cancelled';
    }
    if (filter === 'completed') {
      return o.status === 'Delivered' || o.status === 'Cancelled';
    }
    return true;
  });

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">My Orders</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track real-time delivery status & order history
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          aria-label="Refresh orders"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl gap-1">
        {(['all', 'active', 'completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
              filter === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Order List */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading your orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-slate-700/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <Package className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No Orders Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
            {filter === 'active'
              ? 'You have no active orders in progress right now.'
              : 'Start ordering fresh groceries and essential services.'}
          </p>
          <button
            onClick={() => setActiveTab('home')}
            className="mt-4 py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filteredOrders.map(order => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, height: 0, overflow: 'hidden', padding: 0, margin: 0 }}
                onClick={() => setSelectedOrder(order)}
                className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group/card relative"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-xs">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <button
                      id={`remove-order-btn-${order.id}`}
                      type="button"
                      title="Remove order from history"
                      aria-label={`Remove order ${order.orderNumber} from history`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOrderToRemove(order);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Items Thumbnail Row */}
                <div className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-hidden">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 overflow-hidden border border-slate-200 dark:border-slate-600 shrink-0"
                      >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs font-bold border border-slate-200 dark:border-slate-600">
                        +{order.items.length - 3}
                      </div>
                    )}
                    {order.services && order.services.length > 0 && (
                      <span className="text-[10px] bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 px-2 py-1 rounded-md font-semibold">
                        +{order.services.length} Service
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Total Paid</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {deliverySettings.currencySymbol} {order.total}
                    </span>
                  </div>
                </div>

                {/* Address / Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="truncate max-w-[200px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{order.deliveryAddress}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOrderToRemove(order);
                      }}
                      className="text-[11px] font-semibold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 shrink-0">
                      Track <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Confirmation Dialog for Removing Order */}
      <AnimatePresence>
        {orderToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-100 dark:border-rose-900">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1.5">
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  Remove Order
                </h3>
                <p className="text-xs text-slate-700 dark:text-slate-200 font-semibold">
                  Remove this order from your order history?
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Order <span className="font-mono font-bold text-slate-700 dark:text-slate-300">#{orderToRemove.orderNumber}</span> will be removed from your personal history list.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  id="cancel-remove-order-btn"
                  onClick={() => setOrderToRemove(null)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="confirm-remove-order-btn"
                  onClick={() => handleConfirmRemoveOrder(orderToRemove.id)}
                  className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detailed Order Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={(updated) => {
            setSelectedOrder(updated);
            setOrders(prev => prev.map(o => (o.id === updated.id ? updated : o)));
          }}
          onRemoveFromHistory={(orderId) => {
            handleConfirmRemoveOrder(orderId);
          }}
        />
      )}
    </div>
  );
};

