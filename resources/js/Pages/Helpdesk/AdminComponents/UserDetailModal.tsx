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

  const formatPermissionName = (name: string) => {
    const mapping: { [key: string]: string } = {
      'view-dashboard-admin': 'Dashboard Admin',
      'view-dashboard-staf': 'Dashboard Staf',
      'view-dashboard-teknisi': 'Dashboard Teknisi',
      'view-dashboard-pelapor': 'Dashboard Pelapor',
      'manage-users': 'Kelola Personel',
      'manage-units': 'Kelola Unit DART',
      'manage-satuans': 'Kelola Satuan',
      'manage-reports': 'Kelola Laporan',
      'view-logs': 'Lihat Log Sistem',
    };
    return mapping[name] || name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

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
              <div className="flex gap-2 items-center flex-wrap">
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map((r: string, idx: number) => (
                    <div key={idx} className="inline-block bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-3 py-1 font-tactical font-bold text-xs tracking-[0.2em]">
                      {r.toUpperCase()}
                    </div>
                  ))
                ) : (
                  <div className="inline-block bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-3 py-1 font-tactical font-bold text-xs tracking-[0.2em]">
                    {user.role ? user.role.toUpperCase() : 'NO ROLE'}
                  </div>
                )}
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

          <div className="col-span-2 space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">Hak Akses Tambahan (Permissions)</label>
            {user.permissions && user.permissions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(() => {
                  const grouped: { [key: string]: string[] } = {};
                  user.permissions.forEach((perm: string) => {
                    const parts = perm.split('-');
                    const action = parts[0];
                    const module = parts.slice(1).join('-');
                    if (!grouped[module]) grouped[module] = [];
                    grouped[module].push(action);
                  });
                  return Object.keys(grouped).map((module, idx) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 p-3 rounded-sm">
                      <h4 className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 capitalize mb-2 pb-1 border-b border-slate-200 dark:border-slate-700">
                        {module.replace('-', ' ')}
                      </h4>
                      <div className="flex gap-1.5 flex-wrap">
                        {grouped[module].map((act, i) => (
                          <span key={i} className="inline-flex items-center gap-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded text-[10px] font-mono text-slate-600 dark:text-slate-300">
                            <span className="w-1 h-1 rounded-full bg-cighra-primary dark:bg-cighra-gold"></span>
                            <span className="uppercase">{act}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <p className="text-xs font-mono text-slate-500 italic">Tidak ada hak akses tambahan khusus yang diberikan.</p>
            )}
          </div>

          <div className="col-span-2 space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
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

