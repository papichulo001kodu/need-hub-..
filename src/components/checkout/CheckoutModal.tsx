import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Phone, User, Banknote, Smartphone, CheckCircle2, ArrowRight, Edit3, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    customer,
    updateCustomerProfile,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    deliverySettings,
    setCountdownOrderData,
    showToast
  } = useApp();

  const [name, setName] = useState(customer.name || '');
  const [phone, setPhone] = useState(customer.phone || '');
  const [address, setAddress] = useState(customer.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Online / Pay to Rider Online'>('Cash on Delivery');
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Sync with customer profile when checkout opens
  React.useEffect(() => {
    if (isCheckoutOpen) {
      setName(customer.name || '');
      setPhone(customer.phone || '');
      setAddress(customer.address || '');
    }
  }, [isCheckoutOpen, customer]);

  if (!isCheckoutOpen) return null;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      showToast('Please enter your phone number to receive delivery updates', 'error');
      return;
    }

    if (!address.trim()) {
      showToast('Please enter your complete delivery address', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    // Save profile updates
    updateCustomerProfile({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      hasSeenWelcome: true
    });

    // Package order data for the 3-second countdown cancellation safeguard
    const orderData = {
      customerName: name.trim() || 'Customer',
      customerPhone: phone.trim(),
      deliveryAddress: address.trim(),
      items: cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        unit: item.product.unit
      })),
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      paymentMethod
    };

    setIsCheckoutOpen(false);
    setCountdownOrderData(orderData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCheckoutOpen(false)}
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
            <h2 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Checkout</span>
            </h2>
            <button
              id="checkout-close-btn"
              onClick={() => setIsCheckoutOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form / Scroll Content */}
          <form onSubmit={handleConfirmOrder} className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Delivery Address & Contact Section */}
            <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  Delivery Details
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{isEditingAddress ? 'Done' : 'Edit'}</span>
                </button>
              </div>

              {isEditingAddress || !address || !phone ? (
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Recipient Name
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Enter recipient name"
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Enter contact phone number"
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Full Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="House/Apartment #, Building, Street, Area, City"
                      className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{name || 'Customer'}</span>
                    <span className="font-medium text-slate-500">{phone}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 line-clamp-2">{address}</p>
                </div>
              )}
            </div>

            {/* Products in this order */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Order Items ({cart.length})
                </h3>
                <span className="text-[11px] text-slate-500">Review or adjust before confirming</span>
              </div>
              
              {cart.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 mb-2">Your cart is empty.</p>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                  >
                    Back to Store
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {cart.map(item => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, overflow: 'hidden', padding: 0, margin: 0 }}
                        className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="truncate min-w-0">
                            <span className="font-semibold text-slate-900 dark:text-white block truncate">
                              {item.product.name}
                            </span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {item.product.unit} • {deliverySettings.currencySymbol} {item.product.price}
                            </span>
                          </div>
                        </div>

                        {/* Stepper + Total + Remove */}
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center bg-white dark:bg-slate-700 rounded-lg p-0.5 border border-slate-200 dark:border-slate-600">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                              title={item.quantity === 1 ? 'Remove from cart' : 'Decrease'}
                            >
                              {item.quantity === 1 ? <Trash2 className="w-2.5 h-2.5 text-rose-500" /> : <Minus className="w-2.5 h-2.5" />}
                            </button>
                            <span className="w-5 text-center text-[11px] font-bold text-slate-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700"
                              title="Increase"
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          <span className="font-bold text-slate-900 dark:text-white text-right min-w-[50px]">
                            {deliverySettings.currencySymbol} {item.product.price * item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="w-6 h-6 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Payment Method Selector (2 Options Only: COD & Online to Rider) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Payment Option
                </h3>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {paymentMethod === 'Cash on Delivery' ? 'Pay with Cash' : 'Pay via QR / App'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'Cash on Delivery' as const,
                    label: 'Cash on Delivery',
                    desc: 'Pay cash to rider upon delivery',
                    icon: Banknote,
                    tag: 'Most Popular'
                  },
                  {
                    id: 'Online / Pay to Rider Online' as const,
                    label: 'Online / Pay to Rider',
                    desc: 'EasyPaisa, JazzCash or Bank QR transfer',
                    icon: Smartphone,
                    tag: 'Digital'
                  }
                ].map(opt => {
                  const Icon = opt.icon;
                  const selected = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      id={`payment-opt-${opt.id.replace(/\s+/g, '-').toLowerCase()}`}
                      type="button"
                      onClick={() => setPaymentMethod(opt.id)}
                      className={`relative p-3 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        selected
                          ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/70 text-slate-900 dark:text-white ring-2 ring-emerald-600/30 dark:ring-emerald-500/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          selected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {selected ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {opt.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                          {opt.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {deliverySettings.currencySymbol} {cartSubtotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className={`font-semibold ${cartDeliveryFee === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                  {cartDeliveryFee === 0 ? 'FREE' : `${deliverySettings.currencySymbol} ${cartDeliveryFee}`}
                </span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-slate-900 dark:text-white text-sm">
                <span>Total Payable</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-base">
                  {deliverySettings.currencySymbol} {cartTotal}
                </span>
              </div>
            </div>

            {/* Confirm CTA */}
            <button
              id="checkout-confirm-order-btn"
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-between text-sm transition-all"
            >
              <span>Confirm Order</span>
              <div className="flex items-center gap-2">
                <span>{deliverySettings.currencySymbol} {cartTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
