import { Category, Product, Service, Order, DeliverySettings, AdminUser, CustomerProfile } from '../types';

const API_BASE = '/api';

function getAdminToken(): string | null {
  try {
    return localStorage.getItem('needhub_admin_token') || sessionStorage.getItem('needhub_admin_token');
  } catch (e) {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const adminToken = getAdminToken();
  if (adminToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${adminToken}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Public / Customer API
  getConfig: () => request<{ appName: string; tagline: string; deliverySettings: DeliverySettings }>(`/config`),
  
  getCategories: (all = false) => request<Category[]>(`/categories${all ? '?all=true' : ''}`),
  
  getProducts: (params?: { categoryId?: string; search?: string; popular?: boolean; inStockOnly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.search) query.set('search', params.search);
    if (params?.popular) query.set('popular', 'true');
    if (params?.inStockOnly) query.set('inStockOnly', 'true');
    const qs = query.toString();
    return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  getProductById: (id: string) => request<Product>(`/products/${id}`),

  getServices: (params?: { category?: string; search?: string; availableOnly?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.availableOnly) query.set('availableOnly', 'true');
    const qs = query.toString();
    return request<Service[]>(`/services${qs ? `?${qs}` : ''}`);
  },

  getServiceById: (id: string) => request<Service>(`/services/${id}`),

  searchAll: (q: string) => request<{ categories: Category[]; products: Product[]; services: Service[] }>(`/search?q=${encodeURIComponent(q)}`),

  getOrders: (phone?: string) => request<Order[]>(`/orders${phone ? `?phone=${encodeURIComponent(phone)}` : ''}`),

  getOrderById: (id: string) => request<Order>(`/orders/${id}`),

  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    items?: { productId: string; quantity: number }[];
    services?: { serviceId: string; date: string; timeSlot: string; notes?: string }[];
    paymentMethod: string;
  }) => request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),

  cancelOrder: (id: string, reason?: string) => request<Order>(`/orders/${id}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ reason })
  }),

  saveCustomerProfile: (profile: { name: string; phone: string; address: string; email?: string }) => 
    request<CustomerProfile>('/customer/save', {
      method: 'POST',
      body: JSON.stringify(profile)
    }),

  // Admin API
  adminLogin: (email: string, password: string) => 
    request<{ token: string; admin: AdminUser }>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  verifyAdminToken: () => request<{ valid: boolean; admin: AdminUser }>('/admin/verify'),

  changeAdminCredentials: (data: { newEmail?: string; newPassword?: string; currentPassword?: string }) =>
    request<{ message: string; token: string; admin: AdminUser }>('/admin/change-credentials', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  getAdminStats: () => request<{
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalServices: number;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    recentOrders: Order[];
  }>('/admin/stats'),

  createCategory: (data: Partial<Category>) => request<Category>('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateCategory: (id: string, data: Partial<Category>) => request<Category>(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteCategory: (id: string) => request<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
    method: 'DELETE'
  }),

  createProduct: (data: Partial<Product>) => request<Product>('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateProduct: (id: string, data: Partial<Product>) => request<Product>(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteProduct: (id: string) => request<{ success: boolean; message: string }>(`/admin/products/${id}`, {
    method: 'DELETE'
  }),

  createService: (data: Partial<Service>) => request<Service>('/admin/services', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  updateService: (id: string, data: Partial<Service>) => request<Service>(`/admin/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  deleteService: (id: string) => request<{ success: boolean; message: string }>(`/admin/services/${id}`, {
    method: 'DELETE'
  }),

  getAdminOrders: (params?: { status?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return request<Order[]>(`/admin/orders${qs ? `?${qs}` : ''}`);
  },

  updateOrderStatus: (id: string, status: string, note?: string) => 
    request<Order>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note })
    }),

  updateDeliverySettings: (data: Partial<DeliverySettings>) =>
    request<DeliverySettings>('/admin/delivery-settings', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
};
