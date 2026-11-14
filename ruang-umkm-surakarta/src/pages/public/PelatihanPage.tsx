import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PelatihanPage: React.FC = () => {
  const { programs, registerProgram } = useApp();
  const [filterType, setFilterType] = useState<string>('Semua');

  const types = ['Semua', 'Akademi', 'Workshop', 'Sertifikasi', 'Mentoring'];

  const filteredPrograms = programs.filter(
    (p) => filterType === 'Semua' || p.type === filterType
  );

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 bg-theme-akses-bertumbuh min-h-screen">
      {/* Editorial Header — Seragam dengan Akses Bertumbuh (Master Reference) */}
      <section className="akses-hero overflow-hidden py-10 sm:py-14">
        {/* Background photo pengrajin batik — object-fit: cover dengan object-position terkalibrasi */}
        <img
          src="/images/solo_umkm_artisan.jpg"
          alt="Pelatihan Anggota Djoeragan Nusantara"
          className="akses-hero-img"
        />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-3.5 relative z-10 w-full">
          <h1
            style={{ textShadow: '0 1px 14px rgba(255, 255, 255, 0.95), 0 0 2px rgba(255, 255, 255, 0.8)' }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#292525]"
          >
            Pelatihan Anggota <span className="text-[#B51E26]">Djoeragan Nusantara</span>
          </h1>
          <p
            style={{ textShadow: '0 1px 12px rgba(255, 255, 255, 0.9)' }}
            className="text-sm sm:text-base text-[#2B2118] font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Belajar bareng praktisi usaha dengan bahasa yang santai dan mudah dipahami. Dari cara bikin foto produk pakai HP, urus izin halal, manajemen pembukuan, hingga trik jualan tembus ekspor dan belanja pemerintah.
          </p>

          {/* Filter pills — Konsisten dengan button styling Akses Bertumbuh */}
          <div className="flex justify-center flex-wrap gap-2.5 pt-3">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  filterType === t
                    ? 'bg-[#1C1917] text-[#FAF7F2] shadow-md border border-[#C5A059]'
                    : 'bg-white border border-[#D6CEC2] text-[#44403C] hover:bg-[#FAF7F2]'
                }`}
              >
                {t === 'Semua' ? 'Semua Pelatihan' : t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Program Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredPrograms.map((prog) => {
            const isFull = prog.registeredCount >= prog.quota;
            return (
              <div
                key={prog.id}
                className="card-heritage bg-white rounded-3xl overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#1C1917]/85 backdrop-blur-md text-stone-200 text-xs font-bold border border-stone-700/50">
                        {prog.type}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#B81D24] to-[#98141A] text-white text-xs font-bold shadow-2xs">
                        Tingkat: {prog.level}
                      </span>
                    </div>

                    {isFull && (
                      <div className="absolute inset-0 bg-[#1C1917]/70 flex items-center justify-center">
                        <span className="px-4 py-1.5 bg-rose-700 text-white rounded-full font-bold text-xs uppercase tracking-wider">
                          Kuota Penuh
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-7 space-y-4">
                    <h3 className="text-lg font-bold text-[#1C1917] leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="space-y-2 pt-3 text-xs text-stone-600 border-t border-stone-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Waktu: <strong className="text-[#1C1917]">{prog.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Lokasi: <strong className="text-[#1C1917]">{prog.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#C5A059]" />
                        <span>Pemateri: <strong className="text-[#1C1917]">{prog.instructor}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration footer */}
                <div className="p-6 sm:p-7 pt-0 flex items-center justify-between border-t border-stone-100 mt-2">
                  <div className="text-xs">
                    <span className="text-stone-500">Pendaftar: </span>
                    <strong className="text-[#1C1917] font-extrabold">
                      {prog.registeredCount} / {prog.quota} Peserta
                    </strong>
                  </div>

                  <button
                    onClick={() => registerProgram(prog.id)}
                    disabled={isFull}
                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B81D24] to-[#98141A] text-white text-xs font-bold hover:from-[#98141A] hover:to-[#7A0D13] transition disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-[#B81D24]/20 cursor-pointer"
                  >
                    {isFull ? 'Kuota Penuh' : 'Daftar Kelas Gratis'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
