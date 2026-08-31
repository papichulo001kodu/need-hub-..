import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, Trash2, Truck, ShieldCheck, Zap, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    deliverySettings,
    setIsCartOpen
  } = useApp();

  const [modalQty, setModalQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!selectedProduct) return null;

  const cartItem = cart.find(item => item.product.id === selectedProduct.id);
  const currentCartQty = cartItem ? cartItem.quantity : 0;

  const deliveryFeeDisplay =
    deliverySettings.isFreeDeliveryEnabled || deliverySettings.standardFee === 0
      ? 'FREE'
      : `${deliverySettings.currencySymbol} ${deliverySettings.standardFee}`;

  const handleAddToCart = () => {
    addToCart(selectedProduct, modalQty);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProduct(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          {/* Close Button */}
          <button
            id="close-product-detail-btn"
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-900/50 hover:bg-slate-900/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Large Aspect-Safe Image Header */}
          <div className="relative w-full aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
            {!imgError ? (
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="text-slate-400 font-medium">Need Hub Premium Grocery</div>
            )}

            {/* Discount Badge */}
            {selectedProduct.discountPercent && selectedProduct.discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-2.5 py-1 rounded-lg shadow-md">
                {selectedProduct.discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Modal Body */}
          <div className="p-5 space-y-4">
            {/* Title & Unit */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {selectedProduct.unit}
                </span>
                {selectedProduct.rating && (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{selectedProduct.rating}</span>
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
                {selectedProduct.name}
              </h2>
            </div>

            {/* Price & Old Price */}
            <div className="flex items-baseline gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                {deliverySettings.currencySymbol} {selectedProduct.price}
              </span>
              {selectedProduct.oldPrice && selectedProduct.oldPrice > selectedProduct.price && (
                <span className="text-sm text-slate-400 dark:text-slate-500 line-through">
                  {deliverySettings.currencySymbol} {selectedProduct.oldPrice}
                </span>
              )}
              {selectedProduct.discountPercent && selectedProduct.discountPercent > 0 && (
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  Save {deliverySettings.currencySymbol} {(selectedProduct.oldPrice || 0) - selectedProduct.price}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                Product Details
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Delivery Charge & Assurance Info */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl space-y-2 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Delivery Charge:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {deliveryFeeDisplay}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Speed:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {deliverySettings.estimatedMinutes} Delivery
                </span>
              </div>
            </div>

            {/* Stock status */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Availability:</span>
              <span
                className={`font-semibold ${
                  selectedProduct.inStock
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-rose-500'
                }`}
              >
                {selectedProduct.inStock ? `In Stock (${selectedProduct.stockCount} left)` : 'Currently Unavailable'}
              </span>
            </div>

            {/* Actions: Quantity Stepper & Add to Cart */}
            <div className="pt-2 flex items-center gap-2">
              {currentCartQty > 0 ? (
                <>
                  <div className="flex-1 flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 p-1.5 rounded-2xl">
                    <button
                      onClick={() => updateCartQuantity(selectedProduct.id, currentCartQty - 1)}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shadow-sm hover:bg-emerald-100 transition-colors"
                      title={currentCartQty === 1 ? 'Remove from cart' : 'Decrease'}
                    >
                      {currentCartQty === 1 ? <Trash2 className="w-4 h-4 text-rose-500" /> : <Minus className="w-4 h-4" />}
                    </button>
                    <div className="text-center px-2">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold block">
                        In Your Cart
                      </span>
                      <span className="text-sm font-black text-emerald-900 dark:text-emerald-100">
                        {currentCartQty} {selectedProduct.unit}
                      </span>
                    </div>
                    <button
                      onClick={() => updateCartQuantity(selectedProduct.id, currentCartQty + 1)}
                      className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md hover:bg-emerald-700 transition-colors"
                      title="Increase"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(selectedProduct.id)}
                    className="p-3 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 rounded-2xl transition-colors flex items-center justify-center"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  {/* Local Stepper */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl p-1 bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => setModalQty(Math.max(1, modalQty - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-slate-800 dark:text-slate-200">
                      {modalQty}
                    </span>
                    <button
                      onClick={() => setModalQty(modalQty + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add To Cart CTA */}
                  <button
                    id="product-detail-add-cart-btn"
                    disabled={!selectedProduct.inStock}
                    onClick={handleAddToCart}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] disabled:bg-slate-300 disabled:dark:bg-slate-800 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart ({deliverySettings.currencySymbol} {selectedProduct.price * modalQty})</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
