import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: any;
  isPengajuan?: boolean;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ isOpen, onClose, onConfirm, user, isPengajuan }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 px-6 overflow-y-auto">
      <div className="bg-white dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-lg shadow-[0_0_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300 rounded-sm overflow-hidden text-center">
        <div className="p-5 border-b border-cighra-primary dark:border-cighra-gold bg-red-500/10 dark:bg-red-900/10 flex items-center justify-center gap-4">
          <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
          <h3 className="font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase text-xl">
            {isPengajuan ? 'AJUKAN PENGHAPUSAN' : 'KONFIRMASI PENGHAPUSAN'}
          </h3>
        </div>
        <div className="p-10 space-y-8">
          <p className="text-sm font-mono text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-wider">
            {isPengajuan 
              ? <>SISTEM MENDETEKSI PERMINTAAN PENGHAPUSAN AKSES UNTUK: <span className="text-cighra-primary dark:text-cighra-gold font-bold underline decoration-2 underline-offset-4">{user.name}</span>. DATA AKAN DIARSIPKAN JIKA ADMIN MENYETUJUI.</>
              : <>PERINGATAN TINGKAT TINGGI: ANDA AKAN MENGHAPUS DATA PERSONEL <span className="text-red-500 font-bold underline decoration-2 underline-offset-4">{user.name}</span> SECARA PERMANEN DARI SISTEM UTAMA DART.</>}
          </p>
          <div className="pt-2 flex gap-4">
            <button
              onClick={onConfirm}
              className="flex-[2] bg-red-600 hover:bg-red-700 text-white p-4 font-tactical font-bold tracking-widest transition-all shadow-xl active:scale-95 uppercase"
            >
              {isPengajuan ? 'SETUJU & AJUKAN' : 'HAPUS PERMANEN'}
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

export default UserDeleteModal;

