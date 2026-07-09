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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 px-6 overflow-y-auto">
      <div className="bg-white dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300 rounded-sm overflow-hidden">
        <div className="p-5 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/5 flex justify-between items-center px-8">
          <div className="flex items-center gap-4">
            <Shield className="w-6 h-6 text-cighra-primary dark:text-cighra-gold" />
            <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase text-lg">DETAIL DATA PERSONEL</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors text-xl">✕</button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="col-span-2 flex items-center gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
              <div className="w-20 h-20 bg-cighra-primary/10 dark:bg-cighra-gold/10 border-2 border-cighra-primary/30 dark:border-cighra-gold/30 flex items-center justify-center p-4">
                <Users className="w-10 h-10 text-cighra-primary dark:text-cighra-gold" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em]">{user.id}</p>
                <h4 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white uppercase tracking-wider">{user.name}</h4>
                <div className="inline-block bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-3 py-1 font-tactical font-bold text-xs tracking-[0.2em]">
                  {user.role.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">Security ID / Username</label>
              <p className="text-base font-mono font-bold text-slate-800 dark:text-slate-200">{user.username}</p>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">NRP / NIP Identification</label>
              <p className="text-base font-mono font-bold text-slate-800 dark:text-slate-200">{user.nrp_nip || '-'}</p>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">WhatsApp Communication</label>
              <p className="text-base font-mono font-bold text-slate-800 dark:text-slate-200">+{user.no_wa || '-'}</p>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">Email Contact</label>
              <p className="text-base font-mono font-bold text-slate-800 dark:text-slate-200 lowercase">{user.email || '-'}</p>
            </div>
            <div className="col-span-2 space-y-1">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">Military Unit / Assignment</label>
              <p className="text-base font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">{user.asal_satuan || '-'}</p>
            </div>
            <div className="col-span-2 space-y-3 pt-4">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">Technical Specialization</label>
              <div className={`p-4 bg-slate-50 dark:bg-cighra-darkcard border ${user.role !== 'Teknisi' ? 'border-slate-200 dark:border-slate-800 italic text-slate-400' : 'border-cighra-gold/20 text-slate-800 dark:text-blue-400'}`}>
                <p className="font-mono font-bold text-sm">
                  {user.role === 'Teknisi' ? (user.spesialisasi || 'PENDING SPECIFICATION...') : 'FIELD ACCESS: NON-TECHNICAL PERSONNEL'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-cighra-primary dark:bg-cighra-darkcard text-white px-12 py-3.5 font-tactical font-bold tracking-[0.2em] hover:bg-slate-700 dark:hover:bg-slate-800 border border-slate-700 transition-all uppercase shadow-lg active:scale-95"
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

