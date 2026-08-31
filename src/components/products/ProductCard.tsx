import React, { useState } from 'react';
import { Plus, Minus, Trash2, Check, ImageOff } from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

interface ProductCardProps {
  product: Product;
  horizontalMode?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, horizontalMode = false }) => {
  const { cart, addToCart, updateCartQuantity, setSelectedProduct, deliverySettings } = useApp();
  const [imgError, setImgError] = useState(false);

  const cartItem = cart.find(item => item.product.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  const fallbackImage = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';

  return (
    <div
      id={`product-card-${product.id}`}
      className={`group relative bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
        horizontalMode ? 'w-[165px] shrink-0' : 'w-full'
      }`}
      onClick={() => setSelectedProduct(product)}
    >
      {/* Top Image Container with aspect ratio protection */}
      <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-700/50 overflow-hidden flex items-center justify-center">
        {!imgError ? (
          <img
            src={product.image || fallbackImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-3 text-slate-400">
            <ImageOff className="w-8 h-8 mb-1" />
            <span className="text-[10px]">Need Hub</span>
          </div>
        )}

        {/* Discount Badge */}
        {product.discountPercent && product.discountPercent > 0 ? (
          <div className="absolute top-2 left-2 bg-emerald-600 text-white font-black text-[10px] uppercase px-1.5 py-0.5 rounded-md shadow-sm">
            {product.discountPercent}% OFF
          </div>
        ) : null}

        {/* Out of Stock Pill */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-1 rounded-md">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block truncate">
            {product.unit}
          </span>
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-tight line-clamp-2 mt-0.5 min-h-[32px]">
            {product.name}
          </h3>
        </div>

        {/* Pricing and Cart Stepper */}
        <div className="mt-3 flex items-center justify-between gap-1">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {deliverySettings.currencySymbol} {product.price}
              </span>
              {product.oldPrice && product.oldPrice > product.price && (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through">
                  {deliverySettings.currencySymbol} {product.oldPrice}
                </span>
              )}
            </div>
          </div>

          {/* Stepper / Add button */}
          <div onClick={e => e.stopPropagation()}>
            {qty > 0 ? (
              <div className="flex items-center bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-700 rounded-lg p-0.5 shadow-sm">
                <button
                  id={`product-decrease-${product.id}`}
                  onClick={() => updateCartQuantity(product.id, qty - 1)}
                  className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 flex items-center justify-center hover:bg-emerald-100 transition-colors"
                  title={qty === 1 ? 'Remove from cart' : 'Decrease quantity'}
                  aria-label={qty === 1 ? 'Remove from cart' : 'Decrease quantity'}
                >
                  {qty === 1 ? <Trash2 className="w-3 h-3 text-rose-500" /> : <Minus className="w-3 h-3" />}
                </button>
                <span className="px-2 text-xs font-bold text-emerald-800 dark:text-emerald-200">
                  {qty}
                </span>
                <button
                  id={`product-increase-${product.id}`}
                  onClick={() => updateCartQuantity(product.id, qty + 1)}
                  className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors"
                  title="Increase quantity"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                id={`product-add-btn-${product.id}`}
                disabled={!product.inStock}
                onClick={() => addToCart(product, 1)}
                className={`flex items-center justify-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  product.inStock
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white active:scale-95'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
