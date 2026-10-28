import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EventPage: React.FC = () => {
  const { events } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', 'Bazzar', 'Pameran', 'Business Matching', 'Temu Usaha'];

  const filteredEvents = events.filter(
    (ev) => selectedCategory === 'Semua' || ev.category === selectedCategory
  );

  return (
    <div className="space-y-12 pb-20 bg-theme-agenda min-h-screen">
      {/* Header with warm and welcoming tone, square grid, & faint artisan watermark */}
      <section className="relative overflow-hidden bg-transparent border-b border-[#E7E2D9] bg-heritage-artisan-watermark py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F9F4EB] text-[#8C5835] text-xs font-bold border border-[#C5A059]/30 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Pameran, Bazar & Temu Usaha Nusantara</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1C1917] tracking-tight">
            Event & Kegiatan <span className="text-[#B81D24]">Djoeragan Nusantara</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Yuk ramaikan berbagai kegiatan seru! Mulai dari festival kuliner nusantara, expo produk kreatif, bazar CFD mingguan, hingga temu bisnis eksklusif untuk memperluas koneksi usaha Anda.
          </p>

          {/* Filter categories */}
          <div className="flex justify-center flex-wrap gap-2 pt-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-[#1C1917] text-white shadow-2xs border border-[#1C1917]'
                    : 'bg-[#FAF7F2] border border-stone-200/80 text-stone-700 hover:bg-[#F5EFEB]'
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
