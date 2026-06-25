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
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-sm shadow-[0_0_50px_rgba(200,30,30,0.4)] animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-cighra-primary dark:text-cighra-gold animate-pulse" />
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase">
            {isPengajuan ? 'PENGAJUAN PENGHAPUSAN' : 'KONFIRMASI PENGHAPUSAN'}
          </h3>
        </div>
        <div className="p-6">
          <p className="text-sm font-mono text-slate-600 dark:text-slate-300 leading-relaxed uppercase">
            {isPengajuan 
              ? <>PERINGATAN: Anda akan mengajukan penghapusan akses personil <span className="text-cighra-primary dark:text-cighra-gold font-bold underline">{user.name}</span>. Pengajuan ini akan diteruskan ke Admin untuk disetujui.</>
              : <>PERINGATAN: Anda akan menghapus akses personil <span className="text-cighra-primary dark:text-cighra-gold font-bold underline">{user.name}</span> dari basis data sistem utama. Tindakan ini tidak dapat dibatalkan.</>}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              onClick={onConfirm}
              className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white py-2 font-tactical font-bold tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-all shadow-[0_0_15px_rgba(200,30,30,0.3)]"
            >
              {isPengajuan ? 'AJUKAN PENGHAPUSAN' : 'HAPUS AKSES'}
            </button>
            <button
              onClick={onClose}
              className="bg-transparent border border-gray-500 text-slate-500 py-2 font-tactical font-bold tracking-widest hover:bg-gray-500/10 transition-all"
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
