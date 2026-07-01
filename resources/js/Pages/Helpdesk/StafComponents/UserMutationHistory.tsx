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
        return <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/40 px-2 py-0.5 text-[9px] font-mono font-bold animate-pulse">MENUNGGU VERIFIKASI</span>;
      case 'approved':
        return <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40 px-2 py-0.5 text-[9px] font-mono font-bold">DISETUJUI</span>;
      case 'rejected':
        return <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40 px-2 py-0.5 text-[9px] font-mono font-bold">DITOLAK</span>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex-1"></div>
        <input
          type="text"
          placeholder="CARI NAMA / USERNAME..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-100 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 px-4 py-2 text-xs font-mono focus:border-cighra-gold outline-none uppercase w-full md:w-56 text-slate-800 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-cighra-darkcard/50 rounded-md border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-slate-700 text-xs">
              <tr>
                <SortableHeader label="TANGGAL" sortKey="created_at" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="TIPE MUTASI" sortKey="type" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="TARGET PERSONEL" sortKey="name" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="DETAIL PERUBAHAN" />
                <SortableHeader label="STATUS" sortKey="status" currentSort={sortConfig} onSort={handleSort} />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800 bg-transparent">
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-500 italic font-mono uppercase tracking-widest">
                    Tidak ada riwayat mutasi personel
                  </td>
                </tr>
              ) : sortedItems.map((m: any) => {
                const badge = getBadgeInfo(m.type);
                const targetName = m.user_data?.nama_lengkap || m.target_user?.name || '-';
                const targetUsername = m.user_data?.username || m.target_user?.username || '-';

                return (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4">
                      <div className="font-mono text-xs text-slate-800 dark:text-white">{new Date(m.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 text-[10px] font-mono font-bold border rounded-sm flex items-center justify-center gap-1 mx-auto w-max ${badge.color}`}>
                        {badge.icon} {badge.label}
                      </span>
                      <div className="text-[9px] font-mono mt-1 text-slate-500 uppercase">
                        Oleh: {m.requested_by?.name || '-'}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="font-mono text-slate-800 dark:text-white font-bold">{targetUsername}</div>
                      <div className="font-bold text-slate-500 dark:text-slate-400 text-xs mt-1">{targetName}</div>
                    </td>
                    <td className="p-4">
                      {m.type === 'request_add' ? (
                        <div className="text-[10px] font-mono text-slate-800 dark:text-white space-y-0.5">
                          <div>NRP/NIP: {m.user_data?.nrp_nip}</div>
                          <div>Satuan: {m.user_data?.asal_satuan}</div>
                          <div>WA: {m.user_data?.no_wa}</div>
                        </div>
                      ) : m.type === 'request_delete' ? (
                        <div className="text-[10px] font-mono text-red-500 dark:text-red-400 italic">Penghapusan akun dari sistem.</div>
                      ) : (
                        <div className="text-[10px] font-mono text-slate-800 dark:text-white">
                          {Object.entries(m.user_data || {}).map(([key, val]) => (
                            <div key={key}><span className="text-blue-500 dark:text-blue-400 font-bold uppercase">{key}:</span> {String(val)}</div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="space-y-1">
                        {getStatusBadge(m.status)}
                        {m.status !== 'pending' && m.approved_by && (
                          <div className="text-[9px] font-mono text-slate-500 uppercase mt-1">
                            Oleh: {m.approved_by.name}
                          </div>
                        )}
                        {m.status === 'rejected' && m.admin_notes && (
                          <div className="text-[9px] font-mono text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-1 mt-1 rounded border border-red-100 dark:border-red-900/50 text-left">
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
