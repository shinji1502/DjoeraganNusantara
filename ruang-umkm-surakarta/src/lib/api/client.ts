const BASE = (
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://127.0.0.1:8000/api/v1'
).replace(/\/$/, '');

const TOKEN_KEY = 'umkm_token';

/**
 * Token disimpan di localStorage agar mudah untuk tahap pengembangan.
 * Risikonya: token bisa dicuri bila ada celah XSS. Untuk production, pertimbangkan
 * mode cookie Sanctum (SPA) dan selalu hindari dangerouslySetInnerHTML pada data pengguna.
 */
export const tokenStore = {
  get(): string | null {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set(token: string): void {
    try { localStorage.setItem(TOKEN_KEY, token); } catch { /* storage tidak tersedia */ }
  },
  clear(): void {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* storage tidak tersedia */ }
  },
};

export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(status: number, message: string, errors: Record<string, string[]> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }

  /** Pesan kesalahan pertama yang paling informatif untuk ditampilkan ke pengguna. */
  get friendlyMessage(): string {
    const first = Object.values(this.errors)[0]?.[0];
    return first ?? this.message;
  }
}

type QueryValue = string | number | boolean | null | undefined;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: Record<string, QueryValue>;
  body?: unknown;
  signal?: AbortSignal;
}

let unauthorizedHandler: (() => void) | null = null;
export function setUnauthorizedHandler(fn: (() => void) | null): void {
  unauthorizedHandler = fn;
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const url = new URL(BASE + path);
  for (const [key, value] of Object.entries(opts.query ?? {})) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let body: BodyInit | undefined;
  if (opts.body instanceof FormData) {
    body = opts.body; // jangan set Content-Type: browser mengisi boundary multipart
  } else if (opts.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(opts.body);
  }

  let res: Response;
  try {
    res = await fetch(url, { method: opts.method ?? 'GET', headers, body, signal: opts.signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e;
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Pastikan backend berjalan.');
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && token) {
      tokenStore.clear();
      unauthorizedHandler?.();
    }
    throw new ApiError(res.status, data.message ?? 'Terjadi kesalahan.', data.errors ?? {});
  }

  return data as T;
}