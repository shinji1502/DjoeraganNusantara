const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export const formatRupiah = (value: number): string => rupiah.format(value);

export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date(iso));

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Menunggu', confirmed: 'Dikonfirmasi', processing: 'Diproses',
  shipped: 'Dikirim', completed: 'Selesai', cancelled: 'Dibatalkan',
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  unpaid: 'Belum dibayar', pending: 'Menunggu pembayaran', paid: 'Lunas',
  failed: 'Gagal', refunded: 'Dikembalikan', partially_refunded: 'Sebagian dikembalikan',
};