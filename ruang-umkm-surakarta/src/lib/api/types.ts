export type Role = 'admin' | 'penjual' | 'pembeli';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface SellerProfile {
  id: number;
  business_name: string;
  slug: string;
  owner_name: string;
  nib?: string | null;
  business_scale?: string | null;
  description: string | null;
  address: string;
  district: string | null;
  city: string;
  province: string;
  bank_name?: string | null;
  bank_account_number?: string | null;
  bank_account_holder?: string | null;
  logo: string | null;
  banner: string | null;
  verification_status: 'pending' | 'approved' | 'rejected' | 'revision_required';
  verified_at?: string | null;
  rejection_reason?: string | null;
  category?: Category;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: Role;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  last_login_at: string | null;
  seller_profile?: SellerProfile;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  sku: string | null;
  price: number;
  original_price?: number | null;
  stock: number;
  weight: number | null;
  unit: string | null;
  certifications?: string[];
  district?: string | null;
  status?: 'draft' | 'pending' | 'published' | 'rejected' | 'archived';
  is_featured: boolean;
  published_at: string | null;
  rating_avg: number | null;
  reviews_count?: number;
  category?: Category;
  seller?: SellerProfile;
  images?: ProductImage[];
}

export interface EventItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  event_date: string;
  end_date: string | null;
  time: string | null;
  location: string;
  organizer: string;
  status: 'Mendatang' | 'Berlangsung' | 'Selesai';
  image: string | null;
  description: string;
  quota: number | null;
  created_at: string;
}

export interface ComplaintItem {
  id: number;
  ticket_number: string;
  complainant_name: string;
  user_role: string;
  subject: string;
  message: string;
  priority: 'rendah' | 'sedang' | 'tinggi';
  status: 'baru' | 'dalam_penanganan' | 'selesai';
  sla_hours_left: number;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string | null;
  buyer: string;
  created_at: string;
}

export interface PageMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

export interface Address {
  id: number;
  recipient_name: string;
  phone: string;
  address_line: string;
  village: string | null;
  district: string | null;
  city: string;
  province: string;
  postal_code: string | null;
  notes: string | null;
  is_default: boolean;
}

export type AddressInput = Omit<Address, 'id' | 'is_default'> & { is_default?: boolean };

export interface Shipment {
  courier: string;
  service: string | null;
  tracking_number: string | null;
  status: string;
  shipped_at: string | null;
  delivered_at: string | null;
}

export interface OrderItem {
  id: number;
  seller_order_id: number;
  product_id: number | null;
  name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  has_review: boolean | null;
}

export interface SellerOrderSummary {
  id: number;
  seller: string | null;
  status: string;
  subtotal: number;
  shipping_cost: number;
  shipment: Shipment | null;
}

export interface PaymentInfo {
  reference: string;
  method: string;
  status: string;
  amount: number;
  paid_at: string | null;
  expired_at: string | null;
}

export interface Order {
  order_number: string;
  order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  payment_status: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  shipping_address: Omit<Address, 'id' | 'is_default'>;
  buyer_notes: string | null;
  ordered_at: string;
  seller_orders?: SellerOrderSummary[];
  items?: OrderItem[];
  payment?: PaymentInfo | null;
}

export type PaymentMethod = 'transfer_bank' | 'ewallet' | 'cod';

export interface CreateOrderInput {
  address_id: number;
  payment_method: PaymentMethod;
  buyer_notes?: string;
  items: { product_id: number; quantity: number }[];
}

export interface Program {
  id: number;
  title: string;
  slug: string;
  description: string;
  organizer: string;
  location: string | null;
  start_date: string;
  end_date: string;
  registration_start: string | null;
  registration_end: string | null;
  quota: number | null;
  registered_count?: number;
  cover_image: string | null;
  status: string;
}

export interface ProgramRegistration {
  id: number;
  registration_number: string;
  status: string;
  notes: string | null;
  registered_at: string;
  program: { title: string; slug: string; location: string | null; start_date: string; end_date: string } | null;
}

export interface AppNotification {
  id: string;
  type: string | null;
  title: string;
  message: string;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  role: 'pembeli' | 'penjual';
  business_name?: string;
  address?: string;
  business_category_id?: number;
}