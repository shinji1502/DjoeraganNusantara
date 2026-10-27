import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, FileText, Heart, Award, ArrowUpRight } from 'lucide-react';

export const FooterPublic: React.FC = () => {
  return (
    <footer className="bg-[#171717] text-white border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D90816] to-[#A00610] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#D90816]/30">
                DN
              </div>
              <div>
                <h3 className="font-extrabold text-xl text-white tracking-tight">Djoeragan Nusantara</h3>
                <p className="text-xs text-[#ff4d5a] font-semibold uppercase tracking-wider">Wadah Kolaborasi & Pertumbuhan UMKM</p>
              </div>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Platform pemberdayaan dan akselerasi wirausaha nusantara. Menghubungkan pelaku UMKM dengan program sertifikasi resmi, pelatihan kecakapan usaha, pasar B2B antarbisnis, dan kemitraan pemerintah B2G.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/80 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Standar Verifikasi NIB & Halal
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/80 text-xs font-medium">
                35 Wilayah Kab/Kota Jateng
              </span>
            </div>
          </div>

          {/* Navigasi Layanan */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-neutral-300 mb-4">Layanan Utama</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link to="/anggota" className="hover:text-white transition">Direktori Anggota UMKM</Link></li>
              <li><Link to="/katalog" className="hover:text-white transition">Katalog Produk Kurasi</Link></li>
              <li><Link to="/pelatihan" className="hover:text-white transition">Pelatihan & Pendampingan</Link></li>
              <li><Link to="/event" className="hover:text-white transition">Event & Pameran Usaha</Link></li>
              <li><Link to="/sertifikasi-usaha" className="hover:text-white transition">Sertifikasi & Legalitas NIB</Link></li>
              <li><Link to="/akses-bertumbuh" className="hover:text-white transition">Akses Bertumbuh (B2B & B2G)</Link></li>
            </ul>
          </div>

          {/* Program & Komersial */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-neutral-300 mb-4">Program & Ekosistem</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li><Link to="/akses-bertumbuh#keuangan" className="hover:text-white transition">Akses Modal & Investasi</Link></li>
              <li><Link to="/akses-bertumbuh#b2b" className="hover:text-white transition">Kerja Sama Antarbisnis (B2B)</Link></li>
              <li><Link to="/akses-bertumbuh#b2g" className="hover:text-white transition">Pengadaan Pemerintah (B2G)</Link></li>
              <li><Link to="/akses-bertumbuh#ruang-komersial" className="hover:text-white transition">Ruang Komersial Berbayar</Link></li>
              <li><Link to="/informasi" className="hover:text-white transition">Informasi & Berita UMKM</Link></li>
            </ul>
          </div>

          {/* Kontak & Pusat Layanan */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase text-neutral-300 mb-4">Sekretariat & Hub</h4>
            <div className="space-y-3 text-sm text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D90816] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  Sentra Kolaborasi Djoeragan Nusantara, Jawa Tengah, Indonesia
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D90816] shrink-0" />
                <span className="text-xs">Layanan Bantuan: (0271) 714-8899</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D90816] shrink-0" />
                <span className="text-xs">halo@djoeragan-nusantara.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>
            © 2026 <strong>Djoeragan Nusantara</strong>. Wadah Kolaborasi, Penguatan, dan Pertumbuhan UMKM Nusantara.
          </p>

          <div className="flex items-center gap-4 text-neutral-400">
            <span className="inline-flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#D90816]" />
              Terverifikasi & Tepercaya
            </span>
            <span>•</span>
            <span className="text-neutral-500">Ekosistem UMKM Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
