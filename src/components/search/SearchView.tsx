import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, X, ShoppingBag, Wrench, Grid, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Product, Category, Service } from '../../types';
import { ProductCard } from '../products/ProductCard';
import { useApp } from '../../context/AppContext';
import { BookServiceModal } from '../services/BookServiceModal';

export const SearchView: React.FC = () => {
  const { setActiveTab, setSelectedProduct, deliverySettings } = useApp();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'products' | 'services' | 'categories'>('all');
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedBookingService, setSelectedBookingService] = useState<Service | null>(null);

  // Trending search suggestions
  const trendingTags = ['Milk', 'Chips', 'Bread', 'AC Service', 'Coffee', 'Chocolates', 'Plumber', 'Cleaning'];

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setCategories([]);
      setServices([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.searchAll(query.trim());
        setProducts(res.products);
        setCategories(res.categories);
        setServices(res.services);
      } catch (e) {
        console.error('Search error', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const totalResults = products.length + services.length + categories.length;

  return (
    <div className="max-w-md mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Search Input Bar */}
      <div className="relative">
        <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id="global-search-input"
          type="text"
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search products, categories, services..."
          className="w-full pl-10 pr-10 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Trending Tags */}
      {!query && (
        <div className="space-y-3 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Popular Searches
          </span>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs when query exists */}
      {query && (
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
          {[
            { id: 'all', label: `All (${totalResults})` },
            { id: 'products', label: `Products (${products.length})` },
            { id: 'services', label: `Services (${services.length})` },
            { id: 'categories', label: `Categories (${categories.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                activeFilter === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Results Container */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Searching Need Hub catalog...</p>
        </div>
      ) : query && totalResults === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            No results found for "{query}"
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try searching for milk, bread, chips, cleaning, or plumbing.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Categories Results */}
          {(activeFilter === 'all' || activeFilter === 'categories') && categories.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5" />
                <span>Categories</span>
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => setActiveTab('home')}
                    className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center cursor-pointer hover:border-emerald-500 transition-colors shadow-sm"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-10 h-10 rounded-xl object-cover mx-auto mb-1.5"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {cat.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Results */}
          {(activeFilter === 'all' || activeFilter === 'products') && products.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Products ({products.length})</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {products.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          )}

          {/* Services Results */}
          {(activeFilter === 'all' || activeFilter === 'services') && services.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>Home Services ({services.length})</span>
              </h3>
              <div className="space-y-2.5">
                {services.map(srv => (
                  <div
                    key={srv.id}
                    className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-sm"
                  >
                    <img
                      src={srv.image}
                      alt={srv.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {srv.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{srv.description}</p>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {deliverySettings.currencySymbol} {srv.startingPrice}
                      </span>
                    </div>
                    <button
                      onClick={() => setSelectedBookingService(srv)}
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shrink-0"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedBookingService && (
        <BookServiceModal
          service={selectedBookingService}
          onClose={() => setSelectedBookingService(null)}
        />
      )}
    </div>
  );
};
