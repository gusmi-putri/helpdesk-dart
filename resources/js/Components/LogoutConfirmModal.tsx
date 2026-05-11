import React from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-50 dark:bg-gunmetal border-2 border-targetred w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-targetred bg-targetred/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-targetred tracking-widest uppercase flex items-center gap-2">
            <LogOut className="w-5 h-5" /> KONFIRMASI KELUAR
          </h3>
          <button onClick={onClose} className="text-slate-600 hover:text-targetred transition-colors font-bold text-xl">✕</button>
        </div>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-targetred/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-targetred/30">
            <ShieldAlert className="w-8 h-8 text-targetred animate-pulse" />
          </div>
          <h4 className="text-lg font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase mb-2">
            APAKAH ANDA YAKIN?
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-300 font-mono uppercase leading-relaxed">
            Sesi Anda akan dihentikan dan Anda harus masuk kembali untuk mengakses Command Center.
          </p>
        </div>

        <div className="p-6 grid grid-cols-2 gap-3 bg-black/5">
          <button
            onClick={onConfirm}
            className="bg-targetred text-sand py-3 font-tactical font-bold tracking-widest hover:bg-[#8B152A] transition-all flex items-center justify-center gap-2 shadow-lg uppercase"
          >
            YA, KELUAR
          </button>
          <button
            onClick={onClose}
            className="bg-transparent border border-soft-gunmetal/20 text-slate-500 py-3 font-tactical font-bold tracking-widest hover:bg-soft-gunmetal/10 transition-all uppercase"
          >
            BATALKAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
