import React from 'react';
import { Shield, Users } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="DETAIL DATA PERSONEL"
      icon={<Shield />}
      maxWidth="2xl"
      headerColor="primary"
      footer={
        <div className="w-full flex justify-end">
          <Button variant="secondary" onClick={onClose} className="uppercase" size="md">
            TUTUP
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <div className="col-span-2 flex items-center gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-cighra-primary/10 dark:bg-cighra-gold/10 border-2 border-cighra-primary/30 dark:border-cighra-gold/30 flex items-center justify-center p-4">
              <Users className="w-10 h-10 text-cighra-primary dark:text-cighra-gold" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-mono text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em]">{user.id}</p>
              <h4 className="text-xl font-tactical font-bold text-slate-800 dark:text-white uppercase tracking-wider">{user.name}</h4>
              <div className="inline-block bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-3 py-1 font-tactical font-bold text-xs tracking-[0.2em]">
                {user.role.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="p-4 bg-cighra-primary/5 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 space-y-1">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">Security ID / Username</label>
            <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{user.username}</p>
          </div>
          <div className="p-4 bg-cighra-primary/5 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 space-y-1">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">NRP / NIP Identification</label>
            <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">{user.nrp_nip || '-'}</p>
          </div>
          <div className="p-4 bg-cighra-primary/5 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 space-y-1">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">WhatsApp Communication</label>
            <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200">+{user.no_wa || '-'}</p>
          </div>
          <div className="p-4 bg-cighra-primary/5 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 space-y-1">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">Email Contact</label>
            <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 lowercase">{user.email || '-'}</p>
          </div>
          <div className="col-span-1 md:col-span-2 p-4 bg-cighra-primary/5 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 space-y-1">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">Military Unit / Assignment</label>
            <p className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">{user.asal_satuan || '-'}</p>
          </div>
          <div className="col-span-2 space-y-3 pt-4">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">Technical Specialization</label>
            <div className={`p-4 bg-cighra-primary/5 dark:bg-cighra-darkcard border ${user.role !== 'Teknisi' ? 'border-slate-200 dark:border-slate-800 italic text-slate-400' : 'border-cighra-gold/20 text-slate-800 dark:text-blue-400'}`}>
              <p className="font-mono font-bold text-sm">
                {user.role === 'Teknisi' ? (user.spesialisasi || 'PENDING SPECIFICATION...') : 'FIELD ACCESS: NON-TECHNICAL PERSONNEL'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  );
};

export default UserDetailModal;

