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
      {/* Header with warm and welcoming tone */}
      <section className="bg-white/80 backdrop-blur-xs border-b border-neutral-200/80 py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-bold border border-[#D90816]/15">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pameran, Bazar & Temu Usaha Nusantara</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#171717] tracking-tight">
            Event & Kegiatan Djoeragan Nusantara
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
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
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
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
              className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 w-full bg-neutral-100 overflow-hidden">
                  <img
                    src={evt.image}
                    alt={evt.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-white text-xs font-bold">
                      {evt.category}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        evt.status === 'Berlangsung'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#D90816] text-white'
                      }`}
                    >
                      {evt.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-neutral-900 leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {evt.description}
                  </p>

                  <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#D90816]" />
                      <span>Tanggal: <strong>{evt.date}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#D90816]" />
                      <span>Waktu: <strong>{evt.time}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D90816]" />
                      <span>Lokasi: <strong>{evt.location}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#D90816]" />
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
