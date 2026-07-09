import React, { useState } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';

interface MutationHistoryProps {
  dbMutations: any[];
}

const MutationHistory: React.FC<MutationHistoryProps> = ({ dbMutations }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(v => v !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const filteredMutations = dbMutations.filter((m: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    
    // Support searching within batch items
    const isBatch = Array.isArray(m.unit_data);
    if (isBatch) {
      const matchInBatch = m.unit_data.some((u: any) => 
        u.nomor_seri?.toLowerCase().includes(q) || u.nama_unit?.toLowerCase().includes(q)
      );
      if (matchInBatch) return true;
    }

    return (
      (!isBatch && m.unit_data?.nomor_seri?.toLowerCase().includes(q)) ||
      m.requested_by?.toLowerCase().includes(q) ||
      m.reason?.toLowerCase().includes(q)
    );
  });

  const { sortedItems, sortConfig, handleSort } = useTableSort(filteredMutations, { key: 'created_at', direction: 'desc' });

  const getBadgeInfo = (type: string, isBatch: boolean = false) => {
    if (type.includes('add')) return { label: isBatch ? 'TAMBAH MASSAL' : 'TAMBAH INVENTARIS', color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800', icon: <Plus size={10} /> };
    if (type.includes('delete')) return { label: 'HAPUS INVENTARIS', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800', icon: <Trash2 size={10} /> };
    if (type === 'restore') return { label: 'DIKEMBALIKAN', color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800', icon: <FileText size={10} /> };
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
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="CARI NAMA / KODE UNIT..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-100 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 px-4 py-2 text-xs font-mono focus:border-cighra-gold outline-none uppercase w-full md:w-72 text-slate-800 dark:text-white"
        />
      </div>

      <div className="bg-white dark:bg-cighra-darkcard/50 rounded-md border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-slate-700 text-xs">
              <tr>
                <SortableHeader label="TANGGAL" sortKey="created_at" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="TIPE PENGAJUAN" sortKey="type" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="SN INVENTARIS" sortKey="unit_data" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="DETAIL PERUBAHAN" />
                <SortableHeader label="STATUS" sortKey="status" currentSort={sortConfig} onSort={handleSort} />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-800 bg-transparent">
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-500 italic font-mono uppercase tracking-widest">
                    Tidak ada riwayat pengajuan unit
                  </td>
                </tr>
              ) : sortedItems.map((m: any) => {
                const isBatch = Array.isArray(m.unit_data);
                const badge = getBadgeInfo(m.type, isBatch);

                return (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 align-top">
                      <div className="font-mono text-xs text-slate-800 dark:text-white">{new Date(m.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 text-center align-top">
                      <span className={`px-2 py-1 text-[10px] font-mono font-bold border rounded-sm flex items-center justify-center gap-1 mx-auto w-max ${badge.color}`}>
                        {badge.icon} {badge.label}
                      </span>
                      <div className="text-[9px] font-mono mt-1 text-slate-500 uppercase">
                        Oleh: {m.requested_by || '-'}
                      </div>
                    </td>
                    <td className="p-4 text-center align-top">
                      {!isBatch && m.unit_data ? (
                        <>
                          <div className="font-mono text-slate-800 dark:text-white font-bold">{m.unit_data.nomor_seri}</div>
                          <div className="font-bold text-slate-500 dark:text-slate-400 text-xs mt-1">{m.unit_data.nama_unit}</div>
                        </>
                      ) : m.target_unit ? (
                        <>
                          <div className="font-mono text-slate-800 dark:text-white font-bold">{m.target_unit.nomor_seri}</div>
                          <div className="font-bold text-slate-500 dark:text-slate-400 text-xs mt-1">{m.target_unit.nama_unit}</div>
                        </>
                      ) : (
                        <div className="font-mono text-slate-800 dark:text-white font-bold">{isBatch ? m.unit_data.length + ' UNIT' : '-'}</div>
                      )}
                    </td>
                    <td className="p-4 align-top">
                      {isBatch ? (
                        <div className="space-y-2">
                          <div className="text-[10px] font-mono text-slate-800 dark:text-white">
                            <strong>JUMLAH BATCH:</strong> {m.unit_data.length} Unit
                          </div>
                          <button
                            onClick={() => toggleExpand(m.id)}
                            className="text-[10px] font-mono font-bold text-cighra-primary dark:text-cighra-gold hover:underline"
                          >
                            {expandedIds.includes(m.id) ? 'Sembunyikan Detail Batch' : 'Tampilkan Detail Batch'}
                          </button>
                          
                          {expandedIds.includes(m.id) && (
                            <div className="mt-3 overflow-x-auto border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-cighra-darkcard/50 rounded-sm">
                              <table className="w-full text-left font-sans text-xs">
                                <thead className="bg-slate-800 border-b border-slate-700 text-white">
                                  <tr>
                                    <th className="p-2">NO</th>
                                    <th className="p-2">NOMOR SERI</th>
                                    <th className="p-2">NAMA DART</th>
                                    <th className="p-2">JENIS</th>
                                    <th className="p-2">SATUAN</th>
                                    <th className="p-2">STATUS</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 text-slate-800 dark:text-slate-300">
                                  {m.unit_data.map((u: any, uIdx: number) => (
                                    <tr key={uIdx} className="hover:bg-slate-100 dark:hover:bg-slate-800/30">
                                      <td className="p-2 font-mono text-center">{uIdx + 1}</td>
                                      <td className="p-2 font-mono font-bold text-slate-800 dark:text-white text-center">{u.nomor_seri}</td>
                                      <td className="p-2 uppercase text-slate-800 dark:text-white text-center text-[10px]">{u.nama_satuan || '-'}</td>
                                      <td className="p-2 uppercase text-[10px] text-center text-slate-800 dark:text-white">{u.jenis}</td>
                                      <td className="p-2 uppercase text-[10px] text-center text-slate-800 dark:text-white">{u.asal_satuan}</td>
                                      <td className="p-2 text-center">
                                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold border rounded-sm
                                          ${u.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40' :
                                            u.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40' :
                                            'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40'
                                          }
                                        `}>
                                          {u.status === 'approved' ? 'DISETUJUI' : u.status === 'rejected' ? 'DITOLAK' : 'MENUNGGU'}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-[10px] font-mono text-slate-800 dark:text-white">
                          <span className="font-bold">Keterangan:</span> {m.reason || '-'}
                        </div>
                      )}
                      
                      {m.file_path && (
                        <a href={`/storage/${m.file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 mt-2 text-[10px] font-mono font-bold text-cighra-primary dark:text-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 px-2 py-1 rounded">
                          <FileText size={12} /> BUKTI DOKUMEN
                        </a>
                      )}
                    </td>
                    <td className="p-4 text-center align-top">
                      <div className="space-y-1">
                        {getStatusBadge(m.status)}
                        {m.status !== 'pending' && m.approved_by && (
                          <div className="text-[9px] font-mono text-slate-500 uppercase mt-1">
                            Oleh: {m.approved_by}
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

export default MutationHistory;

