import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '../api/types';

/**
 * Keranjang disimpan di sisi klien. Harga di sini HANYA untuk tampilan:
 * backend selalu menghitung ulang harga, ongkir, dan total saat checkout.
 */
export interface CartLine {
  product_id: number;
  slug: string;
  name: string;
  price: number;
  stock: number;
  quantity: number;
  image: string | null;
  seller: string | null;
}

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (product: Product, quantity?: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

const KEY = 'umkm_cart';
const CartContext = createContext<CartState | null>(null);

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as CartLine[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* abaikan */ }
  }, [lines]);

  const add = useCallback((product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.product_id === product.id);
      const max = Math.max(1, product.stock);
      if (existing) {
        return prev.map((l) =>
          l.product_id === product.id ? { ...l, stock: product.stock, quantity: Math.min(l.quantity + quantity, max) } : l);
      }
      const primary = product.images?.find((i) => i.is_primary) ?? product.images?.[0];
      return [...prev, {
        product_id: product.id, slug: product.slug, name: product.name, price: product.price,
        stock: product.stock, quantity: Math.min(quantity, max),
        image: primary?.url ?? null, seller: product.seller?.business_name ?? null,
      }];
    });
  }, []);

  const setQuantity = useCallback((productId: number, quantity: number) => {
    setLines((prev) => prev.map((l) =>
      l.product_id === productId ? { ...l, quantity: Math.max(1, Math.min(Math.floor(quantity) || 1, l.stock, 100)) } : l));
  }, []);

  const remove = useCallback((productId: number) => setLines((prev) => prev.filter((l) => l.product_id !== productId)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => ({
    lines,
    count: lines.reduce((n, l) => n + l.quantity, 0),
    subtotal: lines.reduce((n, l) => n + l.price * l.quantity, 0),
    add, setQuantity, remove, clear,
  }), [lines, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart harus dipakai di dalam <CartProvider>.');
  return ctx;
}