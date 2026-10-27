import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_ADMIN_ACTIVITIES,
  INITIAL_COMPLAINTS,
  INITIAL_EVENTS,
  INITIAL_MARKET_CHANNELS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_PROGRAMS,
  INITIAL_USERS,
  INITIAL_VERIFICATIONS,
} from '../data/mockData';
import { INITIAL_MEMBERS } from '../data/memberData';
import {
  AdminActivity,
  CartItem,
  Complaint,
  EventAgenda,
  MarketAccessChannel,
  Member,
  Order,
  OrderStatus,
  Product,
  Program,
  User,
  UserRole,
  VerificationRequest,
} from '../types';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  users: User[];

  // Members Directory
  members: Member[];
  addMember: (member: Omit<Member, 'id' | 'joinDate' | 'verificationStatus'>) => void;
  approveMember: (id: string, notes?: string) => void;
  rejectMember: (id: string, reason: string) => void;
  pendingMember: (id: string) => void;
  
  // Products & Moderation
  products: Product[];
  addProduct: (newProd: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  approveProduct: (id: string) => void;
  rejectProduct: (id: string, reason: string) => void;
  setProductPending: (id: string) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotalCount: number;
  cartSubtotal: number;

  // Orders
  orders: Order[];
  createOrder: (orderPayload: {
    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;
    sellerId: string;
    sellerName: string;
    items: { productId: string; productName: string; productImage: string; price: number; quantity: number }[];
    subtotal: number;
    shippingFee: number;
    discount: number;
    grandTotal: number;
    paymentMethod: 'QRIS' | 'VA_BCA' | 'VA_MANDIRI' | 'SPM_PEMKOT';
    courier: string;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Verifications & Seller Status
  verifications: VerificationRequest[];
  approveVerification: (id: string, notes?: string) => void;
  rejectVerification: (id: string, reason: string) => void;
  pendingVerification: (id: string) => void;
  setSellerVerificationStatus: (
    userIdOrSellerId: string,
    status: 'Waiting Verification' | 'Approved' | 'Rejected',
    reason?: string
  ) => void;
  submitVerification: (req: Omit<VerificationRequest, 'id' | 'submittedDate' | 'status'>) => void;

  // Programs & Events
  programs: Program[];
  addProgram: (program: Omit<Program, 'id' | 'registeredCount'>) => void;
  registerProgram: (programId: string) => boolean;
  events: EventAgenda[];
  addEvent: (event: Omit<EventAgenda, 'id'>) => void;
  marketChannels: MarketAccessChannel[];

  // Complaints & Activity
  complaints: Complaint[];
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  adminActivities: AdminActivity[];

  // Toast
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Reset
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'djoeragan_nusantara_';

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() =>
    loadFromStorage<User[]>('users', INITIAL_USERS)
  );
  const [currentUser, setCurrentUser] = useState<User>(() =>
    loadFromStorage<User>('current_user', INITIAL_USERS[0]) // default: Pembeli Ahmad Pratama
  );
  const [members, setMembers] = useState<Member[]>(() =>
    loadFromStorage<Member[]>('members', INITIAL_MEMBERS)
  );
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage<Product[]>('products', INITIAL_PRODUCTS)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadFromStorage<Order[]>('orders', INITIAL_ORDERS)
  );
  const [verifications, setVerifications] = useState<VerificationRequest[]>(() =>
    loadFromStorage<VerificationRequest[]>('verifications', INITIAL_VERIFICATIONS)
  );
  const [programs, setPrograms] = useState<Program[]>(() =>
    loadFromStorage<Program[]>('programs', INITIAL_PROGRAMS)
  );
  const [events, setEvents] = useState<EventAgenda[]>(() =>
    loadFromStorage<EventAgenda[]>('events', INITIAL_EVENTS)
  );
  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    loadFromStorage<Complaint[]>('complaints', INITIAL_COMPLAINTS)
  );
  const [adminActivities, setAdminActivities] = useState<AdminActivity[]>(() =>
    loadFromStorage<AdminActivity[]>('admin_activities', INITIAL_ADMIN_ACTIVITIES)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>('cart', [
      {
        productId: 'prod-1',
        quantity: 1,
        product: INITIAL_PRODUCTS[0],
      },
    ])
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    loadFromStorage<string[]>('wishlist', ['prod-1', 'prod-3'])
  );
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync to local storage
  useEffect(() => { saveToStorage('users', users); }, [users]);
  useEffect(() => { saveToStorage('current_user', currentUser); }, [currentUser]);
  useEffect(() => { saveToStorage('members', members); }, [members]);
  useEffect(() => { saveToStorage('products', products); }, [products]);
  useEffect(() => { saveToStorage('orders', orders); }, [orders]);
  useEffect(() => { saveToStorage('verifications', verifications); }, [verifications]);
  useEffect(() => { saveToStorage('programs', programs); }, [programs]);
  useEffect(() => { saveToStorage('events', events); }, [events]);
  useEffect(() => { saveToStorage('complaints', complaints); }, [complaints]);
  useEffect(() => { saveToStorage('admin_activities', adminActivities); }, [adminActivities]);
  useEffect(() => { saveToStorage('cart', cart); }, [cart]);
  useEffect(() => { saveToStorage('wishlist', wishlist); }, [wishlist]);

  // Toast System
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Role Switcher
  const switchRole = (role: UserRole) => {
    let target = users.find((u) => u.role === role) || INITIAL_USERS.find((u) => u.role === role);
    if (!target) {
      target = INITIAL_USERS[0];
    }
    setCurrentUser(target);
    showToast(`Beralih ke mode demo: ${target.name} (${role.toUpperCase()})`, 'info');
  };

  // Members Management
  const addMember = (newMember: Omit<Member, 'id' | 'joinDate' | 'verificationStatus'>) => {
    const created: Member = {
      ...newMember,
      id: 'mem-' + Date.now(),
      joinDate: new Date().toISOString().slice(0, 10),
      verificationStatus: 'menunggu', // Pendaftaran baru harus diverifikasi admin
    };
    setMembers((prev) => [created, ...prev]);
    showToast(`Pendaftaran anggota "${created.name}" terkirim! Menunggu verifikasi admin.`);
  };

  const approveMember = (id: string, notes?: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, verificationStatus: 'disetujui' } : m))
    );
    const targetMember = members.find((m) => m.id === id);
    if (targetMember) {
      // Sync user if exists
      setUsers((prev) =>
        prev.map((u) =>
          u.name === targetMember.name || (targetMember.businessName && u.storeName === targetMember.businessName)
            ? { ...u, isVerified: true, sellerVerificationStatus: 'Approved' }
            : u
        )
      );
      setCurrentUser((prev) =>
        prev.name === targetMember.name || (targetMember.businessName && prev.storeName === targetMember.businessName)
          ? { ...prev, isVerified: true, sellerVerificationStatus: 'Approved' }
          : prev
      );
      setAdminActivities((prev) => [
        {
          id: 'act-' + Date.now(),
          adminName: currentUser.name,
          action: 'Menyetujui Verifikasi Keanggotaan UMKM',
          target: targetMember.name,
          timestamp: new Date().toISOString(),
          type: 'verifikasi',
        },
        ...prev,
      ]);
    }
    showToast('Anggota UMKM berhasil disetujui & aktif di direktori!', 'success');
  };

  const rejectMember = (id: string, reason: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, verificationStatus: 'ditolak', rejectionReason: reason }
          : m
      )
    );
    const targetMember = members.find((m) => m.id === id);
    if (targetMember) {
      setUsers((prev) =>
        prev.map((u) =>
          u.name === targetMember.name || (targetMember.businessName && u.storeName === targetMember.businessName)
            ? { ...u, isVerified: false, sellerVerificationStatus: 'Rejected', rejectionReason: reason }
            : u
        )
      );
      setCurrentUser((prev) =>
        prev.name === targetMember.name || (targetMember.businessName && prev.storeName === targetMember.businessName)
          ? { ...prev, isVerified: false, sellerVerificationStatus: 'Rejected', rejectionReason: reason }
          : prev
      );
      setAdminActivities((prev) => [
        {
          id: 'act-' + Date.now(),
          adminName: currentUser.name,
          action: 'Menolak Verifikasi Keanggotaan UMKM (Perlu Revisi)',
          target: targetMember.name,
          timestamp: new Date().toISOString(),
          type: 'verifikasi',
        },
        ...prev,
      ]);
    }
    showToast('Pendaftaran anggota ditolak dengan catatan evaluasi.', 'info');
  };

  const pendingMember = (id: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, verificationStatus: 'menunggu' }
          : m
      )
    );
    const targetMember = members.find((m) => m.id === id);
    if (targetMember) {
      setUsers((prev) =>
        prev.map((u) =>
          u.name === targetMember.name || (targetMember.businessName && u.storeName === targetMember.businessName)
            ? { ...u, isVerified: false, sellerVerificationStatus: 'Waiting Verification' }
            : u
        )
      );
      setCurrentUser((prev) =>
        prev.name === targetMember.name || (targetMember.businessName && prev.storeName === targetMember.businessName)
          ? { ...prev, isVerified: false, sellerVerificationStatus: 'Waiting Verification' }
          : prev
      );
    }
    showToast('Status anggota dikembalikan ke Menunggu Verifikasi.', 'info');
  };

  // Product CRUD & Moderation
  const addProduct = (newProd: Omit<Product, 'id' | 'createdAt'>) => {
    const created: Product = {
      ...newProd,
      id: 'prod-' + Date.now(),
      status: 'ditinjau', // Pending - WAJIB ditinjau admin sebelum tampil di katalog publik
      verificationStatus: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [created, ...prev]);
    showToast(`Produk "${created.name}" berhasil diajukan! Status: Menunggu Moderasi (Pending).`);
  };

  const approveProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'aktif', verificationStatus: 'Approved' } : p))
    );
    const targetProduct = products.find((p) => p.id === id);
    if (targetProduct) {
      setAdminActivities((prev) => [
        {
          id: 'act-' + Date.now(),
          adminName: currentUser.name,
          action: 'Menyetujui Moderasi Produk (Approved)',
          target: targetProduct.name,
          timestamp: new Date().toISOString(),
          type: 'moderasi',
        },
        ...prev,
      ]);
    }
    showToast('Produk telah disetujui (Approved) dan kini tampil di katalog publik!', 'success');
  };

  const rejectProduct = (id: string, reason: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'ditolak', verificationStatus: 'Rejected', rejectionReason: reason } : p))
    );
    const targetProduct = products.find((p) => p.id === id);
    if (targetProduct) {
      setAdminActivities((prev) => [
        {
          id: 'act-' + Date.now(),
          adminName: currentUser.name,
          action: `Menolak Moderasi Produk (Rejected): ${reason}`,
          target: targetProduct.name,
          timestamp: new Date().toISOString(),
          type: 'moderasi',
        },
        ...prev,
      ]);
    }
    showToast('Produk ditolak (Rejected) dan disembunyikan dari katalog publik.', 'info');
  };

  const setProductPending = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'ditinjau', verificationStatus: 'Pending' } : p))
    );
    showToast('Status produk dikembalikan ke Menunggu Moderasi (Pending).', 'info');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Perubahan produk berhasil disimpan!');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produk telah dihapus dari katalog.', 'info');
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, quantity, product }];
    });
    showToast(`"${product.name}" ditambahkan ke keranjang.`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Item dihapus dari keranjang.', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Orders
  const createOrder = (orderPayload: {
    buyerName: string;
    buyerPhone: string;
    buyerAddress: string;
    sellerId: string;
    sellerName: string;
    items: { productId: string; productName: string; productImage: string; price: number; quantity: number }[];
    subtotal: number;
    shippingFee: number;
    discount: number;
    grandTotal: number;
    paymentMethod: 'QRIS' | 'VA_BCA' | 'VA_MANDIRI' | 'SPM_PEMKOT';
    courier: string;
    notes?: string;
  }): Order => {
    const orderNum = `SKT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: orderNum,
      buyerId: currentUser.id,
      buyerName: orderPayload.buyerName,
      buyerPhone: orderPayload.buyerPhone,
      buyerAddress: orderPayload.buyerAddress,
      sellerId: orderPayload.sellerId,
      sellerName: orderPayload.sellerName,
      items: orderPayload.items,
      subtotal: orderPayload.subtotal,
      shippingFee: orderPayload.shippingFee,
      discount: orderPayload.discount,
      grandTotal: orderPayload.grandTotal,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: 'sudah_bayar', // Simulasi pembayaran QRIS langsung berhasil
      orderStatus: 'diproses',
      courier: orderPayload.courier,
      trackingNumber: `RES-${orderPayload.courier.slice(0, 2).toUpperCase()}-${Math.floor(10000000 + Math.random() * 90000000)}`,
      trackingHistory: [
        {
          time: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date()),
          status: 'Pembayaran Simulasi Berhasil via ' + orderPayload.paymentMethod,
          location: 'Gateway QRIS Bank Indonesia',
        },
        {
          time: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date()),
          status: 'Pesanan Diteruskan ke Penjual',
          location: orderPayload.sellerName,
        },
      ],
      notes: orderPayload.notes,
      createdAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Kurangi stok produk secara otomatis
    setProducts((prev) =>
      prev.map((p) => {
        const itemOrdered = orderPayload.items.find((item) => item.productId === p.id);
        if (itemOrdered) {
          const newStock = Math.max(0, p.stock - itemOrdered.quantity);
          return {
            ...p,
            stock: newStock,
            soldCount: p.soldCount + itemOrdered.quantity,
          };
        }
        return p;
      })
    );

    clearCart();
    showToast(`Pesanan #${orderNum} berhasil dibuat!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const nowStr = new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }).format(new Date());

          let newHistoryStep = '';
          if (status === 'diproses') newHistoryStep = 'Pesanan dikonfirmasi dan sedang dikemas oleh toko';
          else if (status === 'dikirim') newHistoryStep = `Paket telah diserahkan ke ${ord.courier} (Resi: ${ord.trackingNumber})`;
          else if (status === 'selesai') newHistoryStep = 'Paket telah diterima dengan baik oleh pembeli';
          else if (status === 'dibatalkan') newHistoryStep = 'Pesanan dibatalkan';

          return {
            ...ord,
            orderStatus: status,
            trackingHistory: [
              ...ord.trackingHistory,
              {
                time: nowStr,
                status: newHistoryStep,
                location: 'Sentra Hub Surakarta',
              },
            ],
          };
        }
        return ord;
      })
    );
    showToast(`Status pesanan diperbarui menjadi "${status}".`);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Dihapus dari wishlist.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Ditambahkan ke wishlist!');
        return [...prev, productId];
      }
    });
  };

  // Verifications & Seller Status
  const approveVerification = (id: string, notes?: string) => {
    const verifiedReq = verifications.find((v) => v.id === id);
    setVerifications((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'disetujui',
            adminNotes: notes || 'Disetujui. Dokumen NIB & legalitas sah sesuai standar Djoeragan Nusantara.',
            reviewedAt: new Date().toISOString(),
          };
        }
        return v;
      })
    );

    if (verifiedReq) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === verifiedReq.sellerId || (verifiedReq.storeName && u.storeName === verifiedReq.storeName)) {
            return {
              ...u,
              isVerified: true,
              sellerVerificationStatus: 'Approved',
            };
          }
          return u;
        })
      );

      setCurrentUser((prev) => {
        if (prev.id === verifiedReq.sellerId || (verifiedReq.storeName && prev.storeName === verifiedReq.storeName)) {
          return {
            ...prev,
            isVerified: true,
            sellerVerificationStatus: 'Approved',
          };
        }
        return prev;
      });

      setMembers((prev) =>
        prev.map((m) =>
          m.name === verifiedReq.ownerName || (verifiedReq.storeName && m.businessName === verifiedReq.storeName)
            ? { ...m, verificationStatus: 'disetujui' }
            : m
        )
      );

      setAdminActivities((prev) => [
        {
          id: 'act-' + Date.now(),
          adminName: currentUser.name,
          action: 'Menyetujui Verifikasi Legalitas & Akun Penjual (Approved)',
          target: verifiedReq.storeName,
          timestamp: new Date().toISOString(),
          type: 'verifikasi',
        },
        ...prev,
      ]);
    }

    showToast('Pengajuan Seller UMKM berhasil disetujui (Approved) & Dashboard Penjual aktif!');
  };

  const rejectVerification = (id: string, reason: string) => {
    const targetReq = verifications.find((v) => v.id === id);
    setVerifications((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: 'ditolak',
            adminNotes: reason,
            reviewedAt: new Date().toISOString(),
          };
        }
        return v;
      })
    );

    if (targetReq) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === targetReq.sellerId || (targetReq.storeName && u.storeName === targetReq.storeName)) {
            return {
              ...u,
              isVerified: false,
              sellerVerificationStatus: 'Rejected',
              rejectionReason: reason,
            };
          }
          return u;
        })
      );

      setCurrentUser((prev) => {
        if (prev.id === targetReq.sellerId || (targetReq.storeName && prev.storeName === targetReq.storeName)) {
          return {
            ...prev,
            isVerified: false,
            sellerVerificationStatus: 'Rejected',
            rejectionReason: reason,
          };
        }
        return prev;
      });

      setMembers((prev) =>
        prev.map((m) =>
          m.name === targetReq.ownerName || (targetReq.storeName && m.businessName === targetReq.storeName)
            ? { ...m, verificationStatus: 'ditolak', rejectionReason: reason }
            : m
        )
      );

      setAdminActivities((prev) => [
        {
          id: 'act-' + Date.now(),
          adminName: currentUser.name,
          action: 'Menolak Pengajuan Verifikasi Seller (Rejected)',
          target: targetReq.storeName,
          timestamp: new Date().toISOString(),
          type: 'verifikasi',
        },
        ...prev,
      ]);
    }

    showToast('Pengajuan Seller ditolak (Rejected) dengan catatan evaluasi.', 'info');
  };

  const pendingVerification = (id: string) => {
    const targetReq = verifications.find((v) => v.id === id);
    setVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: 'menunggu', adminNotes: 'Menunggu peninjauan kurator admin' } : v))
    );
    if (targetReq) {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === targetReq.sellerId || (targetReq.storeName && u.storeName === targetReq.storeName)) {
            return {
              ...u,
              isVerified: false,
              sellerVerificationStatus: 'Waiting Verification',
            };
          }
          return u;
        })
      );
      setCurrentUser((prev) => {
        if (prev.id === targetReq.sellerId || (targetReq.storeName && prev.storeName === targetReq.storeName)) {
          return {
            ...prev,
            isVerified: false,
            sellerVerificationStatus: 'Waiting Verification',
          };
        }
        return prev;
      });
      setMembers((prev) =>
        prev.map((m) =>
          m.name === targetReq.ownerName || (targetReq.storeName && m.businessName === targetReq.storeName)
            ? { ...m, verificationStatus: 'menunggu' }
            : m
        )
      );
    }
    showToast('Status seller dikembalikan ke Waiting Verification.', 'info');
  };

  const setSellerVerificationStatus = (
    userIdOrSellerId: string,
    status: 'Waiting Verification' | 'Approved' | 'Rejected',
    reason?: string
  ) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userIdOrSellerId || u.storeName === userIdOrSellerId) {
          return {
            ...u,
            isVerified: status === 'Approved',
            sellerVerificationStatus: status,
            rejectionReason: status === 'Rejected' ? reason : undefined,
          };
        }
        return u;
      })
    );
    setCurrentUser((prev) => {
      if (prev.id === userIdOrSellerId || prev.storeName === userIdOrSellerId) {
        return {
          ...prev,
          isVerified: status === 'Approved',
          sellerVerificationStatus: status,
          rejectionReason: status === 'Rejected' ? reason : undefined,
        };
      }
      return prev;
    });
    setVerifications((prev) =>
      prev.map((v) => {
        if (v.sellerId === userIdOrSellerId || v.storeName === userIdOrSellerId) {
          return {
            ...v,
            status: status === 'Approved' ? 'disetujui' : status === 'Rejected' ? 'ditolak' : 'menunggu',
            adminNotes: status === 'Rejected' ? reason : undefined,
          };
        }
        return v;
      })
    );
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === userIdOrSellerId || m.businessName === userIdOrSellerId || m.name === userIdOrSellerId) {
          return {
            ...m,
            verificationStatus: status === 'Approved' ? 'disetujui' : status === 'Rejected' ? 'ditolak' : 'menunggu',
            rejectionReason: status === 'Rejected' ? reason : undefined,
          };
        }
        return m;
      })
    );
    showToast(`Status verifikasi seller diubah menjadi "${status}".`);
  };

  const submitVerification = (req: Omit<VerificationRequest, 'id' | 'submittedDate' | 'status'>) => {
    const newReq: VerificationRequest = {
      ...req,
      id: 'verif-' + Date.now(),
      submittedDate: new Date().toISOString(),
      status: 'menunggu',
    };
    setVerifications((prev) => [newReq, ...prev]);
    showToast('Dokumen verifikasi NIB berhasil dikirim ke Admin Diskop UKM!');
  };

  // Programs
  // Programs & Events CRUD
  const addProgram = (newProg: Omit<Program, 'id' | 'registeredCount'>) => {
    const created: Program = {
      ...newProg,
      id: 'prog-' + Date.now(),
      registeredCount: 0,
    };
    setPrograms((prev) => [created, ...prev]);
    showToast(`Program pelatihan "${created.title}" berhasil dipublikasikan!`, 'success');
  };

  const addEvent = (newEvent: Omit<EventAgenda, 'id'>) => {
    const created: EventAgenda = {
      ...newEvent,
      id: 'event-' + Date.now(),
    };
    setEvents((prev) => [created, ...prev]);
    showToast(`Agenda "${created.title}" berhasil ditambahkan ke jadwal!`, 'success');
  };

  const registerProgram = (programId: string): boolean => {
    let success = false;
    setPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id === programId && prog.registeredCount < prog.quota) {
          success = true;
          return {
            ...prog,
            registeredCount: prog.registeredCount + 1,
            status: prog.registeredCount + 1 >= prog.quota ? 'penuh' : 'buka',
          };
        }
        return prog;
      })
    );
    if (success) {
      showToast('Berhasil mendaftar program pelatihan!', 'success');
    } else {
      showToast('Kuota program ini sudah penuh.', 'error');
    }
    return success;
  };

  // Complaints
  const updateComplaintStatus = (id: string, status: Complaint['status']) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    showToast(`Status tiket pengaduan diperbarui ke: ${status}`);
  };

  // Reset demo data
  const resetToDefaultData = () => {
    localStorage.clear();
    setMembers(INITIAL_MEMBERS);
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setVerifications(INITIAL_VERIFICATIONS);
    setPrograms(INITIAL_PROGRAMS);
    setEvents(INITIAL_EVENTS);
    setComplaints(INITIAL_COMPLAINTS);
    setAdminActivities(INITIAL_ADMIN_ACTIVITIES);
    setCart([
      {
        productId: 'prod-1',
        quantity: 1,
        product: INITIAL_PRODUCTS[0],
      },
    ]);
    setWishlist(['prod-1', 'prod-3']);
    setCurrentUser(INITIAL_USERS[0]);
    showToast('Data demo berhasil direset ke kondisi awal.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        users,
        members,
        addMember,
        approveMember,
        rejectMember,
        pendingMember,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        approveProduct,
        rejectProduct,
        setProductPending,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotalCount,
        cartSubtotal,
        orders,
        createOrder,
        updateOrderStatus,
        wishlist,
        toggleWishlist,
        verifications,
        approveVerification,
        rejectVerification,
        pendingVerification,
        setSellerVerificationStatus,
        submitVerification,
        programs,
        addProgram,
        registerProgram,
        events,
        addEvent,
        marketChannels: INITIAL_MARKET_CHANNELS,
        complaints,
        updateComplaintStatus,
        adminActivities,
        toasts,
        showToast,
        removeToast,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
