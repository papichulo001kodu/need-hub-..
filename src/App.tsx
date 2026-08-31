/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Toast } from './components/common/Toast';
import { HomeView } from './components/home/HomeView';
import { ServicesView } from './components/services/ServicesView';
import { SearchView } from './components/search/SearchView';
import { OrdersView } from './components/orders/OrdersView';
import { ProfileView } from './components/profile/ProfileView';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderCountdownModal } from './components/checkout/OrderCountdownModal';
import { EditAddressModal } from './components/profile/EditAddressModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { FirstTimeAddressPrompt } from './components/common/FirstTimeAddressPrompt';

const MainApp: React.FC = () => {
  const { customer, activeTab, isAdminPortalOpen } = useApp();

  // If Admin Portal is active, show Admin Console
  if (isAdminPortalOpen) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
        <AdminPortal />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500 selection:text-white flex flex-col">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'services' && <ServicesView />}
        {activeTab === 'search' && <SearchView />}
        {activeTab === 'orders' && <OrdersView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Persistent Bottom Mobile Navigation */}
      <BottomNav />

      {/* First-time visitor address setup prompt */}
      <FirstTimeAddressPrompt />

      {/* Overlays, Modals, & Safeguard Countdown Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderCountdownModal />
      <EditAddressModal />
      <SettingsModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
