import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Store,
  Sparkles,
  BookOpen,
  Calendar,
  Users,
  ChevronRight,
  MapPin,
  Flame,
  CreditCard,
  Building2,
  Landmark,
  BadgeCheck,
  TrendingUp,
  FileCheck,
  Handshake,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/common/ProductCard';
import { NumberCounter } from '../../components/common/NumberCounter';

export const HomePage: React.FC = () => {
  const { products, programs, events, registerProgram } = useApp();

  // Curated active products
  const curatedProducts = products
    .filter((p) => p.status === 'aktif' && p.isCurated)
    .slice(0, 4);

  // 6 Illustrative Vector Scene Icons per Jakpreneur Style & Specification
  const facilityFeatures = [
    {
      title: 'Pelatihan',
      category: 'Kecakapan Usaha',
      link: '/pelatihan',
      vectorIcon: (
        <svg className="w-full h-full" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Organic background blob */}
          <path d="M30 75C20 40 45 15 85 18C125 21 160 38 155 75C150 115 125 140 85 138C45 136 40 110 30 75Z" fill="#38BDF8" fillOpacity="0.88" />
          <circle cx="145" cy="40" r="14" fill="#FB923C" fillOpacity="0.35" />
          <circle cx="35" cy="115" r="10" fill="#FBBF24" fillOpacity="0.4" />
          {/* Whiteboard with chart */}
          <rect x="38" y="32" width="76" height="52" rx="4" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="38" y="32" width="76" height="10" fill="#0284C7" />
          <circle cx="45" cy="37" r="2" fill="#FFFFFF" />
          <circle cx="51" cy="37" r="2" fill="#FFFFFF" />
          {/* Growth chart line & bars */}
          <path d="M48 68L60 56L72 62L86 48" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M82 48H86V52" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="48" y="70" width="6" height="8" rx="1" fill="#38BDF8" />
          <rect x="58" y="65" width="6" height="13" rx="1" fill="#0284C7" />
          <rect x="68" y="60" width="6" height="18" rx="1" fill="#F97316" />
          <rect x="78" y="54" width="6" height="24" rx="1" fill="#10B981" />
          {/* Stand */}
          <path d="M52 84L46 108M100 84L106 108" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
          {/* Mentor character */}
          <circle cx="128" cy="58" r="11" fill="#FDBA74" />
          <path d="M120 54C120 48 126 44 134 46C138 47 141 51 138 56C135 56 128 54 120 54Z" fill="#1E293B" />
          <path d="M116 72C116 69 119 67 122 67H134C137 67 140 69 140 72L143 112H113L116 72Z" fill="#EA580C" />
          <path d="M124 74L128 78L132 74M124 86L128 90L132 86M124 98L128 102L132 98" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M116 75L96 64" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" />
          <circle cx="95" cy="63" r="2.5" fill="#FDBA74" />
          {/* Attendee character */}
          <circle cx="34" cy="74" r="9" fill="#FDBA74" />
          <path d="M27 70C27 65 32 62 39 63C42 64 44 68 42 72C39 72 34 70 27 70Z" fill="#047857" />
          <path d="M23 85C23 83 25 81 28 81H38C41 81 43 83 43 85L45 116H21L23 85Z" fill="#0284C7" />
          <rect x="32" y="88" width="14" height="18" rx="2" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.5" />
          <path d="M35 93H43M35 97H43M35 101H40" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" />
          {/* Lightbulb */}
          <path d="M96 22C96 17 100 13 105 13C110 13 114 17 114 22C114 25 112 27 110 29V32H100V29C98 27 96 25 96 22Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
          <line x1="99" y1="34" x2="111" y2="34" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
          <path d="M105 7V10M90 18L93 20M120 18L117 20" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Sertifikasi Usaha',
      category: 'Legalitas & Perizinan',
      link: '/sertifikasi-usaha',
      vectorIcon: (
        <svg className="w-full h-full" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Organic background blob */}
          <path d="M35 70C25 35 50 15 90 20C130 25 155 45 150 85C145 125 120 142 80 138C40 134 45 105 35 70Z" fill="#38BDF8" fillOpacity="0.88" />
          <circle cx="40" cy="35" r="16" fill="#F59E0B" fillOpacity="0.35" />
          {/* Gear in background */}
          <g opacity="0.65">
            <circle cx="138" cy="38" r="13" fill="#F59E0B" />
            <circle cx="138" cy="38" r="5" fill="#FFFFFF" />
            <path d="M138 22V25M138 51V54M122 38H125M151 38H154M127 27L129 29M147 47L149 49M127 49L129 47M147 29L149 27" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          </g>
          {/* Certificate Document */}
          <rect x="52" y="24" width="76" height="98" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="52" y="24" width="76" height="12" rx="4" fill="#0284C7" />
          <circle cx="90" cy="30" r="3" fill="#FDE047" />
          <path d="M62 46H100M62 56H95M62 66H105M62 76H90" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="116" cy="46" r="4" fill="#10B981" />
          <path d="M114 46L115.5 47.5L118 44.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="116" cy="56" r="4" fill="#10B981" />
          <path d="M114 56L115.5 57.5L118 54.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="116" cy="66" r="4" fill="#10B981" />
          <path d="M114 66L115.5 67.5L118 64.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          {/* Wax seal */}
          <circle cx="90" cy="94" r="13" fill="#DC2626" />
          <circle cx="90" cy="94" r="9" fill="#EF4444" stroke="#FCA5A5" strokeWidth="1" />
          <path d="M85 104L80 118L90 113L100 118L95 104" fill="#DC2626" />
          <path d="M86 94L89 97L94 91" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          {/* Verifier Character */}
          <circle cx="34" cy="66" r="10" fill="#FDBA74" />
          <path d="M26 62C26 56 31 52 38 53C42 54 44 58 42 63C39 63 33 61 26 62Z" fill="#1E293B" />
          <path d="M22 78C22 75 25 73 28 73H38C41 73 44 75 44 78L46 116H20L22 78Z" fill="#0284C7" />
          <path d="M30 73L33 86L36 73" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          <rect x="31" y="86" width="4" height="6" rx="1" fill="#EF4444" />
          {/* Owner Character */}
          <circle cx="144" cy="66" r="10" fill="#FDBA74" />
          <path d="M136 62C136 56 142 52 149 53C152 54 154 58 152 63C149 63 143 61 136 62Z" fill="#1E293B" />
          <path d="M132 78C132 75 135 73 138 73H148C151 73 154 75 154 78L156 116H130L132 78Z" fill="#EA580C" />
          <path d="M138 80L143 85L148 80" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M130 84L122 82C120 81 120 78 122 77L125 76L126 73C126 71 128 71 129 72L132 82" stroke="#FDBA74" strokeWidth="2" strokeLinecap="round" fill="#FDBA74" />
        </svg>
      ),
    },
    {
      title: 'Katalog Produk',
      category: 'Pemasaran & Etalase',
      link: '/katalog',
      vectorIcon: (
        <svg className="w-full h-full" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Organic background blob */}
          <path d="M30 75C20 40 45 15 85 18C125 21 160 40 155 80C150 120 120 142 80 138C40 134 40 110 30 75Z" fill="#38BDF8" fillOpacity="0.88" />
          <circle cx="145" cy="40" r="14" fill="#F43F5E" fillOpacity="0.35" />
          {/* Computer Screen */}
          <rect x="42" y="28" width="84" height="62" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="42" y="28" width="84" height="12" fill="#0284C7" />
          <circle cx="49" cy="34" r="2" fill="#F87171" />
          <circle cx="55" cy="34" r="2" fill="#FBBF24" />
          <circle cx="61" cy="34" r="2" fill="#34D399" />
          {/* Product display */}
          <rect x="49" y="46" width="30" height="34" rx="3" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1" />
          <path d="M52 68L58 60L65 67L71 58L76 68H52Z" fill="#38BDF8" />
          <circle cx="57" cy="54" r="3" fill="#F59E0B" />
          {/* 4 Golden Stars */}
          <g fill="#F59E0B">
            <path d="M85 49L86 51.5L88.5 51.5L86.5 53L87.2 55.5L85 54L82.8 55.5L83.5 53L81.5 51.5L84 51.5Z" />
            <path d="M94 49L95 51.5L97.5 51.5L95.5 53L96.2 55.5L94 54L91.8 55.5L92.5 53L90.5 51.5L93 51.5Z" />
            <path d="M103 49L104 51.5L106.5 51.5L104.5 53L105.2 55.5L103 54L100.8 55.5L101.5 53L99.5 51.5L102 51.5Z" />
            <path d="M112 49L113 51.5L115.5 51.5L113.5 53L114.2 55.5L112 54L109.8 55.5L110.5 53L108.5 51.5L111 51.5Z" />
          </g>
          <rect x="85" y="60" width="34" height="4" rx="2" fill="#0284C7" />
          <rect x="85" y="68" width="22" height="6" rx="3" fill="#EF4444" />
          <path d="M84 90V98H74V102H94V98H84" fill="#0284C7" />
          {/* Megaphone / Bullhorn */}
          <path d="M115 48L136 38V66L115 56V48Z" fill="#F97316" stroke="#C2410C" strokeWidth="1.5" />
          <ellipse cx="136" cy="52" rx="4" ry="14" fill="#FB923C" stroke="#C2410C" strokeWidth="1.5" />
          <rect x="110" y="50" width="6" height="10" rx="1" fill="#EA580C" />
          <path d="M112 60L110 70H114L116 60" fill="#475569" />
          <path d="M144 44C148 48 148 56 144 60" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          <path d="M150 40C156 46 156 58 150 64" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
          {/* Female Marketer */}
          <circle cx="138" cy="74" r="10" fill="#FDBA74" />
          <path d="M130 70C130 63 136 59 144 60C148 61 150 66 148 71C144 71 138 69 130 70Z" fill="#0F172A" />
          <path d="M125 88C125 85 128 83 132 83H144C148 83 151 85 151 88L153 120H123L125 88Z" fill="#0284C7" />
          <path d="M126 90L114 80" stroke="#FDBA74" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="113" cy="79" r="2.5" fill="#FDBA74" />
        </svg>
      ),
    },
    {
      title: 'Permodalan',
      category: 'Keuangan & Modal',
      link: '/akses-bertumbuh',
      vectorIcon: (
        <svg className="w-full h-full" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Organic background blob */}
          <path d="M30 70C20 35 45 15 85 18C125 21 160 38 155 75C150 115 125 142 85 138C45 134 40 105 30 70Z" fill="#38BDF8" fillOpacity="0.88" />
          <circle cx="140" cy="35" r="18" fill="#F59E0B" fillOpacity="0.35" />
          {/* Green upward trend */}
          <path d="M35 88L65 62L95 72L135 34" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M123 34H135V46" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Golden Coins Stack */}
          <ellipse cx="90" cy="112" rx="22" ry="7" fill="#D97706" />
          <rect x="68" y="105" width="44" height="7" fill="#F59E0B" />
          <ellipse cx="90" cy="105" rx="22" ry="7" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
          <rect x="68" y="96" width="44" height="7" fill="#F59E0B" />
          <ellipse cx="90" cy="96" rx="22" ry="7" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
          <rect x="68" y="87" width="44" height="7" fill="#F59E0B" />
          <ellipse cx="90" cy="87" rx="22" ry="7" fill="#FDE047" stroke="#D97706" strokeWidth="1" />
          <rect x="68" y="78" width="44" height="7" fill="#F59E0B" />
          <ellipse cx="90" cy="78" rx="22" ry="7" fill="#FEF08A" stroke="#D97706" strokeWidth="1" />
          <text x="90" y="81" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#B45309" fontFamily="sans-serif">Rp</text>
          {/* Banker Character */}
          <circle cx="42" cy="62" r="10" fill="#FDBA74" />
          <path d="M34 58C34 52 39 48 47 49C50 50 52 54 50 59C47 59 41 57 34 58Z" fill="#1E293B" />
          <path d="M30 74C30 71 33 69 36 69H48C51 69 54 71 54 74L56 112H28L30 74Z" fill="#1E3A8A" />
          <path d="M42 69L40 82L42 80L44 82L42 69" fill="#EF4444" />
          {/* UMKM Entrepreneur */}
          <circle cx="138" cy="62" r="10" fill="#FDBA74" />
          <path d="M130 58C130 52 136 48 143 49C146 50 148 54 146 59C143 59 137 57 130 58Z" fill="#1E293B" />
          <path d="M126 74C126 71 129 69 132 69H144C147 69 150 71 150 74L152 112H124L126 74Z" fill="#EA580C" />
          <path d="M132 76L138 82L144 76" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M48 76L70 82M130 76L108 82" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="120" cy="116" rx="14" ry="4" fill="#D97706" />
          <rect x="106" y="111" width="28" height="5" fill="#F59E0B" />
          <ellipse cx="120" cy="111" rx="14" ry="4" fill="#FDE047" stroke="#D97706" strokeWidth="0.8" />
        </svg>
      ),
    },
    {
      title: 'Kemitraan B2B & B2G',
      category: 'Kerja Sama Bisnis',
      link: '/akses-bertumbuh',
      vectorIcon: (
        <svg className="w-full h-full" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Organic background blob */}
          <path d="M30 70C20 35 45 15 85 18C125 21 160 38 155 75C150 115 125 142 85 138C45 134 40 105 30 70Z" fill="#38BDF8" fillOpacity="0.88" />
          <circle cx="40" cy="40" r="16" fill="#F59E0B" fillOpacity="0.35" />
          {/* Smartphone */}
          <rect x="62" y="24" width="56" height="96" rx="8" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
          <rect x="74" y="27" width="32" height="3" rx="1.5" fill="#94A3B8" />
          <circle cx="90" cy="112" r="3" fill="#CBD5E1" />
          <rect x="68" y="34" width="44" height="70" rx="3" fill="#F0F9FF" />
          {/* Handshake Graphic */}
          <circle cx="90" cy="54" r="14" fill="#DBEAFE" />
          <path d="M82 52L88 56L98 48" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="72" y="74" width="36" height="5" rx="2" fill="#0284C7" />
          <rect x="72" y="82" width="24" height="4" rx="2" fill="#F59E0B" />
          <rect x="72" y="89" width="30" height="4" rx="2" fill="#10B981" />
          {/* Magnifying Glass */}
          <circle cx="124" cy="48" r="11" fill="#FFFFFF" stroke="#F97316" strokeWidth="2.5" />
          <path d="M132 56L142 66" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
          <path d="M120 48L123 51L128 45" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
          {/* B2B Supplier */}
          <circle cx="34" cy="68" r="9" fill="#FDBA74" />
          <path d="M26 64C26 58 31 54 39 55C42 56 44 60 42 65C39 65 33 63 26 64Z" fill="#047857" />
          <path d="M22 80C22 77 25 75 28 75H38C41 75 44 77 44 80L46 116H20L22 80Z" fill="#0D9488" />
          <path d="M38 84L54 82" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
          {/* Corporate Partner */}
          <circle cx="144" cy="68" r="9" fill="#FDBA74" />
          <path d="M136 64C136 58 142 54 149 55C152 56 154 60 152 65C149 65 143 63 136 64Z" fill="#1E293B" />
          <path d="M132 80C132 77 135 75 138 75H148C151 75 154 77 154 80L156 116H130L132 80Z" fill="#1E3A8A" />
          <path d="M140 84L126 82" stroke="#FDBA74" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: 'Event & Pameran',
      category: 'Bazar & Expo',
      link: '/event',
      vectorIcon: (
        <svg className="w-full h-full" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Organic background blob */}
          <path d="M30 70C20 35 45 15 85 18C125 21 160 38 155 75C150 115 125 142 85 138C45 134 40 105 30 70Z" fill="#38BDF8" fillOpacity="0.88" />
          <circle cx="145" cy="40" r="16" fill="#F43F5E" fillOpacity="0.35" />
          {/* Expo Canopy Booth */}
          <path d="M44 38L90 20L136 38H44Z" fill="#EF4444" />
          <path d="M44 38L56 38L62 48L44 48V38ZM74 38L86 38L86 48L68 48L74 38ZM104 38L116 38L110 48L92 48L98 38ZM124 38L136 38V48L118 48L124 38Z" fill="#FFFFFF" />
          <line x1="48" y1="48" x2="48" y2="108" stroke="#0284C7" strokeWidth="2.5" />
          <line x1="132" y1="48" x2="132" y2="108" stroke="#0284C7" strokeWidth="2.5" />
          {/* Table */}
          <rect x="42" y="80" width="96" height="28" rx="3" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2" />
          <rect x="42" y="80" width="96" height="6" fill="#0284C7" />
          <rect x="52" y="70" width="14" height="10" rx="2" fill="#F97316" />
          <circle cx="76" cy="74" r="6" fill="#10B981" />
          <rect x="92" y="68" width="12" height="12" rx="2" fill="#8B5CF6" />
          <ellipse cx="118" cy="76" rx="8" ry="4" fill="#F59E0B" />
          {/* Calendar */}
          <rect x="122" y="16" width="26" height="26" rx="5" fill="#FFFFFF" stroke="#EF4444" strokeWidth="1.5" />
          <rect x="122" y="16" width="26" height="8" rx="3" fill="#EF4444" />
          <circle cx="127" cy="20" r="1" fill="#FFFFFF" />
          <circle cx="143" cy="20" r="1" fill="#FFFFFF" />
          <text x="135" y="37" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E293B" fontFamily="sans-serif">28</text>
          {/* Booth Owner */}
          <circle cx="36" cy="64" r="8" fill="#FDBA74" />
          <path d="M28 60C28 55 33 52 40 53C43 54 45 57 43 61C40 61 35 60 28 60Z" fill="#1E293B" />
          <path d="M26 74C26 72 28 70 31 70H41C44 70 46 72 46 74L47 114H24L26 74Z" fill="#EA580C" />
          <path d="M40 76L48 70" stroke="#FDBA74" strokeWidth="2.5" strokeLinecap="round" />
          {/* Visitor */}
          <circle cx="146" cy="66" r="8" fill="#FDBA74" />
          <path d="M138 62C138 57 143 54 150 55C153 56 155 59 153 63C150 63 145 62 138 62Z" fill="#047857" />
          <path d="M136 76C136 74 138 72 141 72H151C154 72 156 74 156 76L157 114H134L136 76Z" fill="#0284C7" />
          <path d="M142 80L134 76" stroke="#FDBA74" strokeWidth="2.5" strokeLinecap="round" />
          <rect x="150" y="86" width="10" height="12" rx="1.5" fill="#F59E0B" />
          <path d="M152 86V83C152 81.5 153.5 80 155 80C156.5 80 158 81.5 158 83V86" stroke="#B45309" strokeWidth="1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-20 pb-20 bg-theme-beranda min-h-screen">
      {/* HERO SECTION — Editorial, Friendly, and Welcoming */}
      <section className="relative overflow-hidden bg-transparent border-b border-neutral-200/80 bg-heritage-solo-hero pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full bg-[#D90816]/6 blur-3xl pointer-events-none animate-ambient-glow" />
        <div className="absolute bottom-0 left-10 -mb-24 w-[420px] h-[420px] rounded-full bg-amber-600/5 blur-3xl pointer-events-none animate-ambient-glow" style={{ animationDelay: '4s' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Friendly Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left animate-hero-enter">
              {/* Friendly Eyebrow Label */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDEBEC] border border-[#D90816]/15 text-[#D90816] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Selamat Datang di Djoeragan Nusantara</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#171717] tracking-tight leading-[1.14]">
                Wadah Tumbuh & <br className="hidden sm:inline" />
                <span className="text-[#D90816]">Kolaborasi UMKM Nusantara.</span>
              </h1>

              {/* Friendly Supporting Copy */}
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-xl">
                Bantu usaha lokal naik kelas dengan cara yang santai dan mudah. Dapatkan legalitas NIB, sertifikasi halal, akses pelatihan gratis, hingga peluang kerja sama bisnis dan pengadaan pemerintah.
              </p>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/katalog"
                  className="px-6 py-3.5 rounded-full bg-[#D90816] text-white font-bold text-sm hover:bg-[#b80512] transition-colors shadow-md shadow-[#D90816]/25 flex items-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Jelajahi Katalog Produk</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/daftar"
                  className="px-6 py-3.5 rounded-full border border-neutral-300 bg-white text-neutral-800 font-bold text-sm hover:border-neutral-900 hover:bg-neutral-50 transition-colors shadow-xs"
                >
                  Daftar Anggota UMKM
                </Link>
              </div>

              {/* Statistics Bar with NumberCounter Animation */}
              <div className="pt-6 border-t border-neutral-200/70 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#171717]">
                    <NumberCounter target={1480} suffix="+" />
                  </div>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">Anggota Terdaftar</p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#D90816]">
                    <NumberCounter target={35} />
                  </div>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">Kab/Kota Jawa Tengah</p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                    <NumberCounter target={820} suffix="+" />
                  </div>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">Produk Terkurasi</p>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-blue-700">
                    <NumberCounter target={98} suffix="%" />
                  </div>
                  <p className="text-xs text-neutral-500 font-medium mt-0.5">Lolos Legalitas NIB</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Card with Verified Badges */}
            <div className="lg:col-span-5 relative animate-hero-enter">
              <div className="relative rounded-3xl overflow-hidden border border-neutral-200/90 bg-white shadow-xl shadow-neutral-900/5 ring-1 ring-black/5">
                <div className="relative aspect-4/3 sm:aspect-5/4 lg:aspect-4/3 w-full overflow-hidden bg-neutral-100">
                  <img
                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1200&q=80"
                    alt="Pemberdayaan Pengrajin Batik & Kriya Tradisi Djoeragan Nusantara"
                    className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  {/* Top-Right Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Legalitas & Kurasi Terjamin</span>
                  </div>

                  {/* Bottom Integrated Caption */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-white space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider text-neutral-300 uppercase">
                      <MapPin className="w-3.5 h-3.5 text-[#ff4d5a]" />
                      <span>Jawa Tengah • Surakarta & Sekitarnya</span>
                    </div>
                    <p className="font-bold text-sm sm:text-base leading-snug text-white">
                      Dari Rumah Produksi Tradisi Menuju Pasar Ritel Modern & LKPP
                    </p>
                    <p className="text-xs text-neutral-300 font-normal">
                      Mendukung pelaku UMKM kuliner, batik, kerajinan kriya, hingga agribisnis lokal.
                    </p>
                  </div>
                </div>

                {/* Sub-strip Bar */}
                <div className="px-5 py-3 bg-[#171717] border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                  <span className="flex items-center gap-1.5 font-medium text-neutral-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D90816]" />
                    Terverifikasi Admin Djoeragan Nusantara
                  </span>
                  <Link to="/anggota" className="text-[#ff4d5a] hover:underline font-bold">
                    Lihat Direktori Anggota &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PROGRAM FASILITASI & IKON ILUSTRATIF (GAYA JAKPRENEUR) */}
      <section className="relative overflow-hidden py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Title & Subtitle like Jakpreneur */}
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#D90816] tracking-tight">
              Program Djoeragan Nusantara
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
              Melalui <strong className="text-neutral-900 font-bold">Djoeragan Nusantara</strong>, berbagai program fasilitasi yang disediakan dapat diakses oleh para pelaku UMKM untuk lebih mudah dalam mengembangkan usahanya. Sehingga, setiap pelaku usaha dapat memiliki keterampilan, legalitas terjamin, kemandirian berwirausaha, serta kesempatan untuk meraih kesuksesannya.
            </p>
          </div>

          {/* 6 Illustrative Icons Navigation Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4 lg:gap-6 items-start text-center">
            {facilityFeatures.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group flex flex-col items-center text-center p-3 sm:p-2 rounded-2xl hover:bg-white/90 hover:shadow-lg hover:shadow-neutral-900/5 transition-all duration-300"
              >
                {/* Illustrative Vector Scene Icon */}
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex items-center justify-center group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300 drop-shadow-sm group-hover:drop-shadow-md">
                  {item.vectorIcon}
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm sm:text-base text-neutral-900 group-hover:text-[#D90816] transition-colors mt-2 leading-snug">
                  {item.title}
                </h3>

                {/* Selengkapnya Link */}
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#D90816] group-hover:underline mt-1">
                  Selengkapnya &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: PRODUK UNGGULAN TERKURASI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDEBEC] text-[#D90816] text-xs font-bold mb-2">
              <Flame className="w-3.5 h-3.5" />
              Paling Diminati Pembeli
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Karya Pilihan UMKM Terverifikasi
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Produk bermutu tinggi dengan harga jujur langsung dari pengrajin dan pelaku usaha lokal.
            </p>
          </div>
          <Link
            to="/katalog"
            className="text-xs font-bold text-[#D90816] hover:text-[#b80512] flex items-center gap-1 group"
          >
            <span>Lihat Semua Produk di Katalog</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {curatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION: AKSES BERTUMBUH (B2B, B2G & RUANG KOMERSIAL) */}
      <section className="bg-white py-16 border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#D90816] uppercase tracking-wider">Akses Bertumbuh</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171717] tracking-tight">
              Buka Peluang Pasar Besar: B2B, B2G, & Ruang Komersial
            </h2>
            <p className="text-sm text-neutral-600">
              Usaha Anda sudah siap ekspansi? Kami menghubungkan UMKM dengan pesanan korporasi skala besar, pengadaan barang jasa instansi pemerintah, dan showcase ruang komersial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Keuangan & Modal */}
            <div className="p-7 rounded-3xl bg-[#FAF8F7] border border-neutral-200 hover:border-[#D90816] transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Landmark className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-neutral-900">A. Akses Keuangan & Permodalan</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Fasilitasi kredit usaha rakyat (KUR) tanpa agunan rumit, akses permodalan dari perbankan mitra, dan pembukaan akses investor untuk UMKM potensial.
                </p>
              </div>
              <Link
                to="/akses-bertumbuh"
                className="pt-3 font-bold text-xs text-[#D90816] hover:underline flex items-center gap-1"
              >
                <span>Pelajari Akses Permodalan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* B2B Matching */}
            <div className="p-7 rounded-3xl bg-[#FAF8F7] border border-neutral-200 hover:border-[#D90816] transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Handshake className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-neutral-900">B. Kolaborasi B2B Antarbisnis</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Kerja sama antar-pengusaha. Contoh: butuh 1.000 potong konveksi jahit untuk pesanan batik, pasokan bahan baku dari petani, atau agregator ekspor.
                </p>
              </div>
              <Link
                to="/akses-bertumbuh"
                className="pt-3 font-bold text-xs text-[#D90816] hover:underline flex items-center gap-1"
              >
                <span>Lihat Peluang Kerja Sama B2B</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* B2G Government Procurement */}
            <div className="p-7 rounded-3xl bg-[#FAF8F7] border border-neutral-200 hover:border-[#D90816] transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-lg text-neutral-900">C. Pengadaan Pemerintah (B2G)</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Menjembatani produk UMKM yang telah ber-NIB dan halal untuk masuk e-Katalog Lokal belanja resmi kedinasan dan instansi pemerintah daerah.
                </p>
              </div>
              <Link
                to="/akses-bertumbuh"
                className="pt-3 font-bold text-xs text-[#D90816] hover:underline flex items-center gap-1"
              >
                <span>Peluang Belanja Dinas (B2G)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: PELATIHAN & EVENT TERDEKAT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pelatihan Box */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D90816]" />
                <h3 className="font-extrabold text-lg text-neutral-900">Pelatihan UMKM Terbuka</h3>
              </div>
              <Link to="/pelatihan" className="text-xs font-bold text-[#D90816] hover:underline">
                Lihat Semua &rarr;
              </Link>
            </div>
            <div className="space-y-4">
              {programs.slice(0, 2).map((prog) => (
                <div
                  key={prog.id}
                  className="p-4 rounded-2xl bg-[#FAF8F7] border border-neutral-200/80 flex flex-col sm:flex-row gap-4 items-start"
                >
                  <img
                    src={prog.image}
                    alt={prog.title}
                    className="w-full sm:w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#D90816]">
                      {prog.type}
                    </span>
                    <h4 className="font-bold text-sm text-neutral-900 leading-snug">{prog.title}</h4>
                    <p className="text-[11px] text-neutral-500">{prog.date} • {prog.location}</p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-neutral-500 text-[11px]">
                        Sisa kuota: <strong>{prog.quota - prog.registeredCount} kursi</strong>
                      </span>
                      <button
                        onClick={() => registerProgram(prog.id)}
                        className="px-3 py-1 rounded-full bg-neutral-900 text-white font-semibold text-[11px] hover:bg-neutral-800 transition"
                      >
                        Ikut Gratis
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Event & Agenda Box */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 space-y-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#D90816]" />
                <h3 className="font-extrabold text-lg text-neutral-900">Agenda Event Mendatang</h3>
              </div>
              <Link to="/event" className="text-xs font-bold text-[#D90816] hover:underline">
                Lihat Jadwal &rarr;
              </Link>
            </div>
            <div className="space-y-4">
              {events.slice(0, 2).map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-2xl bg-[#FAF8F7] border border-neutral-200/80 flex flex-col sm:flex-row gap-4 items-start"
                >
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full sm:w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {ev.category}
                    </span>
                    <h4 className="font-bold text-sm text-neutral-900 leading-snug">{ev.title}</h4>
                    <p className="text-[11px] text-neutral-500">{ev.date} • {ev.location}</p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-neutral-500">{ev.organizer}</span>
                      <Link
                        to="/event"
                        className="font-bold text-[11px] text-[#D90816] hover:underline flex items-center"
                      >
                        Detail Event &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: CTA DAFTAR MITRA DJOERAGAN NUSANTARA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D90816] to-[#A00610] text-white mx-auto flex items-center justify-center font-black text-2xl shadow-lg shadow-[#D90816]/30">
            DN
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Siap Bertumbuh Bersama Djoeragan Nusantara?
            </h2>
            <p className="text-sm text-neutral-600 max-w-xl mx-auto">
              Daftarkan diri Anda atau usaha UMKM Anda. Dapatkan pendampingan izin resmi, akses pelatihan gratis, dan perluasan pasar ke seluruh nusantara.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/daftar"
              className="px-8 py-3.5 rounded-full bg-[#D90816] text-white font-bold text-sm hover:bg-[#b80512] transition shadow-lg shadow-[#D90816]/25"
            >
              Daftar Jadi Anggota Sekarang
            </Link>
            <Link
              to="/sertifikasi-usaha"
              className="px-8 py-3.5 rounded-full border border-neutral-300 text-neutral-800 font-bold text-sm hover:border-neutral-900 transition"
            >
              Konsultasi Izin & Sertifikasi
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
