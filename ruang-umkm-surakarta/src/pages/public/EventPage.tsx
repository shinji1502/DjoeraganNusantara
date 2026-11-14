import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EventPage: React.FC = () => {
  const { events } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Bazzar', 'Pameran', 'Business Matching', 'Temu Usaha'];

  const filteredEvents = events.filter(
    (ev) => selectedCategory === 'Semua' || ev.category === selectedCategory
  );

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 bg-theme-akses-bertumbuh min-h-screen">
      {/* Editorial Header — Seragam dengan Akses Bertumbuh (Master Reference) */}
      <section className="akses-hero overflow-hidden py-10 sm:py-14">
        {/* Background photo pengrajin batik — object-fit: cover dengan object-position terkalibrasi */}
        <img
          src="/images/solo_umkm_artisan.jpg"
          alt="Event & Kegiatan Djoeragan Nusantara"
          className="akses-hero-img"
        />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-3.5 relative z-10 w-full">
          <h1
            style={{ textShadow: '0 1px 14px rgba(255, 255, 255, 0.95), 0 0 2px rgba(255, 255, 255, 0.8)' }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#292525]"
          >
            Event & Kegiatan <span className="text-[#B51E26]">Djoeragan Nusantara</span>
          </h1>
          <p
            style={{ textShadow: '0 1px 12px rgba(255, 255, 255, 0.9)' }}
            className="text-sm sm:text-base text-[#2B2118] font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Yuk ramaikan berbagai kegiatan seru! Mulai dari festival kuliner nusantara, expo produk kreatif, bazar CFD mingguan, hingga temu bisnis eksklusif untuk memperluas koneksi usaha Anda.
          </p>

          {/* Filter categories — Konsisten dengan button styling Akses Bertumbuh */}
          <div className="flex justify-center flex-wrap gap-2.5 pt-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-[#1C1917] text-[#FAF7F2] shadow-md border border-[#C5A059]'
                    : 'bg-white border border-[#D6CEC2] text-[#44403C] hover:bg-[#FAF7F2]'
                }`}
              >
                {c === 'Semua' ? 'Semua Event' : c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="card-heritage bg-white rounded-3xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 w-full bg-stone-100 overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#1C1917]/85 backdrop-blur-md text-stone-200 text-xs font-bold border border-stone-700/50">
                      {evt.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${
                        evt.status === 'Berlangsung'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-gradient-to-r from-[#B81D24] to-[#98141A] text-white'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-[#1C1917] leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Tanggal: <strong className="text-[#1C1917]">{evt.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Waktu: <strong className="text-[#1C1917]">{evt.time}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Lokasi: <strong className="text-[#1C1917]">{evt.location}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Penyelenggara: {evt.organizer}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
