import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    deliverySettings,
    setIsCheckoutOpen
  } = useApp();

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = deliverySettings.freeDeliveryThreshold;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Cart Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-base text-slate-900 dark:text-white">Your Cart</h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  id="cart-clear-btn"
                  onClick={clearCart}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                id="cart-close-btn"
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-slate-800 flex items-center justify-center text-emerald-500 mb-4">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your cart is empty</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px]">
                Explore fresh groceries, snacks, beverages and book doorstep home services.
              </p>
              <button
                id="cart-start-shopping-btn"
                onClick={() => setIsCartOpen(false)}
                className="mt-5 py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Free delivery prompt */}
              {!deliverySettings.isFreeDeliveryEnabled && (
                <div className="bg-emerald-50/70 dark:bg-emerald-950/40 px-5 py-3 border-b border-emerald-100 dark:border-emerald-900/40">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-200 mb-1.5">
                    <span>
                      {remainingForFree === 0
                        ? '🎉 You unlocked FREE Delivery!'
                        : `Add ${deliverySettings.currencySymbol} ${remainingForFree} more for FREE Delivery`}
                    </span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3.5 divide-y divide-slate-100 dark:divide-slate-800">
                <AnimatePresence initial={false}>
                  {cart.map(item => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden', marginBottom: 0, paddingTop: 0 }}
                      transition={{ duration: 0.2 }}
                      className="pt-3.5 first:pt-0 flex items-center justify-between gap-3"
                    >
                      {/* Image */}
                      <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.product.unit}
                          </span>
                          <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                            • {deliverySettings.currencySymbol} {item.product.price}
                          </span>
                        </div>
                        <div className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                          Total: {deliverySettings.currencySymbol} {item.product.price * item.quantity}
                        </div>
                      </div>

                      {/* Stepper / Remove Button */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                          <button
                            id={`cart-item-decrease-${item.product.id}`}
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            title={item.quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
                            aria-label={item.quantity === 1 ? 'Remove from cart' : 'Decrease quantity'}
                          >
                            {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-500" /> : <Minus className="w-3 h-3" />}
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            id={`cart-item-increase-${item.product.id}`}
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors"
                            title="Increase quantity"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Dedicated Clear / Remove button */}
                        <button
                          id={`cart-item-remove-${item.product.id}`}
                          onClick={() => removeFromCart(item.product.id)}
                          className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800 transition-all flex items-center justify-center group"
                          title="Remove item from cart"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Bill Details & Footer Proceed */}
              <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Bill Summary
                </h4>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {deliverySettings.currencySymbol} {cartSubtotal}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Delivery Fee</span>
                    <span className={`font-semibold ${cartDeliveryFee === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                      {cartDeliveryFee === 0 ? 'FREE' : `${deliverySettings.currencySymbol} ${cartDeliveryFee}`}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                    <span>Grand Total</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-base">
                      {deliverySettings.currencySymbol} {cartTotal}
                    </span>
                  </div>
                </div>

                <button
                  id="cart-proceed-checkout-btn"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-between text-sm transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-700/80 px-2 py-0.5 rounded-lg text-xs font-extrabold">
                      {deliverySettings.currencySymbol} {cartTotal}
                    </span>
                    <span>Proceed to Checkout</span>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
