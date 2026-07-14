import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';

interface UserMutationHistoryProps {
  dbMutations: any[];
}

const UserMutationHistory: React.FC<UserMutationHistoryProps> = ({ dbMutations }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMutations = dbMutations.filter((m: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();

    return (
      m.user_data?.nama_lengkap?.toLowerCase().includes(q) ||
      m.user_data?.username?.toLowerCase().includes(q) ||
      m.target_user?.name?.toLowerCase().includes(q) ||
      m.target_user?.username?.toLowerCase().includes(q) ||
      m.requested_by?.name?.toLowerCase().includes(q)
    );
  });

  const { sortedItems, sortConfig, handleSort } = useTableSort(filteredMutations, { key: 'created_at', direction: 'desc' });

  const getBadgeInfo = (type: string) => {
    if (type.includes('add')) return { label: 'TAMBAH PERSONEL', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800', icon: <Plus size={10} /> };
    if (type.includes('edit')) return { label: 'UBAH PROFIL', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800', icon: <Edit2 size={10} /> };
    if (type.includes('delete')) return { label: 'HAPUS PERSONEL', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800', icon: <Trash2 size={10} /> };
    return { label: 'UNKNOWN', color: 'bg-gray-100 text-gray-700', icon: null };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/40 px-2 py-0.5 text-[11px] font-mono font-bold animate-pulse">MENUNGGU VERIFIKASI</span>;
      case 'approved':
        return <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40 px-2 py-0.5 text-[11px] font-mono font-bold">DISETUJUI</span>;
      case 'rejected':
        return <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40 px-2 py-0.5 text-[11px] font-mono font-bold">DITOLAK</span>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in space-y-4">
      {/* Compact Search Toolbar - 35-40% width */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
        <div className="w-full md:w-[38%] relative">
          <input
            type="text"
            placeholder="CARI NAMA / USERNAME..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 px-4 py-2 text-xs font-mono focus:border-cighra-gold outline-none uppercase text-slate-800 dark:text-white rounded-sm"
          />
        </div>
        {/* Optional future filters space to right-align properly if needed */}
        <div className="w-full md:w-auto flex justify-end"></div>
      </div>

      <div className="bg-white dark:bg-cighra-darkcard/50 rounded-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {/* Mobile responsive table implementation */}
          <table className="w-full text-left font-sans text-sm block md:table table-fixed">
            <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white font-tactical tracking-wider text-xs hidden md:table-header-group">
              <tr>
                <SortableHeader label="TANGGAL" sortKey="created_at" currentSort={sortConfig} onSort={handleSort} className="w-[10%]" />
                <SortableHeader label="TIPE PENGAJUAN" sortKey="type" currentSort={sortConfig} onSort={handleSort} className="w-[18%]" />
                <SortableHeader label="TARGET PERSONEL" sortKey="name" currentSort={sortConfig} onSort={handleSort} className="w-[16%]" />
                <SortableHeader label="DETAIL PERUBAHAN" className="w-[32%]" />
                <SortableHeader label="STATUS" sortKey="status" currentSort={sortConfig} onSort={handleSort} className="w-[24%]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent block md:table-row-group">
              {sortedItems.length === 0 ? (
                <tr className="block md:table-row">
                  <td colSpan={5} className="p-16 text-center text-slate-500 italic font-mono uppercase tracking-widest block md:table-cell">
                    Tidak ada riwayat pengajuan personel
                  </td>
                </tr>
              ) : sortedItems.map((m: any) => {
                const badge = getBadgeInfo(m.type);
                const targetName = m.user_data?.nama_lengkap || m.target_user?.name || '-';
                const targetUsername = m.user_data?.username || m.target_user?.username || '-';

                return (
                  <tr key={m.id} className="hover:bg-blue-100/50 dark:hover:bg-slate-700/30 transition-colors block md:table-row bg-white md:bg-transparent mb-4 md:mb-0 border border-slate-200 md:border-none">
                    <td className="px-6 py-[18px] block md:table-cell align-top relative">
                      <span className="md:hidden text-[10px] font-tactical tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-1">Tanggal</span>
                      <div className="font-mono text-xs text-slate-800 dark:text-white mt-1">{new Date(m.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-[18px] block md:table-cell md:text-center align-top relative border-t border-slate-100 md:border-none">
                      <span className="md:hidden text-[10px] font-tactical tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-2">Tipe Pengajuan</span>
                      <span className={`px-2 py-1 text-xs font-mono font-bold border rounded-sm flex items-center md:justify-center gap-1 w-max md:mx-auto ${badge.color}`}>
                        {badge.icon} {badge.label}
                      </span>
                      <div className="text-[11px] font-mono mt-2 text-slate-500 uppercase md:mx-auto">
                        Oleh: {m.requested_by?.name || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-[18px] block md:table-cell md:text-center align-top relative border-t border-slate-100 md:border-none">
                      <span className="md:hidden text-[10px] font-tactical tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-2">Target Personel</span>
                      <div className="font-mono text-slate-800 dark:text-white font-bold">{targetUsername}</div>
                      <div className="font-bold text-slate-500 dark:text-slate-400 text-xs mt-1">{targetName}</div>
                    </td>
                    <td className="px-6 py-[18px] block md:table-cell align-top relative border-t border-slate-100 md:border-none">
                      <span className="md:hidden text-[10px] font-tactical tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-2">Detail Perubahan</span>
                      <div className="max-w-md w-full">
                        {m.type.includes('add') ? (
                          <div className="grid grid-cols-1 gap-1.5 text-xs font-mono text-slate-800 dark:text-white">
                            <div className="flex"><span className="text-blue-600 dark:text-blue-400 w-24">NRP/NIP</span><span className="mx-2">:</span><span>{m.user_data?.nrp_nip || '-'}</span></div>
                            <div className="flex"><span className="text-blue-600 dark:text-blue-400 w-24">Satuan</span><span className="mx-2">:</span><span>{m.user_data?.asal_satuan || '-'}</span></div>
                            <div className="flex"><span className="text-blue-600 dark:text-blue-400 w-24">WA</span><span className="mx-2">:</span><span>{m.user_data?.no_wa || '-'}</span></div>
                          </div>
                        ) : m.type.includes('delete') ? (
                          <div className="text-xs font-mono text-red-500 dark:text-red-400 italic">Penghapusan akun dari sistem.</div>
                        ) : (
                          <div className="grid grid-cols-1 gap-1.5 text-xs font-mono text-slate-800 dark:text-white">
                            {Object.entries(m.user_data || {})
                              .filter(([key]) => !['password', 'role_id', 'satuan_id', 'is_approved'].includes(key.toLowerCase()))
                              .map(([key, val]) => (
                              <div key={key} className="flex">
                                <span className="text-blue-600 dark:text-blue-400 uppercase w-24 whitespace-nowrap overflow-hidden text-ellipsis">
                                  {key.replace(/_/g, ' ')}
                                </span>
                                <span className="mx-2">:</span>
                                <span className="break-all">{String(val || '-')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-[18px] block md:table-cell md:text-center align-top relative border-t border-slate-100 md:border-none">
                      <span className="md:hidden text-[10px] font-tactical tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-2">Status</span>
                      <div className="flex flex-col md:items-center gap-1.5">
                        <div className="w-max md:mx-auto">{getStatusBadge(m.status)}</div>
                        {m.status !== 'pending' && m.approved_by && (
                          <div className="text-[11px] font-mono text-slate-500 uppercase mt-0.5 md:mx-auto">
                            Oleh: {m.approved_by.name}
                          </div>
                        )}
                        {m.status === 'rejected' && m.admin_notes && (
                          <div className="text-[11px] font-mono text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1.5 mt-1 rounded border border-red-100 dark:border-red-900/50 text-left w-full md:max-w-[140px] break-words">
                            <strong>Alasan:</strong> {m.admin_notes}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserMutationHistory;
