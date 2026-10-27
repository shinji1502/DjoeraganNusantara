import { useState } from 'react';
import { api } from './lib/api/endpoints';
import { ApiError } from './lib/api/client';
import { useAuth } from './lib/auth/AuthContext';
import { useCart } from './lib/cart/CartContext';
import { useAsync } from './lib/hooks/useAsync';
import { formatRupiah } from './lib/format';

export default function ApiSmokeTest() {
  const { user, loading, login, logout } = useAuth();
  const cart = useCart();
  const [email, setEmail] = useState('pembeli1@ruangumkm.test');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const categories = useAsync((s) => api.catalog.categories().then((r) => r.data), []);
  const products = useAsync((s) => api.catalog.products({ q, per_page: 6 }, s), [q]);

  async function onLogin() {
    setMessage(null);
    try {
      const u = await login(email, password);
      setMessage(`Masuk sebagai ${u.name} (${u.role})`);
    } catch (e) {
      setMessage(e instanceof ApiError ? e.friendlyMessage : 'Gagal masuk.');
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Uji sambungan API</h2>

      <h3>Akun</h3>
      {loading ? <p>Memeriksa sesi…</p> : user ? (
        <p>Masuk sebagai <b>{user.name}</b> ({user.role}){' '}
          <button onClick={() => void logout()}>Keluar</button></p>
      ) : (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Kata sandi" />
          <button onClick={() => void onLogin()}>Masuk</button>
        </div>
      )}
      {message && <p>{message}</p>}

      <h3>Kategori</h3>
      {categories.error ? <p style={{ color: 'crimson' }}>{categories.error}</p> :
        <p>{categories.loading ? 'Memuat…' : categories.data?.map((c) => c.name).join(', ')}</p>}

      <h3>Produk</h3>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari produk…" />
      {products.error && <p style={{ color: 'crimson' }}>{products.error}</p>}
      {products.loading ? <p>Memuat…</p> : (
        <ul>
          {products.data?.data.map((p) => (
            <li key={p.id}>
              {p.name} — {formatRupiah(p.price)} (stok {p.stock}){' '}
              <button onClick={() => cart.add(p)}>+ Keranjang</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Keranjang ({cart.count})</h3>
      <ul>
        {cart.lines.map((l) => (
          <li key={l.product_id}>{l.name} × {l.quantity} = {formatRupiah(l.price * l.quantity)}{' '}
            <button onClick={() => cart.remove(l.product_id)}>hapus</button></li>
        ))}
      </ul>
      <p>Subtotal tampilan: {formatRupiah(cart.subtotal)} (total resmi dihitung backend saat checkout)</p>
    </div>
  );
}