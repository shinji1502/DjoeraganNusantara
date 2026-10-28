import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  MapPin,
  User,
  CheckCircle2,
  Sparkles,
  Clock,
  Award,
  Video,
  Users,
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
    <div className="space-y-12 pb-20 bg-theme-akademi min-h-screen">
      {/* Header with friendly tone, square grid, & faint artisan watermark */}
      <section className="relative overflow-hidden bg-transparent border-b border-[#E7E2D9] bg-heritage-artisan-watermark py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F9F4EB] text-[#8C5835] text-xs font-bold border border-[#C5A059]/30 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Pusat Pelatihan & Bimbingan Wirausaha</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight">
            Pelatihan Anggota <span className="text-[#B81D24]">Djoeragan Nusantara</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Belajar bareng praktisi usaha dengan bahasa yang santai dan mudah dipahami. Dari cara bikin foto produk pakai HP, urus izin halal, manajemen pembukuan, hingga trik jualan tembus ekspor dan belanja pemerintah.
          </p>

          {/* Filter pills */}
          <div className="flex justify-center flex-wrap gap-2 pt-3">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  filterType === t
                    ? 'bg-[#1C1917] text-white shadow-2xs border border-[#1C1917]'
                    : 'bg-[#FAF7F2] border border-stone-200/80 text-stone-700 hover:bg-[#F5EFEB]'
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
