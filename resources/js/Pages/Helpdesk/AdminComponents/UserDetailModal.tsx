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
      <div className="bg-sand dark:bg-gunmetal border-2 border-olive w-full max-w-lg shadow-[0_0_50px_rgba(75,83,32,0.4)]">
        <div className="p-4 border-b border-olive bg-olive/10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-olive" />
            <h3 className="font-tactical font-bold text-olive tracking-widest uppercase">DETAIL DATA PERSONEL</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-targetred">✕</button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8">
            <div className="col-span-2 flex items-center gap-4 mb-4 pb-4 border-b border-gray-300 dark:border-gray-800">
              <div className="w-16 h-16 bg-olive/20 border border-olive flex items-center justify-center">
                <Users className="w-8 h-8 text-olive" />
              </div>
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-tighter">{user.id}</p>
                <h4 className="text-xl font-bold text-gunmetal dark:text-white uppercase">{user.name}</h4>
                <span className="text-[10px] font-mono bg-olive text-white px-2 py-0.5 tracking-widest">{user.role.toUpperCase()}</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-1 tracking-widest uppercase">Username</label>
              <p className="text-sm font-mono font-bold text-gunmetal dark:text-white">{user.username}</p>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-1 tracking-widest uppercase">NRP / NIP</label>
              <p className="text-sm font-mono font-bold text-gunmetal dark:text-white">{user.nrp_nip || '-'}</p>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-1 tracking-widest uppercase">No. WhatsApp</label>
              <p className="text-sm font-mono font-bold text-gunmetal dark:text-white">{user.no_wa || '-'}</p>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-1 tracking-widest uppercase">Asal Satuan</label>
              <p className="text-sm font-mono font-bold text-gunmetal dark:text-white uppercase">{user.asal_satuan || '-'}</p>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-mono text-gray-500 dark:text-gray-500 mb-1 tracking-widest uppercase">Spesialisasi</label>
              <p className={`text-sm font-mono font-bold p-2 bg-gray-200 dark:bg-black/40 border border-gray-300 dark:border-gray-800 ${user.role !== 'Teknisi' ? 'text-gray-500 italic' : 'text-gunmetal dark:text-blue-400'}`}>
                {user.role === 'Teknisi' ? (user.spesialisasi || 'BELUM DIATUR') : 'TIDAK TERSEDIA (NON-TEKNISI)'}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-300 dark:border-gray-800 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gunmetal dark:bg-black text-white px-8 py-2 font-tactical font-bold tracking-widest hover:bg-gray-800 transition-colors border border-gray-600"
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
