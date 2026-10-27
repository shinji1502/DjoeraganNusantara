import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bg = 'bg-[#171717] text-white border-neutral-700';
        let icon = <Info className="w-5 h-5 text-blue-400 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-white text-neutral-900 border-emerald-500 shadow-xl';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
        } else if (toast.type === 'error') {
          bg = 'bg-white text-neutral-900 border-rose-500 shadow-xl';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />;
        } else if (toast.type === 'info') {
          bg = 'bg-[#171717] text-white border-neutral-700 shadow-xl';
          icon = <Info className="w-5 h-5 text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border-l-4 shadow-lg transition-all transform translate-y-0 opacity-100 ${bg}`}
          >
            {icon}
            <div className="flex-1 text-sm leading-snug font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-700 transition shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
