import React, { useState } from 'react';
import { CheckSquare, Users, Package, MapPin } from 'lucide-react';
import ApprovalTable from './ApprovalTable';
import MutationApproval from './MutationApproval';
import { useStore } from '@/store/useStore';
import { router } from '@inertiajs/react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';
import { Badge } from '@/Components/ui/Badge';

interface ApprovalCenterProps {
  dbUsers: any[];
  dbMutations: any[];
  dbUserMutations: any[];
  dbSatuans: any[];
  dbArchivedUnits: any[];
  handleApproveUser: (user: any) => void;
  handleRejectUser: (user: any) => void;
}

const ApprovalCenter: React.FC<ApprovalCenterProps> = ({
  dbUsers = [],
  dbMutations,
  dbUserMutations = [],
  dbSatuans,
  dbArchivedUnits,
  handleApproveUser: originalHandleApproveUser,
  handleRejectUser: originalHandleRejectUser
}) => {
  const [activeTab, setActiveTab] = useState<'PERSONEL' | 'INVENTARIS' | 'SATUAN'>('PERSONEL');
  const addNotification = useStore(state => state.addNotification);

  const pendingPersonelCount = dbUserMutations.filter((m: any) => m.status === 'pending').length;
  const pendingMutationsCount = dbMutations.filter((m: any) => m.status === 'pending').length;
  const pendingSatuans = dbSatuans.filter((s: any) => s.pending_action !== null);
  const pendingSatuansCount = pendingSatuans.length;
  
  const { sortedItems: sortedPendingSatuans, sortConfig: satuanSortConfig, handleSort: handleSatuanSort } = useTableSort(pendingSatuans, { key: 'nama_satuan', direction: 'asc' });

  const handleApproveUser = (mutation: any) => {
    originalHandleApproveUser(mutation);
  };

  const handleRejectUser = (mutation: any) => {
    originalHandleRejectUser(mutation);
  };

  const handleApproveSatuan = (satuan: any) => {
    router.post(`/satuans/${satuan.id}/approve`, {});
  };

  const handleRejectSatuan = (satuan: any) => {
    router.post(`/satuans/${satuan.id}/reject`, {});
  };

  return (
    <div className="animate-in fade-in space-y-4">

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
            <span className="bg-cighra-gold text-slate-900 font-bold text-xs px-1.5 py-0.5 rounded-full ml-1">{pendingPersonelCount}</span>
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
            <span className="bg-cighra-gold text-slate-900 font-bold text-xs px-1.5 py-0.5 rounded-full ml-1">{pendingMutationsCount}</span>
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
          <MapPin className="w-4 h-4" /> SATUAN
          {pendingSatuansCount > 0 && (
            <span className="bg-cighra-gold text-slate-900 font-bold text-xs px-1.5 py-0.5 rounded-full ml-1">{pendingSatuansCount}</span>
          )}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'PERSONEL' && (
          <ApprovalTable
            dbUserMutations={dbUserMutations}
            handleApproveUser={handleApproveUser}
            handleRejectUser={handleRejectUser}
          />
        )}
        {activeTab === 'INVENTARIS' && (
          <MutationApproval dbMutations={dbMutations} dbArchivedUnits={dbArchivedUnits} />
        )}
        {activeTab === 'SATUAN' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead className="bg-cighra-primary dark:bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-white/10 text-xs">
                <tr>
                  <SortableHeader label="SATUAN" sortKey="nama_satuan" currentSort={satuanSortConfig} onSort={handleSatuanSort} />
                  <SortableHeader label="JENIS PENGAJUAN" sortKey="pending_action" currentSort={satuanSortConfig} onSort={handleSatuanSort} />
                  <SortableHeader label="DETAIL PERUBAHAN" />
                  <SortableHeader label="AKSI VERIFIKASI" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-800 bg-transparent">
              {pendingSatuansCount === 0 ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-slate-500 italic font-mono uppercase tracking-widest">
                    Tidak ada pengajuan persetujuan SATUAN.
                  </td>
                </tr>
              ) : sortedPendingSatuans.map((satuan: any) => (
                <tr key={satuan.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors group text-slate-800 dark:text-slate-200">
                  <td className="p-4 text-center font-mono font-bold">{satuan.nama_satuan}</td>
                  <td className="p-4 text-center">
                    <Badge variant={
                      satuan.pending_action === 'create' ? 'success' :
                      satuan.pending_action === 'edit' ? 'info' :
                      'danger'
                    }>
                      {satuan.pending_action === 'create' ? 'Tambah' : satuan.pending_action === 'edit' ? 'Edit' : 'Hapus'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-mono text-slate-800 dark:text-white">
                      {satuan.pending_action === 'edit' && satuan.pending_changes ? (
                        <div className="whitespace-pre-wrap">{JSON.stringify(JSON.parse(satuan.pending_changes), null, 2)}</div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 flex gap-3 justify-center items-center h-full mt-2">
                    <button onClick={() => handleApproveSatuan(satuan)} className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest transition-all shadow-lg">
                      <CheckSquare className="w-4 h-4" /> SETUJUI
                    </button>
                    <button onClick={() => handleRejectSatuan(satuan)} className="flex items-center gap-2 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest transition-all shadow-lg">
                      <CheckSquare className="w-4 h-4" /> TOLAK
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalCenter;

