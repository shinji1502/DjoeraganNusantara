import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, Shield, ShoppingBag, Store, RotateCcw, ChevronDown, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemoRoleSwitcher: React.FC = () => {
  const { currentUser, switchRole, resetToDefaultData } = useApp();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleSwitch = (role: 'pembeli' | 'penjual' | 'admin', targetUrl: string) => {
    switchRole(role);
    navigate(targetUrl);
    setIsOpen(false);
  };

  return (
    <div className="bg-[#171717] text-white text-xs border-b border-neutral-800 px-3 sm:px-4 lg:px-6 xl:px-8 py-2">
      <div className="w-full max-w-[1680px] mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Info Demo */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D90816]/20 text-[#ff4d5a] font-semibold text-[10.5px] sm:text-[11px] border border-[#D90816]/30">
            <Sparkles className="w-3 h-3 text-[#ff4d5a]" />
            PROTOTYPE MVP SIMULASI
          </span>
          <span className="text-neutral-400 hidden sm:inline text-xs">
            Pengguna: <strong className="text-white font-medium">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
            {currentUser.role === 'penjual' && (
              <span className={`ml-1.5 px-2 py-0.2 rounded-full text-[10px] font-bold ${
                currentUser.isVerified ? 'bg-emerald-900/80 text-emerald-300' : 'bg-amber-900/80 text-amber-300'
              }`}>
                {currentUser.isVerified ? '✓ Approved' : '⏳ Waiting Verification'}
              </span>
            )}
          </span>
        </div>

        {/* Right: Quick Role Switcher Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-neutral-400 text-[11px] hidden lg:inline">Ganti Peran:</span>
          
          <div className="flex items-center gap-1 bg-neutral-900/90 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => handleSwitch('pembeli', '/pembeli/dashboard')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition font-medium text-xs ${
                currentUser.role === 'pembeli'
                  ? 'bg-[#D90816] text-white shadow'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
              title="Masuk sebagai Pembeli Demo"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Pembeli</span>
            </button>

            <button
              onClick={() => {
                if (currentUser.role === 'penjual') {
                  // Toggle between Approved and Pending for quick testing
                  navigate(currentUser.isVerified ? '/penjual/dashboard' : '/menunggu-verifikasi');
                } else {
                  handleSwitch('penjual', '/penjual/dashboard');
                }
              }}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition font-medium text-xs ${
                currentUser.role === 'penjual'
                  ? 'bg-[#D90816] text-white shadow'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
              title="Masuk sebagai Penjual UMKM Demo"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Penjual</span>
            </button>

            <button
              onClick={() => handleSwitch('admin', '/admin/dashboard')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-md transition font-medium text-xs ${
                currentUser.role === 'admin'
                  ? 'bg-[#D90816] text-white shadow'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
              title="Masuk sebagai Admin Diskop UKM Demo"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset semua data mock & keranjang kembali ke kondisi default?')) {
                resetToDefaultData();
              }
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800 transition text-xs"
            title="Reset Data Mock"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
