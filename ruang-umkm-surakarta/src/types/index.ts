export type UserRole = 'pembeli' | 'penjual' | 'admin' | 'tamu';

export type SellerVerificationStatus = 'Waiting Verification' | 'Approved' | 'Rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
  address?: string;
  storeName?: string;
  nib?: string;
  isVerified?: boolean;
  sellerVerificationStatus?: SellerVerificationStatus;
  rejectionReason?: string;
}

export type ProductCategory = 
  | 'Batik & Fashion' 
  | 'Kuliner Tradisional' 
  | 'Kerajinan Tangan' 
  | 'Herbal & Kebugaran' 
  | 'Pertanian & Olahan' 
  | 'Jasa Kreatif';

export type ProductVerificationStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Product {
  id: string;
  name: string;
  sellerId: string;
  sellerName: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stock: number;
  soldCount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  district: string; // Kecamatan di Surakarta: Laweyan, Pasar Kliwon, Jebres, Banjarsari, Serengan
  certifications: string[]; // e.g. ['Halal MUI', 'Batik Mark Solo', 'P-IRT', 'SNI']
  tags: string[];
  isCurated: boolean;
  status: 'aktif' | 'habis' | 'draft' | 'ditinjau' | 'ditolak' | 'pending' | 'approved' | 'rejected';
  verificationStatus?: ProductVerificationStatus;
  rejectionReason?: string;
  createdAt: string;
}

export type Gender = 'Laki-laki' | 'Perempuan';
export type AgeGroup = '17-23' | '24-35' | '36-45' | '46+';

export interface Member {
  id: string;
  name: string;
  gender: Gender;
  age: number;
  ageGroup: AgeGroup;
  cityDistrict: string; // 35 kabupaten / kota di Jawa Tengah
  city?: string;
  regencyType: 'Kota' | 'Kabupaten';
  hasBusiness: boolean;
  businessName?: string;
  businessType?: string; // 'Kuliner' | 'Batik & Fashion' | 'Kerajinan Tangan' | 'Pertanian & Olahan' | 'Jasa Kreatif' | 'Teknologi' | 'Lainnya';
  businessCategory?: string;
  businessScale?: 'Mikro' | 'Kecil' | 'Menengah';
  avatar: string;
  phone: string;
  email: string;
  joinDate: string;
  registrationDate?: string;
  verificationStatus: 'menunggu' | 'disetujui' | 'ditolak';
  rejectionReason?: string;
  bio?: string;
  documents?: {
    ktp?: boolean;
    nib?: boolean;
    qris?: boolean;
    fotoUsaha?: boolean;
    suratPernyataan?: boolean;
  };
}

export interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export type PaymentMethod = 'QRIS' | 'VA_BCA' | 'VA_MANDIRI' | 'SPM_PEMKOT';
export type PaymentStatus = 'menunggu_pembayaran' | 'sudah_bayar' | 'dibatalkan';
export type OrderStatus = 'menunggu_konfirmasi' | 'diproses' | 'dikirim' | 'selesai' | 'dibatalkan';

export interface TrackingStep {
  time: string;
  status: string;
  location: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  courier: string;
  trackingNumber?: string;
  trackingHistory: TrackingStep[];
  notes?: string;
  createdAt: string;
}

export interface VerificationChecklist {
  ktpChecked: boolean;
  nibChecked: boolean;
  qrisChecked: boolean;
  fotoUsahaChecked: boolean;
  suratPernyataanChecked: boolean;
}

export interface VerificationRequest {
  id: string;
  sellerId: string;
  storeName: string;
  ownerName: string;
  nik: string;
  nib: string;
  address: string;
  district: string;
  cityDistrict?: string;
  category: ProductCategory;
  businessScale: 'Mikro' | 'Kecil' | 'Menengah';
  annualRevenue: number;
  submittedDate: string;
  status: 'menunggu' | 'disetujui' | 'ditolak' | SellerVerificationStatus;
  checklist?: VerificationChecklist;
  documents: {
    ktp: string;
    nibDoc: string;
    productPhoto: string;
    qrisDoc?: string;
    suratPernyataan?: string;
  };
  adminNotes?: string;
  reviewedAt?: string;
}

export interface Program {
  id: string;
  title: string;
  type: 'Akademi' | 'Mentoring' | 'Workshop' | 'Sertifikasi';
  date: string;
  location: string;
  instructor: string;
  quota: number;
  registeredCount: number;
  status: 'buka' | 'penuh' | 'selesai';
  image: string;
  description: string;
  level: 'Dasar' | 'Menengah' | 'Lanjutan';
}

export interface EventAgenda {
  id: string;
  title: string;
  category: 'Bazzar' | 'Pameran' | 'Business Matching' | 'Temu Usaha';
  date: string;
  time: string;
  location: string;
  organizer: string;
  status: 'Mendatang' | 'Berlangsung' | 'Selesai';
  image: string;
  description: string;
}

export interface MarketAccessChannel {
  id: string;
  title: string;
  description: string;
  channelType: string;
  locationOrPlatform: string;
  participantCount: number;
  image: string;
  highlightTag: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  complainantName: string;
  userRole: UserRole;
  subject: string;
  message: string;
  priority: 'rendah' | 'sedang' | 'tinggi';
  status: 'baru' | 'dalam_penanganan' | 'selesai';
  slaHoursLeft: number;
  createdAt: string;
}

export interface AdminActivity {
  id: string;
  adminName: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'verifikasi' | 'moderasi' | 'pengguna' | 'sistem';
}
