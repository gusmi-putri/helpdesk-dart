import React from 'react';
import { Shield, Users } from 'lucide-react';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-lg shadow-[0_0_50px_rgba(75,83,32,0.4)]">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cighra-primary dark:text-cighra-gold" />
            <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase">DETAIL DATA PERSONEL</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-cighra-primary dark:text-cighra-gold">✕</button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div className="col-span-2 flex items-center gap-4 mb-4 pb-4 border-b border-slate-200 dark:border-slate-600/50">
              <div className="w-16 h-16 bg-cighra-primary/20 dark:bg-cighra-gold/20 border border-cighra-primary dark:border-cighra-gold flex items-center justify-center">
                <Users className="w-8 h-8 text-cighra-primary dark:text-cighra-gold" />
              </div>
              <div>
                <p className="text-xs font-mono text-slate-500 uppercase tracking-tighter">{user.id}</p>
                <h4 className="text-xl font-bold text-slate-800 dark:text-white uppercase">{user.name}</h4>
                <span className="text-[10px] font-mono bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-2 py-0.5 tracking-widest">{user.role.toUpperCase()}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 mb-1 tracking-widest uppercase">Username</label>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-white">{user.username}</p>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 mb-1 tracking-widest uppercase">NRP / NIP</label>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-white">{user.nrp_nip || '-'}</p>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 mb-1 tracking-widest uppercase">No. WhatsApp</label>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-white">{user.no_wa || '-'}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 mb-1 tracking-widest uppercase">Email</label>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-white lowercase">{user.email || '-'}</p>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 mb-1 tracking-widest uppercase">Asal Satuan</label>
              <p className="text-sm font-mono font-bold text-slate-800 dark:text-white uppercase">{user.asal_satuan || '-'}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 mb-1 tracking-widest uppercase">Spesialisasi</label>
              <p className={`text-sm font-mono font-bold p-2 bg-gray-200 dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600/50 ${user.role !== 'Teknisi' ? 'text-slate-500 italic' : 'text-gunmetal dark:text-blue-400'}`}>
                {user.role === 'Teknisi' ? (user.spesialisasi || 'BELUM DIATUR') : 'TIDAK TERSEDIA (NON-TEKNISI)'}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-600/50 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gunmetal dark:bg-cighra-darkcard text-white px-8 py-2 font-tactical font-bold tracking-widest hover:bg-slate-700 transition-colors border border-slate-500"
            >
              TUTUP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
