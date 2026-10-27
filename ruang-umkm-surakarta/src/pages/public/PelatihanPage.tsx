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
      {/* Header with friendly tone */}
      <section className="bg-white/80 backdrop-blur-xs border-b border-neutral-200/80 py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-bold border border-[#D90816]/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pusat Pelatihan & Bimbingan Wirausaha</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
            Pelatihan Anggota Djoeragan Nusantara
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
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
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
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
                className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/9 w-full bg-neutral-100 overflow-hidden">
                    <img
                      src={prog.image}
                      alt={prog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold">
                        {prog.type}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#D90816] text-white text-xs font-bold">
                        Tingkat: {prog.level}
                      </span>
                    </div>

                    {isFull && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="px-4 py-1.5 bg-rose-600 text-white rounded-full font-bold text-xs uppercase tracking-wider">
                          Kuota Penuh
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-7 space-y-4">
                    <h3 className="text-lg font-bold text-neutral-900 leading-snug">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {prog.description}
                    </p>

                    <div className="space-y-2 pt-3 text-xs text-neutral-500 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-[#D90816]" />
                        <span>Waktu: <strong>{prog.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-[#D90816]" />
                        <span>Lokasi: <strong>{prog.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-[#D90816]" />
                        <span>Pemateri: <strong>{prog.instructor}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration footer */}
                <div className="p-6 sm:p-7 pt-0 flex items-center justify-between border-t border-neutral-100 mt-2">
                  <div className="text-xs">
                    <span className="text-neutral-500">Pendaftar: </span>
                    <strong className="text-neutral-900 font-extrabold">
                      {prog.registeredCount} / {prog.quota} Peserta
                    </strong>
                  </div>

                  <button
                    onClick={() => registerProgram(prog.id)}
                    disabled={isFull}
                    className="px-5 py-2.5 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition disabled:opacity-40 disabled:pointer-events-none shadow-md shadow-[#D90816]/20 cursor-pointer"
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
