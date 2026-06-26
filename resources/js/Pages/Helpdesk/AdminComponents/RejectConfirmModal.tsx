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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 px-6 overflow-y-auto">
      <div className="bg-white dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-lg shadow-[0_0_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300 rounded-sm overflow-hidden text-center">
        <div className="p-5 border-b border-cighra-primary dark:border-cighra-gold bg-red-500/10 dark:bg-red-900/10 flex items-center justify-center gap-4 px-8 shrink-0">
          <UserX className="w-8 h-8 text-red-500 animate-pulse" />
          <h3 className="font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase text-xl">KONFIRMASI PENOLAKAN AKSES</h3>
        </div>

        <div className="p-10 space-y-8">
          <div className="space-y-4">
            <h4 className="text-xl font-tactical font-bold text-slate-800 dark:text-white tracking-[0.2em] uppercase">
                TOLAK PENDAFTARAN PERSONIL?
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-mono leading-relaxed uppercase tracking-wider">
                PENDAFTARAN ATAS NAMA <strong className="text-red-500 font-bold underline decoration-2 underline-offset-4">{userName}</strong> AKAN DITOLAK DAN DIHAPUS SECARA PERMANEN DARI LOG SISTEM.
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <button
                onClick={onConfirm}
                className="flex-[2] bg-red-600 hover:bg-red-700 text-white p-4 font-tactical font-bold tracking-widest transition-all shadow-xl active:scale-95 uppercase flex items-center justify-center gap-2"
            >
                <UserX className="w-5 h-5" /> YA, TOLAK AKSES
            </button>
            <button
                onClick={onClose}
                className="flex-1 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 p-4 font-tactical font-bold tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase"
            >
                BATAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectConfirmModal;

