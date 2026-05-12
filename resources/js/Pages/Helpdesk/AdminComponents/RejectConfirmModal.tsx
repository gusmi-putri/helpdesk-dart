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
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2">
            <UserX className="w-5 h-5" /> KONFIRMASI PENOLAKAN
          </h3>
          <button onClick={onClose} className="text-slate-600 hover:text-cighra-primary dark:text-cighra-gold transition-colors font-bold text-xl">✕</button>
        </div>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-cighra-primary/10 dark:bg-cighra-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-cighra-primary dark:border-cighra-gold/30">
            <ShieldAlert className="w-8 h-8 text-cighra-primary dark:text-cighra-gold animate-pulse" />
          </div>
          <h4 className="text-lg font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase mb-2">
            TOLAK PENDAFTARAN?
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-mono leading-relaxed">
            Pendaftaran atas nama <strong className="text-cighra-primary dark:text-cighra-gold">{userName}</strong> akan ditolak dan dihapus secara permanen dari sistem.
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-300 font-mono mt-3 uppercase tracking-wider">
            Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="p-6 grid grid-cols-2 gap-3 bg-black/5 dark:bg-cighra-darkcard/80">
          <button
            onClick={onConfirm}
            className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white py-3 font-tactical font-bold tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-all flex items-center justify-center gap-2 shadow-lg uppercase"
          >
            <UserX className="w-4 h-4" /> YA, TOLAK
          </button>
          <button
            onClick={onClose}
            className="bg-transparent border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300 py-3 font-tactical font-bold tracking-widest hover:bg-slate-600/10 dark:hover:bg-soft-sand/5 transition-all uppercase"
          >
            BATALKAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectConfirmModal;
