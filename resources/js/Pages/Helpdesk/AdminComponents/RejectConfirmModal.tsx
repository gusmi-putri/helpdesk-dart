import React from 'react';
import { UserX, ShieldAlert } from 'lucide-react';

interface RejectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}

const RejectConfirmModal: React.FC<RejectConfirmModalProps> = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-50 dark:bg-gunmetal border-2 border-targetred w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-targetred bg-targetred/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-targetred tracking-widest uppercase flex items-center gap-2">
            <UserX className="w-5 h-5" /> KONFIRMASI PENOLAKAN
          </h3>
          <button onClick={onClose} className="text-slate-600 hover:text-targetred transition-colors font-bold text-xl">✕</button>
        </div>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-targetred/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-targetred/30">
            <ShieldAlert className="w-8 h-8 text-targetred animate-pulse" />
          </div>
          <h4 className="text-lg font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase mb-2">
            TOLAK PENDAFTARAN?
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
            Pendaftaran atas nama <strong className="text-targetred">{userName}</strong> akan ditolak dan dihapus secara permanen dari sistem.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-300 font-mono mt-3 uppercase tracking-wider">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="p-6 grid grid-cols-2 gap-3 bg-black/5 dark:bg-navy/80">
          <button
            onClick={onConfirm}
            className="bg-targetred text-sand py-3 font-tactical font-bold tracking-widest hover:bg-[#8B152A] transition-all flex items-center justify-center gap-2 shadow-lg uppercase"
          >
            <UserX className="w-4 h-4" /> YA, TOLAK
          </button>
          <button
            onClick={onClose}
            className="bg-transparent border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300 py-3 font-tactical font-bold tracking-widest hover:bg-soft-gunmetal/10 dark:hover:bg-soft-sand/5 transition-all uppercase"
          >
            BATALKAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectConfirmModal;
