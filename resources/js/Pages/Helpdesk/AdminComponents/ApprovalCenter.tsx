import React, { useState } from 'react';
import { CheckSquare, Users, Package, MapPin } from 'lucide-react';
import ApprovalTable from './ApprovalTable';
import MutationApproval from './MutationApproval';
import { useStore } from '@/store/useStore';
import { router } from '@inertiajs/react';

interface ApprovalCenterProps {
  dbUsers: any[];
  dbMutations: any[];
  dbSatuans: any[];
  dbArchivedUnits: any[];
  handleApproveUser: (user: any) => void;
  handleRejectUser: (user: any) => void;
}

const ApprovalCenter: React.FC<ApprovalCenterProps> = ({
  dbUsers,
  dbMutations,
  dbSatuans,
  dbArchivedUnits,
  handleApproveUser,
  handleRejectUser
}) => {
  const [activeTab, setActiveTab] = useState<'PERSONEL' | 'INVENTARIS' | 'SATUAN'>('PERSONEL');
  const addNotification = useStore(state => state.addNotification);

  const pendingPersonelCount = dbUsers.filter((u: any) => !u.is_approved).length;
  const pendingMutationsCount = dbMutations.filter((m: any) => m.status === 'pending').length;
  const pendingSatuans = dbSatuans.filter((s: any) => s.pending_action !== null);
  const pendingSatuansCount = pendingSatuans.length;

  // `handleApproveUser` and `handleRejectUser` are now passed down via props

  const handleApproveSatuan = (satuan: any) => {
    router.post(`/satuans/${satuan.id}/approve`, {}, {
      onSuccess: () => addNotification('Satuan berhasil disetujui.')
    });
  };

  const handleRejectSatuan = (satuan: any) => {
    router.post(`/satuans/${satuan.id}/reject`, {}, {
      onSuccess: () => addNotification('Satuan ditolak.')
    });
  };

  return (
    <div className="animate-in fade-in relative mt-6 space-y-4">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-slate-800 dark:text-white font-tactical font-bold text-xl tracking-widest uppercase">
            PUSAT PERSETUJUAN
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-mono mt-1 uppercase">Beranda / Pusat Persetujuan / <span className="text-cighra-primary dark:text-cighra-gold">{activeTab}</span></p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('PERSONEL')}
          className={`flex-1 py-4 px-6 text-sm font-tactical tracking-widest uppercase transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'PERSONEL'
              ? 'border-cighra-primary dark:border-cighra-gold text-cighra-primary dark:text-cighra-gold bg-white dark:bg-slate-800/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/30'
          }`}
        >
          <Users className="w-4 h-4" /> PERSONEL
          {pendingPersonelCount > 0 && (
            <span className="bg-cighra-gold text-slate-900 font-bold text-[10px] px-1.5 py-0.5 rounded-full ml-1">{pendingPersonelCount}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('INVENTARIS')}
          className={`flex-1 py-4 px-6 text-sm font-tactical tracking-widest uppercase transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'INVENTARIS'
              ? 'border-cighra-primary dark:border-cighra-gold text-cighra-primary dark:text-cighra-gold bg-white dark:bg-slate-800/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/30'
          }`}
        >
          <Package className="w-4 h-4" /> INVENTARIS
          {pendingMutationsCount > 0 && (
            <span className="bg-cighra-gold text-slate-900 font-bold text-[10px] px-1.5 py-0.5 rounded-full ml-1">{pendingMutationsCount}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('SATUAN')}
          className={`flex-1 py-4 px-6 text-sm font-tactical tracking-widest uppercase transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'SATUAN'
              ? 'border-cighra-primary dark:border-cighra-gold text-cighra-primary dark:text-cighra-gold bg-white dark:bg-slate-800/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/30'
          }`}
        >
          <MapPin className="w-4 h-4" /> SATUAN KERJA
          {pendingSatuansCount > 0 && (
            <span className="bg-cighra-gold text-slate-900 font-bold text-[10px] px-1.5 py-0.5 rounded-full ml-1">{pendingSatuansCount}</span>
          )}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'PERSONEL' && (
          <ApprovalTable
            dbUsers={dbUsers}
            handleApproveUser={handleApproveUser}
            handleRejectUser={handleRejectUser}
          />
        )}
        {activeTab === 'INVENTARIS' && (
          <MutationApproval dbMutations={dbMutations} dbArchivedUnits={dbArchivedUnits} />
        )}
        {activeTab === 'SATUAN' && (
          <div className="animate-in fade-in relative bg-white dark:bg-cighra-darkcard/50 rounded-md">
              <table className="w-full text-left font-sans text-sm">
                <thead className="border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-transparent text-slate-600 dark:text-slate-400 font-tactical tracking-widest text-xs">
                  <tr>
                    <th className="p-4 uppercase">SATUAN KERJA</th>
                    <th className="p-4 uppercase">JENIS PENGAJUAN</th>
                    <th className="p-4 uppercase">DETAIL PERUBAHAN</th>
                    <th className="p-4 text-right uppercase">AKSI VERIFIKASI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300 dark:divide-gray-800 bg-transparent">
                {pendingSatuans.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center text-slate-500 italic font-mono uppercase tracking-widest">
                      Tidak ada pengajuan persetujuan Satuan Kerja.
                    </td>
                  </tr>
                ) : pendingSatuans.map((satuan: any) => (
                  <tr key={satuan.id} className="hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors group">
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-300 font-bold">{satuan.nama_satuan}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[10px] font-mono font-bold border rounded-sm uppercase ${
                        satuan.pending_action === 'create' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                        satuan.pending_action === 'edit' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                        'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                      }`}>
                        {satuan.pending_action === 'create' ? 'Tambah' : satuan.pending_action === 'edit' ? 'Edit' : 'Hapus'}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      {satuan.pending_action === 'edit' && satuan.pending_changes ? (
                        <div className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(satuan.pending_changes), null, 2)}</div>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="p-4 flex gap-3 justify-end items-center h-full mt-2">
                      <button onClick={() => handleApproveSatuan(satuan)} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 text-[10px] font-tactical font-bold tracking-widest transition-all shadow-lg">
                        <CheckSquare className="w-4 h-4" /> SETUJUI
                      </button>
                      <button onClick={() => handleRejectSatuan(satuan)} className="flex items-center gap-2 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-4 py-2 text-[10px] font-tactical font-bold tracking-widest transition-all shadow-lg">
                        <CheckSquare className="w-4 h-4" /> TOLAK
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalCenter;
