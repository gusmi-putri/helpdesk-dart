import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';

interface ApprovalTableProps {
  dbUserMutations: any[];
  handleApproveUser: (mutation: any) => void;
  handleRejectUser: (mutation: any) => void;
}

const ApprovalTable: React.FC<ApprovalTableProps> = ({
  dbUserMutations,
  handleApproveUser,
  handleRejectUser
}) => {
  const pending = dbUserMutations.filter((m: any) => m.status === 'pending');
  const { sortedItems: pendingMutations, sortConfig, handleSort } = useTableSort(pending, { key: 'created_at', direction: 'desc' });

  const getBadgeInfo = (type: string) => {
    if (type === 'request_add') return { label: 'TAMBAH PERSONEL', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' };
    if (type === 'request_register') return { label: 'PENDAFTARAN BARU', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' };
    if (type === 'request_edit') return { label: 'UBAH PROFIL', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' };
    if (type === 'request_delete') return { label: 'HAPUS PERSONEL', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' };
    return { label: 'UNKNOWN', color: 'bg-gray-100' };
  };

  return (
    <div className="animate-in fade-in relative bg-white dark:bg-cighra-darkcard/50 rounded-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-cighra-primary dark:bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-white/10 text-xs">
            <tr>
              <SortableHeader label="TIPE PENGAJUAN" sortKey="type" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="USERNAME" sortKey="username" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="NAMA LENGKAP" sortKey="name" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="DETAIL PERUBAHAN" />
              <SortableHeader label="AKSI VERIFIKASI" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent">
            {pendingMutations.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center text-slate-500 italic font-mono uppercase tracking-widest">
                  Tidak ada pengajuan personel yang menunggu persetujuan.
                </td>
              </tr>
            ) : pendingMutations.map((m: any) => {
              const badge = getBadgeInfo(m.type);
              
              const targetName = m.user_data?.name || m.user_data?.nama_lengkap || m.target_user?.name || '-';
              const targetUsername = m.user_data?.username || m.target_user?.username || '-';

              return (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors group text-slate-800 dark:text-slate-200">
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 text-xs font-mono font-bold border rounded-sm ${badge.color}`}>
                      {badge.label}
                    </span>
                    <div className="text-[11px] font-mono mt-1 text-slate-500">
                      Oleh: {m.requested_by?.name || '-'}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="font-mono text-slate-800 dark:text-white font-bold">{targetUsername}</div>
                    {m.type === 'request_edit' && m.user_data?.role_id && (
                      <div className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400 mt-1 bg-slate-100 dark:bg-slate-800 inline-block px-1 rounded-sm border border-slate-200 dark:border-slate-600">
                        Ubah Role ke: {m.user_data.role_id}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-slate-800 dark:text-white font-bold text-center">{targetName}</td>
                  <td className="p-4">
                    {m.type === 'request_add' || m.type === 'request_register' ? (
                      <div className="text-xs font-mono text-slate-800 dark:text-white space-y-0.5">
                        <div>NRP/NIP: {m.user_data?.nrp_nip || '-'}</div>
                        <div>Satuan: {m.user_data?.asal_satuan || m.user_data?.satuan?.nama_satuan || '-'}</div>
                        <div>WA: {m.user_data?.no_wa || '-'}</div>
                      </div>
                    ) : m.type === 'request_delete' ? (
                      <div className="text-xs font-mono text-red-500 dark:text-red-400 italic">Penghapusan akun dari sistem.</div>
                    ) : (
                      <div className="text-xs font-mono text-slate-800 dark:text-white">
                        {Object.entries(m.user_data || {}).map(([key, val]) => (
                          <div key={key}><span className="text-blue-500 dark:text-blue-400 font-bold uppercase">{key}:</span> {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}</div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4 flex flex-col gap-2 justify-center items-center h-full mt-2">
                    {(() => {
                      const isSatuanUnverified = m.type === 'request_register' && m.user_data?.satuan && (m.user_data.satuan.is_verified === 0 || m.user_data.satuan.is_verified === false);
                      return (
                        <>
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleApproveUser(m)}
                              disabled={isSatuanUnverified}
                              className={`flex items-center gap-2 px-4 py-2 text-xs font-tactical font-bold tracking-widest transition-all shadow-lg ${
                                isSatuanUnverified 
                                ? 'bg-slate-300 text-slate-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-500' 
                                : 'bg-green-600 hover:bg-green-500 text-white'
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" /> {isSatuanUnverified ? 'TUNGGU SATUAN DI-APPROVE' : 'SETUJUI'}
                            </button>
                            <button
                              onClick={() => handleRejectUser(m)}
                              className="flex items-center gap-2 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest transition-all shadow-lg"
                            >
                              <XCircle className="w-4 h-4" /> TOLAK
                            </button>
                          </div>
                          {isSatuanUnverified && (
                            <div className="text-[11px] text-cighra-primary dark:text-cighra-gold text-center max-w-[200px]">
                              * Satuan kerja pelapor ini baru dan menunggu persetujuan Anda di tab Satuan.
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </td>
                </tr>
            );
          })}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovalTable;
