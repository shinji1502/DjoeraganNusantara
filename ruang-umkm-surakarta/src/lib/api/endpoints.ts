import { request } from './client';
import type {
  Address, AddressInput, AppNotification, Category, ComplaintItem, CreateOrderInput, EventItem, Order, Paginated,
  Product, Program, ProgramRegistration, RegisterInput, Review, SellerProfile, User,
} from './types';

interface One<T> { data: T }
interface AuthResult { message: string; data: { user: User; token: string } }

export interface ProductQuery {
  q?: string; category?: string; seller?: string;
  min_price?: number; max_price?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name';
  page?: number; per_page?: number;
}

export const api = {
  auth: {
    register: (input: RegisterInput) => request<AuthResult>('/auth/register', { method: 'POST', body: input }),
    login: (email: string, password: string) =>
      request<AuthResult>('/auth/login', { method: 'POST', body: { email, password } }),
    logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
    me: () => request<One<User>>('/auth/me'),
    updateProfile: (input: { name: string; phone?: string | null }) =>
      request<One<User>>('/auth/profile', { method: 'PUT', body: input }),
    changePassword: (input: { current_password: string; password: string; password_confirmation: string }) =>
      request<{ message: string }>('/auth/password', { method: 'PUT', body: input }),
  },

  catalog: {
    categories: () => request<{ data: Category[] }>('/categories'),
    products: (query: ProductQuery = {}, signal?: AbortSignal) =>
      request<Paginated<Product>>('/products', { query: { ...query }, signal }),
    product: (slug: string) => request<One<Product>>(`/products/${encodeURIComponent(slug)}`),
    reviews: (slug: string, page = 1) =>
      request<Paginated<Review>>(`/products/${encodeURIComponent(slug)}/reviews`, { query: { page } }),
  },

  programs: {
    list: (page = 1) => request<Paginated<Program>>('/programs', { query: { page } }),
    detail: (slug: string) => request<One<Program>>(`/programs/${encodeURIComponent(slug)}`),
    register: (id: number) =>
      request<{ message: string; data: { registration_number: string; status: string } }>(`/programs/${id}/register`, { method: 'POST' }),
    mine: () => request<{ data: ProgramRegistration[] }>('/program-registrations'),
    cancel: (id: number) => request<{ message: string }>(`/program-registrations/${id}/cancel`, { method: 'POST' }),
  },

  addresses: {
    list: () => request<{ data: Address[] }>('/addresses'),
    create: (input: AddressInput) => request<One<Address>>('/addresses', { method: 'POST', body: input }),
    update: (id: number, input: AddressInput) => request<One<Address>>(`/addresses/${id}`, { method: 'PUT', body: input }),
    remove: (id: number) => request<{ message: string }>(`/addresses/${id}`, { method: 'DELETE' }),
  },

  orders: {
    list: (page = 1) => request<Paginated<Order>>('/orders', { query: { page } }),
    create: (input: CreateOrderInput) => request<One<Order>>('/orders', { method: 'POST', body: input }),
    get: (orderNumber: string) => request<One<Order>>(`/orders/${encodeURIComponent(orderNumber)}`),
    cancel: (orderNumber: string) => request<One<Order>>(`/orders/${encodeURIComponent(orderNumber)}/cancel`, { method: 'POST' }),
    received: (orderNumber: string, sellerOrderId: number) =>
      request<One<Order>>(`/orders/${encodeURIComponent(orderNumber)}/seller-orders/${sellerOrderId}/received`, { method: 'POST' }),
  },

  reviews: {
    create: (input: { order_item_id: number; rating: number; comment?: string }) =>
      request<One<Review>>('/reviews', { method: 'POST', body: input }),
  },

  notifications: {
    list: (page = 1) =>
      request<{ data: AppNotification[]; meta: { current_page: number; last_page: number; total: number; unread_count: number } }>(
        '/notifications', { query: { page } }),
    markRead: (id: string) => request<{ message: string }>(`/notifications/${id}/read`, { method: 'POST' }),
    markAllRead: () => request<{ message: string }>('/notifications/read-all', { method: 'POST' }),
  },

  seller: {
    profile: () => request<One<SellerProfile>>('/seller/profile'),
    uploadImage: (type: 'logo' | 'banner', file: File) => {
      const form = new FormData();
      form.append('image', file);
      return request<One<SellerProfile>>(`/seller/profile/${type}`, { method: 'POST', body: form });
    },
    products: (query: { q?: string; status?: string; page?: number } = {}) =>
      request<Paginated<Product>>('/seller/products', { query: { ...query } }),
    createProduct: (input: Partial<Product> & { name: string; description: string; price: number; stock: number }) =>
      request<One<Product>>('/seller/products', { method: 'POST', body: input }),
    updateProduct: (id: number, input: Record<string, unknown>) =>
      request<One<Product>>(`/seller/products/${id}`, { method: 'PUT', body: input }),
    deleteProduct: (id: number) => request<{ message: string }>(`/seller/products/${id}`, { method: 'DELETE' }),
    uploadProductImages: (id: number, files: File[]) => {
      const form = new FormData();
      files.forEach((f) => form.append('images[]', f));
      return request<One<Product>>(`/seller/products/${id}/images`, { method: 'POST', body: form });
    },
    updateOrderStatus: (
      id: number,
      input: { status: 'confirmed' | 'processing' | 'shipped'; courier?: string; service?: string; tracking_number?: string },
    ) => request<unknown>(`/seller/orders/${id}/status`, { method: 'PATCH', body: input }),
  },

  events: {
    list: (query: { category?: string; status?: string; q?: string; page?: number } = {}) =>
      request<Paginated<EventItem>>('/events', { query: { ...query } }),
    detail: (slug: string) => request<One<EventItem>>(`/events/${encodeURIComponent(slug)}`),
  },

  complaints: {
    submit: (input: { complainant_name: string; user_role?: string; subject: string; message: string; priority?: 'rendah' | 'sedang' | 'tinggi' }) =>
      request<One<ComplaintItem>>('/complaints', { method: 'POST', body: input }),
  },

  admin: {
    complaints: (query: { status?: string; priority?: string; page?: number } = {}) =>
      request<Paginated<ComplaintItem>>('/admin/complaints', { query: { ...query } }),
    updateComplaintStatus: (id: number, input: { status: string; resolution_notes?: string }) =>
      request<One<ComplaintItem>>(`/admin/complaints/${id}/status`, { method: 'PATCH', body: input }),
    events: (query: { status?: string; category?: string; page?: number } = {}) =>
      request<Paginated<EventItem>>('/admin/events', { query: { ...query } }),
    createEvent: (input: Record<string, unknown>) =>
      request<One<EventItem>>('/admin/events', { method: 'POST', body: input }),
    updateEvent: (id: number, input: Record<string, unknown>) =>
      request<One<EventItem>>(`/admin/events/${id}`, { method: 'PUT', body: input }),
    deleteEvent: (id: number) => request<{ message: string }>(`/admin/events/${id}`, { method: 'DELETE' }),
  },
};