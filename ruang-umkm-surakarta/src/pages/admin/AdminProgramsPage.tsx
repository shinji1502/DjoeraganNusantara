import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Calendar,
  Plus,
  Users,
  MapPin,
  Sparkles,
  ArrowLeft,
  Check,
  Upload,
  Image as ImageIcon,
  Clock,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Program, EventAgenda } from '../../types';

export const AdminProgramsPage: React.FC = () => {
  const { programs, events, addProgram, addEvent, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'program' | 'agenda'>('program');
  const [isCreating, setIsCreating] = useState(false);
  const [createType, setCreateType] = useState<'program' | 'agenda'>('program');

  // Program Form States
  const [progTitle, setProgTitle] = useState('');
  const [progType, setProgType] = useState<Program['type']>('Workshop');
  const [progLevel, setProgLevel] = useState<Program['level']>('Dasar');
  const [progDate, setProgDate] = useState('');
  const [progLocation, setProgLocation] = useState('Solo Technopark, Jebres');
  const [progInstructor, setProgInstructor] = useState('Dinas Koperasi & UKM Kota Surakarta');
  const [progQuota, setProgQuota] = useState('50');
  const [progImage, setProgImage] = useState(
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'
  );
  const [progDesc, setProgDesc] = useState('');
  const [progUploadedFileName, setProgUploadedFileName] = useState('');
  const progFileInputRef = useRef<HTMLInputElement>(null);

  // Agenda / Event Form States
  const [agendaTitle, setAgendaTitle] = useState('');
  const [agendaCategory, setAgendaCategory] = useState<EventAgenda['category']>('Bazzar');
  const [agendaDate, setAgendaDate] = useState('');
  const [agendaTime, setAgendaTime] = useState('08:00 - 15:00 WIB');
  const [agendaLocation, setAgendaLocation] = useState('Koridor Ngarsopuro, Surakarta');
  const [agendaOrganizer, setAgendaOrganizer] = useState('Diskop UKM Kota Surakarta');
  const [agendaStatus, setAgendaStatus] = useState<EventAgenda['status']>('Mendatang');
  const [agendaImage, setAgendaImage] = useState(
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
  );
  const [agendaDesc, setAgendaDesc] = useState('');

  // File upload for program banner
  const handleProgFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Harap pilih file gambar (JPG, PNG, WebP).', 'error');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast('Ukuran foto maksimal 3MB.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProgImage(reader.result);
        setProgUploadedFileName(file.name);
        showToast(`Banner foto "${file.name}" siap disimpan!`, 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setProgTitle('');
    setProgDate('');
    setProgDesc('');
    setProgQuota('50');
    setAgendaTitle('');
    setAgendaDate('');
    setAgendaDesc('');
    setProgUploadedFileName('');
  };

  const handleProgramSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progTitle.trim() || !progDate.trim() || !progLocation.trim() || !progInstructor.trim()) {
      showToast('Harap lengkapi semua bidang wajib program pelatihan.', 'error');
      return;
    }
    const quotaNum = parseInt(progQuota, 10);
    if (isNaN(quotaNum) || quotaNum <= 0) {
      showToast('Kuota peserta harus berupa angka positif.', 'error');
      return;
    }

    addProgram({
      title: progTitle.trim(),
      type: progType,
      level: progLevel,
      date: progDate.trim(),
      location: progLocation.trim(),
      instructor: progInstructor.trim(),
      quota: quotaNum,
      status: 'buka',
      image: progImage || 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
      description: progDesc.trim() || 'Program pembinaan wirausaha terpadu yang diselenggarakan oleh Pemkot Surakarta.',
    });

    resetForm();
    setIsCreating(false);
    setActiveTab('program');
  };

  const handleAgendaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaTitle.trim() || !agendaDate.trim() || !agendaLocation.trim() || !agendaOrganizer.trim()) {
      showToast('Harap lengkapi seluruh kolom agenda pameran.', 'error');
      return;
    }

    addEvent({
      title: agendaTitle.trim(),
      category: agendaCategory,
      date: agendaDate.trim(),
      time: agendaTime.trim(),
      location: agendaLocation.trim(),
      organizer: agendaOrganizer.trim(),
      status: agendaStatus,
      image: agendaImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      description: agendaDesc.trim() || 'Agenda pameran dan bazzar promosi produk UMKM Kota Solo.',
    });

    resetForm();
    setIsCreating(false);
    setActiveTab('agenda');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Manajemen Akademi & Agenda</h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Publikasikan workshop kewirausahaan, sertifikasi halal, dan event bazzar pameran UMKM Surakarta.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => {
              setIsCreating(true);
              setCreateType(activeTab);
            }}
            className="px-5 py-2.5 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition flex items-center gap-1.5 shadow-md shadow-[#D90816]/20 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Program / Agenda</span>
          </button>
        )}
      </div>

      {/* Mode Input Form */}
      {isCreating ? (
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-extrabold text-neutral-900">
                  Formulir Publikasi {createType === 'program' ? 'Program Pelatihan & Sertifikasi' : 'Agenda & Event Pameran'}
                </h2>
                <p className="text-xs text-neutral-500">
                  Data yang diinputkan akan langsung tersimpan dan tampil di listing publik dan portal pelaku usaha.
                </p>
              </div>
            </div>

            {/* Switch type */}
            <div className="flex items-center gap-1 bg-[#FAF8F7] p-1 rounded-xl border border-neutral-200">
              <button
                type="button"
                onClick={() => setCreateType('program')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  createType === 'program'
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Program Pelatihan
              </button>
              <button
                type="button"
                onClick={() => setCreateType('agenda')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  createType === 'agenda'
                    ? 'bg-[#171717] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Agenda & Event
              </button>
            </div>
          </div>

          {/* Form Content: Program */}
          {createType === 'program' ? (
            <form onSubmit={handleProgramSubmit} className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Judul Program / Pelatihan *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Pelatihan e-Katalog LKPP & Pengadaan Pemerintah (B2G)"
                      value={progTitle}
                      onChange={(e) => setProgTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Jenis Program *
                      </label>
                      <select
                        value={progType}
                        onChange={(e) => setProgType(e.target.value as Program['type'])}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      >
                        <option value="Workshop">Workshop</option>
                        <option value="Akademi">Akademi</option>
                        <option value="Mentoring">Mentoring</option>
                        <option value="Sertifikasi">Sertifikasi</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Tingkat Materi *
                      </label>
                      <select
                        value={progLevel}
                        onChange={(e) => setProgLevel(e.target.value as Program['level'])}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      >
                        <option value="Dasar">Dasar (Pemula UMKM)</option>
                        <option value="Menengah">Menengah (Scale-up)</option>
                        <option value="Lanjutan">Lanjutan (Ekspor & B2G)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Jadwal Pelaksanaan *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 15-18 November 2026"
                        value={progDate}
                        onChange={(e) => setProgDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Kuota Peserta (Orang) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        placeholder="50"
                        value={progQuota}
                        onChange={(e) => setProgQuota(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Lokasi / Tempat *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Solo Technopark & Hybrid Zoom"
                        value={progLocation}
                        onChange={(e) => setProgLocation(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Instruktur / Narasumber *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Tim Pengadaan LKPP & Bagian PBJ Setda Solo"
                        value={progInstructor}
                        onChange={(e) => setProgInstructor(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Deskripsi Program & Silabus Materi
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Jelaskan tujuan workshop, kompetensi yang didapatkan, dan syarat peserta..."
                      value={progDesc}
                      onChange={(e) => setProgDesc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                    />
                  </div>
                </div>

                {/* Right side banner & preview */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-4 bg-[#FAF8F7] rounded-2xl border border-neutral-200 space-y-3">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Banner Foto Program
                    </label>

                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-200 border border-neutral-300">
                      <img
                        src={progImage}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>

                    <input
                      type="file"
                      ref={progFileInputRef}
                      accept="image/*"
                      onChange={handleProgFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => progFileInputRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl border border-neutral-300 hover:border-[#D90816] text-xs font-semibold text-neutral-700 flex items-center justify-center gap-1.5 bg-white"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#D90816]" />
                      <span>{progUploadedFileName ? 'Ganti Foto Banner' : 'Unggah Banner Baru'}</span>
                    </button>
                    {progUploadedFileName && (
                      <p className="text-[10px] text-emerald-600 truncate">{progUploadedFileName}</p>
                    )}

                    <input
                      type="url"
                      placeholder="Atau tautan URL foto kustom..."
                      value={progImage}
                      onChange={(e) => setProgImage(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816] bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition shadow-md shadow-[#D90816]/20 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan & Publikasikan Program</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAgendaSubmit} className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Nama Agenda / Event Pameran *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Solo Great Sale Expo 2026 & Pameran UMKM"
                      value={agendaTitle}
                      onChange={(e) => setAgendaTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Kategori Agenda *
                      </label>
                      <select
                        value={agendaCategory}
                        onChange={(e) => setAgendaCategory(e.target.value as EventAgenda['category'])}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      >
                        <option value="Bazzar">Bazzar & Pasar Rakyat</option>
                        <option value="Pameran">Pameran & Expo UMKM</option>
                        <option value="Business Matching">Business Matching B2B</option>
                        <option value="Temu Usaha">Temu Usaha & Kemitraan</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Status Agenda *
                      </label>
                      <select
                        value={agendaStatus}
                        onChange={(e) => setAgendaStatus(e.target.value as EventAgenda['status'])}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      >
                        <option value="Mendatang">Mendatang</option>
                        <option value="Berlangsung">Sedang Berlangsung</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Tanggal Pelaksanaan *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 1-3 November 2026"
                        value={agendaDate}
                        onChange={(e) => setAgendaDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Waktu Kegiatan *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: 08:00 - 21:00 WIB"
                        value={agendaTime}
                        onChange={(e) => setAgendaTime(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Lokasi Penyelenggaraan *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Atrium Solo Paragon & Koridor Ngarsopuro"
                        value={agendaLocation}
                        onChange={(e) => setAgendaLocation(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-neutral-700 block mb-1">
                        Penyelenggara *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Dinas Koperasi & UKM Surakarta bersama BI Solo"
                        value={agendaOrganizer}
                        onChange={(e) => setAgendaOrganizer(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      Deskripsi Acara
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Jelaskan fasilitas booth pameran, target pengunjung, dan rundown..."
                      value={agendaDesc}
                      onChange={(e) => setAgendaDesc(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#D90816]"
                    />
                  </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                  <div className="p-4 bg-[#FAF8F7] rounded-2xl border border-neutral-200 space-y-3">
                    <label className="text-xs font-bold text-neutral-800 block">
                      Banner Foto Event
                    </label>
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-200 border border-neutral-300">
                      <img
                        src={agendaImage}
                        alt="Event Banner"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="Tautan URL gambar event..."
                      value={agendaImage}
                      onChange={(e) => setAgendaImage(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-neutral-300 focus:outline-none focus:border-[#D90816] bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 rounded-full border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#D90816] text-white text-xs font-bold hover:bg-[#b80512] transition shadow-md shadow-[#D90816]/20 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan & Tayangkan Agenda</span>
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Listing View */
        <>
          {/* Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('program')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'program'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              Program Akademi & Pelatihan ({programs.length})
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className={`px-5 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === 'agenda'
                  ? 'bg-[#171717] text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              Agenda & Pameran CFD ({events.length})
            </button>
          </div>

          {/* Content based on tab */}
          {activeTab === 'program' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FDEBEC] text-[#D90816] text-[10px] font-bold">
                        {p.type} • {p.level}
                      </span>
                      <h3 className="font-bold text-base text-neutral-900 mt-1">{p.title}</h3>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.status === 'buka' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-neutral-500 bg-[#FAF8F7] p-3 rounded-2xl border border-neutral-200/60">
                    <p className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D90816]" />
                      <span>Jadwal: <strong className="text-neutral-800">{p.date}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Lokasi: <strong className="text-neutral-800">{p.location}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Instruktur: <strong className="text-neutral-800">{p.instructor}</strong></span>
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-700">
                      Peserta: <strong>{p.registeredCount}</strong> / {p.quota} Kuota
                    </span>
                    <button
                      onClick={() => showToast(`Kuota program "${p.title}" diperbarui!`, 'info')}
                      className="px-3.5 py-1 rounded-xl border border-neutral-300 font-semibold text-neutral-700 hover:bg-neutral-50 transition cursor-pointer"
                    >
                      Edit Kuota
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((e) => (
                <div
                  key={e.id}
                  className="bg-white rounded-3xl border border-neutral-200/90 p-6 shadow-xs space-y-3 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-900 text-white text-[10px] font-bold">
                        {e.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                        {e.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-neutral-900">{e.title}</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-3">{e.description}</p>
                  </div>

                  <div className="pt-3 text-xs text-neutral-600 border-t border-neutral-100 space-y-1 mt-2">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#D90816]" />
                      <span>Waktu: <strong>{e.date} • {e.time}</strong></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Lokasi: <strong>{e.location}</strong></span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
