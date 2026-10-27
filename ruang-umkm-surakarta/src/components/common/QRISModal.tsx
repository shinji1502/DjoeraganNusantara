import React, { useState, useEffect } from 'react';
import { X, QrCode, CheckCircle, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { formatRupiah } from '../../utils/formatters';

interface QRISModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateSuccess: () => void;
  amount: number;
  merchantName: string;
  orderNumber: string;
}

export const QRISModal: React.FC<QRISModalProps> = ({
  isOpen,
  onClose,
  onSimulateSuccess,
  amount,
  merchantName,
  orderNumber,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(899); // 15 mins
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const remainingSeconds = secondsLeft % 60;
  const timerFormatted = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;

  const handlePayNow = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSimulateSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-neutral-200 overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-[#171717] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wider text-sm text-[#ff4d5a]">QRIS</span>
            <span className="text-neutral-400 text-xs">| Standar Pembayaran Nasional</span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition p-1 rounded-full hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 text-center">
          {/* Merchant Info */}
          <div className="mb-4">
            <h4 className="font-bold text-base text-neutral-900">{merchantName}</h4>
            <p className="text-xs text-neutral-500 mt-0.5">NMID: ID1020268899120 • Ref: {orderNumber}</p>
            <div className="mt-3 py-2 px-4 rounded-xl bg-[#FAF8F7] border border-neutral-200 inline-block">
              <span className="text-xs text-neutral-500 block">Total Tagihan:</span>
              <span className="text-2xl font-extrabold text-[#D90816]">
                {formatRupiah(amount)}
              </span>
            </div>
          </div>

          {/* QR Code Graphic Display */}
          <div className="relative inline-block p-4 bg-white rounded-2xl border-2 border-neutral-900 shadow-md my-1">
            {/* Realistic stylized QR Code SVG */}
            <svg
              className="w-52 h-52 mx-auto"
              viewBox="0 0 200 200"
              fill="currentColor"
            >
              {/* Corner squares (Position markers) */}
              <rect x="10" y="10" width="50" height="50" rx="6" fill="#171717" />
              <rect x="18" y="18" width="34" height="34" rx="3" fill="#ffffff" />
              <rect x="25" y="25" width="20" height="20" rx="2" fill="#D90816" />

              <rect x="140" y="10" width="50" height="50" rx="6" fill="#171717" />
              <rect x="148" y="18" width="34" height="34" rx="3" fill="#ffffff" />
              <rect x="155" y="25" width="20" height="20" rx="2" fill="#D90816" />

              <rect x="10" y="140" width="50" height="50" rx="6" fill="#171717" />
              <rect x="18" y="148" width="34" height="34" rx="3" fill="#ffffff" />
              <rect x="25" y="155" width="20" height="20" rx="2" fill="#D90816" />

              {/* Data pattern blocks */}
              <rect x="70" y="15" width="10" height="10" fill="#171717" />
              <rect x="90" y="15" width="20" height="10" fill="#171717" />
              <rect x="120" y="15" width="10" height="10" fill="#171717" />
              <rect x="70" y="35" width="20" height="10" fill="#171717" />
              <rect x="100" y="35" width="10" height="10" fill="#171717" />
              <rect x="120" y="35" width="15" height="10" fill="#171717" />

              <rect x="15" y="70" width="10" height="15" fill="#171717" />
              <rect x="35" y="70" width="25" height="10" fill="#171717" />
              <rect x="70" y="70" width="15" height="15" fill="#171717" />
              <rect x="95" y="70" width="10" height="10" fill="#171717" />
              <rect x="115" y="70" width="25" height="10" fill="#171717" />
              <rect x="150" y="70" width="10" height="20" fill="#171717" />
              <rect x="170" y="70" width="15" height="10" fill="#171717" />

              <rect x="15" y="95" width="20" height="10" fill="#171717" />
              <rect x="45" y="95" width="15" height="15" fill="#171717" />
              <rect x="70" y="95" width="20" height="10" fill="#171717" />
              <rect x="110" y="95" width="20" height="15" fill="#171717" />
              <rect x="140" y="95" width="15" height="10" fill="#171717" />
              <rect x="165" y="95" width="20" height="10" fill="#171717" />

              <rect x="15" y="115" width="15" height="15" fill="#171717" />
              <rect x="40" y="120" width="10" height="10" fill="#171717" />
              <rect x="65" y="115" width="25" height="15" fill="#171717" />
              <rect x="100" y="120" width="10" height="10" fill="#171717" />
              <rect x="120" y="115" width="15" height="10" fill="#171717" />
              <rect x="150" y="120" width="35" height="10" fill="#171717" />

              <rect x="70" y="145" width="10" height="20" fill="#171717" />
              <rect x="90" y="145" width="20" height="10" fill="#171717" />
              <rect x="120" y="145" width="15" height="25" fill="#171717" />
              <rect x="145" y="145" width="10" height="10" fill="#171717" />
              <rect x="165" y="145" width="20" height="15" fill="#171717" />

              <rect x="70" y="175" width="25" height="10" fill="#171717" />
              <rect x="105" y="170" width="10" height="15" fill="#171717" />
              <rect x="145" y="170" width="30" height="15" fill="#171717" />

              {/* Center Indonesian QRIS Emblem */}
              <circle cx="100" cy="100" r="16" fill="#D90816" />
              <text x="100" y="104" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">QR</text>
            </svg>

            {/* Timer countdown badge */}
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-neutral-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Kedaluwarsa dalam: <strong className="text-neutral-900">{timerFormatted}</strong></span>
            </div>
          </div>

          {/* Supported Wallets info */}
          <div className="my-3 text-xs text-neutral-500">
            Dapat dipindai dari BCA Mobile, Livin Mandiri, BRImo, BNI+, GoPay, OVO, DANA, ShopeePay & LinkAja.
          </div>

          {/* Simulation disclaimer badge */}
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl text-xs flex items-start gap-2 text-left mb-4">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Simulasi MVP:</strong> Ini adalah simulasi alur pembayaran QRIS tanpa memotong saldo perbankan nyata Anda.
            </span>
          </div>

          {/* Action Simulation Button */}
          <button
            onClick={handlePayNow}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#D90816] text-white font-bold text-sm hover:bg-[#b80512] transition shadow-lg shadow-[#D90816]/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Memverifikasi Pembayaran...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Simulasikan Pembayaran Berhasil
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
