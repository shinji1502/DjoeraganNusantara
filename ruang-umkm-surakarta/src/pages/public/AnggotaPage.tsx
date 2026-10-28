import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  MapPin,
  Briefcase,
  Store,
  Sparkles,
  UserCheck,
  Calendar,
  X,
  ChevronRight,
  ShieldCheck,
  Building2,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Member, Gender, AgeGroup } from '../../types';
import { JAWA_TENGAH_REGIONS } from '../../data/memberData';
import { NumberCounter } from '../../components/common/NumberCounter';
import { BatikKawung } from '../../components/common/BatikOrnament';

export const AnggotaPage: React.FC = () => {
  const { members } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState<string>('Semua');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('Semua');
  const [selectedRegion, setSelectedRegion] = useState<string>('Semua');
  const [selectedBusinessStatus, setSelectedBusinessStatus] = useState<string>('Semua');
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('Semua');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Business types for filter
  const businessTypes = [
    'Semua',
    'Kuliner',
    'Batik & Fashion',
    'Kerajinan Tangan',
    'Pertanian & Olahan',
    'Jasa Kreatif',
    'Teknologi',
  ];

  // Age groups
  const ageGroups: { label: string; value: string }[] = [
    { label: 'Semua Usia', value: 'Semua' },
    { label: '17–23 tahun (Gen-Z)', value: '17-23' },
    { label: '24–35 tahun (Muda)', value: '24-35' },
    { label: '36–45 tahun (Matang)', value: '36-45' },
    { label: '46+ tahun (Senior)', value: '46+' },
  ];

  // Filtered members
  // Only display verified members in the public directory per specifications
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      // Must be approved for public directory
      if (m.verificationStatus !== 'disetujui') return false;

      // Search Query (Name, Business Name, or Bio)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchBusiness = m.businessName?.toLowerCase().includes(q) || false;
        const matchCity = m.cityDistrict.toLowerCase().includes(q);
        const matchBio = m.bio?.toLowerCase().includes(q) || false;
        if (!matchName && !matchBusiness && !matchCity && !matchBio) return false;
      }

      // Gender filter
      if (selectedGender !== 'Semua' && m.gender !== selectedGender) return false;

      // Age Group filter
      if (selectedAgeGroup !== 'Semua' && m.ageGroup !== selectedAgeGroup) return false;

      // Region filter
      if (selectedRegion !== 'Semua' && m.cityDistrict !== selectedRegion) return false;

      // Business status filter
      if (selectedBusinessStatus === 'punya_usaha' && !m.hasBusiness) return false;
      if (selectedBusinessStatus === 'belum_usaha' && m.hasBusiness) return false;

      // Business Type filter
      if (selectedBusinessType !== 'Semua' && m.businessType !== selectedBusinessType) {
        return false;
      }

      return true;
    });
  }, [
    members,
    searchQuery,
    selectedGender,
    selectedAgeGroup,
    selectedRegion,
    selectedBusinessStatus,
    selectedBusinessType,
  ]);

  // Calculated statistics
  const totalApproved = members.filter((m) => m.verificationStatus === 'disetujui').length;
  const countWithBusiness = members.filter(
    (m) => m.verificationStatus === 'disetujui' && m.hasBusiness
  ).length;
  const countWithoutBusiness = members.filter(
    (m) => m.verificationStatus === 'disetujui' && !m.hasBusiness
  ).length;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedGender('Semua');
    setSelectedAgeGroup('Semua');
    setSelectedRegion('Semua');
    setSelectedBusinessStatus('Semua');
    setSelectedBusinessType('Semua');
  };

  return (
    <div className="bg-theme-tentang min-h-screen pb-20 space-y-10">
      {/* Editorial Header with warm cultural identity, square grid, & faint artisan watermark */}
      <section className="relative overflow-hidden bg-transparent border-b border-[#E7E2D9] bg-heritage-artisan-watermark py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9F4EB] text-[#8C5835] border border-[#C5A059]/30 text-xs font-bold shadow-2xs">
              <Users className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Direktori Resmi Komunitas UMKM</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1C1917] tracking-tight">
              Anggota <span className="text-[#B81D24]">Djoeragan Nusantara</span>
            </h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              Menghubungkan ribuan wirausaha di 35 Kabupaten/Kota Jawa Tengah. Jelajahi profil anggota, temukan mitra kolaborasi bisnis, atau mulai langkah usaha Anda bersama kami.
            </p>
          </div>

          {/* Animated Statistics Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            <div className="card-heritage p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#B81D24] flex items-center justify-center shrink-0 border border-red-100">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] leading-tight">
                  <NumberCounter target={totalApproved} suffix="+" />
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Anggota Terverifikasi</p>
              </div>
            </div>

            <div className="card-heritage p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-100">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] leading-tight">
                  <NumberCounter target={countWithBusiness} suffix="+" />
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Memiliki Usaha Aktif</p>
              </div>
            </div>

            <div className="card-heritage p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F9F4EB] text-[#8C5835] flex items-center justify-center shrink-0 border border-[#C5A059]/30">
                <Sparkles className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] leading-tight">
                  <NumberCounter target={countWithoutBusiness} />
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Rintisan & Inkubasi</p>
              </div>
            </div>

            <div className="card-heritage p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200">
                <MapPin className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] leading-tight">
                  <NumberCounter target={35} />
                </div>
                <p className="text-xs text-stone-500 font-medium mt-0.5">Kabupaten & Kota Jateng</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Search, Filters & Members Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Filter Controls Box */}
        <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-7 shadow-2xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Cari nama anggota, nama usaha, atau komoditas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FAF7F2] border border-[#D6CEC2] text-xs text-[#1C1917] placeholder:text-stone-400 focus:outline-none focus:border-[#C5A059] focus:bg-white transition shadow-2xs"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Status Toggle */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] border border-[#E7E2D9] rounded-full text-xs shrink-0">
              <button
                onClick={() => setSelectedBusinessStatus('Semua')}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                  selectedBusinessStatus === 'Semua'
                    ? 'bg-white text-[#1C1917] shadow-2xs border border-stone-200'
                    : 'text-stone-600 hover:text-[#1C1917]'
                }`}
              >
                Semua Status
              </button>
              <button
                onClick={() => setSelectedBusinessStatus('punya_usaha')}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                  selectedBusinessStatus === 'punya_usaha'
                    ? 'bg-gradient-to-r from-[#B81D24] to-[#98141A] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-[#1C1917]'
                }`}
              >
                Memiliki Usaha
              </button>
              <button
                onClick={() => setSelectedBusinessStatus('belum_usaha')}
                className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                  selectedBusinessStatus === 'belum_usaha'
                    ? 'bg-[#1C1917] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-[#1C1917]'
                }`}
              >
                Rintisan Pemula
              </button>
            </div>
          </div>

          {/* Granular Filters Dropdown Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2 border-t border-stone-100 text-xs">
            {/* Filter Wilayah Jawa Tengah (29 Kab & 6 Kota) */}
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Wilayah Jawa Tengah (35 Daerah)
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-[#1C1917] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="Semua">Semua Wilayah Jawa Tengah</option>
                <optgroup label="6 Kota di Jawa Tengah">
                  {JAWA_TENGAH_REGIONS.filter((r) => r.type === 'Kota').map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="29 Kabupaten di Jawa Tengah">
                  {JAWA_TENGAH_REGIONS.filter((r) => r.type === 'Kabupaten').map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Filter Kelompok Usia */}
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Kelompok Usia
              </label>
              <select
                value={selectedAgeGroup}
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-[#1C1917] focus:outline-none focus:border-[#C5A059]"
              >
                {ageGroups.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Gender */}
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Jenis Kelamin
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-[#1C1917] focus:outline-none focus:border-[#C5A059]"
              >
                <option value="Semua">Semua Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Filter Jenis Usaha */}
            <div>
              <label className="text-[11px] font-bold text-stone-700 block mb-1">
                Jenis Usaha
              </label>
              <select
                value={selectedBusinessType}
                onChange={(e) => setSelectedBusinessType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D6CEC2] bg-[#FAF7F2] text-[#1C1917] focus:outline-none focus:border-[#C5A059]"
              >
                {businessTypes.map((t) => (
                  <option key={t} value={t}>
                    {t === 'Semua' ? 'Semua Jenis Usaha' : t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filter Indicators & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-stone-500">
            <div className="flex items-center gap-1.5 font-medium">
              <span>Menampilkan:</span>
              <strong className="text-[#1C1917] font-extrabold">{filteredMembers.length} anggota</strong>
              <span>sesuai kriteria</span>
            </div>

            {(searchQuery ||
              selectedGender !== 'Semua' ||
              selectedAgeGroup !== 'Semua' ||
              selectedRegion !== 'Semua' ||
              selectedBusinessStatus !== 'Semua' ||
              selectedBusinessType !== 'Semua') && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-[#B81D24] hover:underline flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>
        </div>

        {/* Verification Policy Banner */}
        <div className="p-4 rounded-2xl bg-[#F9F4EB] border border-[#C5A059]/30 flex items-start gap-3 text-xs text-[#8C5835]">
          <ShieldCheck className="w-4 h-4 text-[#9A6B39] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Standar Keanggotaan Terverifikasi:</strong> Direktori publik Djoeragan Nusantara hanya menampilkan anggota yang telah lulus pemeriksaan identitas dan keabsahan usaha oleh tim admin. Data kontak sensitif dilindungi untuk kenyamanan seluruh anggota.
          </p>
        </div>

        {/* Members Cards Grid */}
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="card-heritage group rounded-2xl overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 space-y-4">
                  {/* Top: Avatar, Name & Badges */}
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-13 h-13 rounded-2xl object-cover border border-[#E7E2D9]"
                      />
                      <span
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#9A6B39] text-white flex items-center justify-center border-2 border-white shadow-xs"
                        title="Anggota Terverifikasi"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-extrabold text-sm text-[#1C1917] truncate group-hover:text-[#B81D24] transition-colors">
                        {member.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-stone-200 text-stone-600">
                          {member.gender}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-stone-200 text-stone-600">
                          {member.age} th ({member.ageGroup})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1.5 text-xs text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                    <span className="truncate">{member.cityDistrict}</span>
                  </div>

                  {/* Business Card Box */}
                  {member.hasBusiness ? (
                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-stone-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#1C1917] truncate">
                          {member.businessName}
                        </span>
                        {member.businessScale && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {member.businessScale}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#8C5835] font-semibold">
                        <Store className="w-3 h-3 text-[#C5A059]" />
                        <span>{member.businessType}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-700 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                      <span>Rintisan Pemula / Siap Belajar</span>
                    </div>
                  )}

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>

                {/* Footer Action */}
                <div className="p-4 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-stone-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    Gabung {member.joinDate}
                  </span>
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="font-bold text-[#B81D24] hover:underline flex items-center gap-0.5"
                  >
                    Profil Lengkap <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200/90 p-12 text-center max-w-md mx-auto space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-stone-400 mx-auto flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-base text-[#1C1917]">
              Tidak Ada Anggota yang Cocok
            </h3>
            <p className="text-xs text-stone-500">
              Coba sesuaikan kata kunci pencarian atau ubah kombinasi filter wilayah dan usia.
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#B81D24] to-[#98141A] text-white text-xs font-bold shadow-xs"
            >
              Reset Filter
            </button>
          </div>
        )}
      </section>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-scale-up relative">
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <img
                src={selectedMember.avatar}
                alt={selectedMember.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#E7E2D9]"
              />
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C5835] bg-[#F9F4EB] border border-[#C5A059]/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-[#C5A059]" />
                  Terverifikasi Admin
                </div>
                <h3 className="text-lg font-extrabold text-[#1C1917]">{selectedMember.name}</h3>
                <p className="text-xs text-stone-500">
                  {selectedMember.gender} • {selectedMember.age} Tahun ({selectedMember.ageGroup})
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-stone-100 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>
                  <strong>Wilayah:</strong> {selectedMember.cityDistrict} ({selectedMember.regencyType})
                </span>
              </div>

              {selectedMember.hasBusiness ? (
                <>
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#8C5835] shrink-0" />
                    <span>
                      <strong>Usaha:</strong> {selectedMember.businessName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#8C5835] shrink-0" />
                    <span>
                      <strong>Sektor & Skala:</strong> {selectedMember.businessType} (Skala {selectedMember.businessScale})
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>
                    <strong>Status:</strong> Rintisan Usaha Baru / Terbuka untuk Kolaborasi
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
                <span>
                  <strong>Bergabung:</strong> {selectedMember.joinDate}
                </span>
              </div>
            </div>

            {selectedMember.bio && (
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 text-xs text-stone-600 leading-relaxed">
                <span className="font-bold text-[#1C1917] block mb-1">Profil & Visi Usaha:</span>
                {selectedMember.bio}
              </div>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2.5 rounded-full border border-[#D6CEC2] text-xs font-bold text-stone-700 hover:bg-[#FAF7F2] transition"
              >
                Tutup
              </button>
              <Link
                to="/daftar"
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#B81D24] to-[#98141A] text-white text-xs font-bold hover:from-[#98141A] hover:to-[#7A0D13] transition shadow-xs"
              >
                Gabung Jadi Anggota
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* CTA Join Community */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-[#161413] border border-[#8C5835]/30 rounded-3xl p-8 sm:p-12 text-stone-200 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
          {/* Subtle Kawung watermark */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
            <BatikKawung color="#C5A059" opacity={0.08} className="w-full h-full" />
          </div>

          <div className="relative z-10 space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2]/10 text-[#C5A059] text-xs font-bold border border-[#C5A059]/30">
              <Sparkles className="w-3.5 h-3.5" />
              Komunitas Tumbuh Bersama
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ingin Bergabung dalam Direktori Anggota Djoeragan Nusantara?
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Daftarkan diri atau usaha Anda secara mudah. Lengkapi formulir pendaftaran dan tunggu verifikasi admin untuk menikmati akses pelatihan, jejaring B2B, dan sertifikasi usaha.
            </p>
          </div>
          <Link
            to="/daftar"
            className="relative z-10 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B81D24] to-[#98141A] text-white font-bold text-xs sm:text-sm hover:from-[#98141A] hover:to-[#7A0D13] transition shadow-lg shadow-black/40 shrink-0"
          >
            Daftar Anggota Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
};
