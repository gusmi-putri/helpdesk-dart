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
    if (type.includes('edit')) return { label: 'EDIT INVENTARIS', color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800', icon: <FileText size={10} /> };
    if (type === 'restore') return { label: 'DIKEMBALIKAN', color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800', icon: <FileText size={10} /> };
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
            placeholder="CARI NAMA / KODE UNIT..."
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
                <SortableHeader label="SN INVENTARIS" sortKey="unit_data" currentSort={sortConfig} onSort={handleSort} className="w-[16%]" />
                <SortableHeader label="DETAIL PERUBAHAN" className="w-[32%]" />
                <SortableHeader label="STATUS" sortKey="status" currentSort={sortConfig} onSort={handleSort} className="w-[24%]" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent block md:table-row-group">
              {sortedItems.length === 0 ? (
                <tr className="block md:table-row">
                  <td colSpan={5} className="p-16 text-center text-slate-500 italic font-mono uppercase tracking-widest block md:table-cell">
                    Tidak ada riwayat pengajuan unit
                  </td>
                </tr>
              ) : sortedItems.map((m: any) => {
                const isBatch = Array.isArray(m.unit_data);
                const badge = getBadgeInfo(m.type, isBatch);

                return (
                  <React.Fragment key={m.id}>
                    <tr className="hover:bg-blue-100/50 dark:hover:bg-slate-700/30 transition-colors block md:table-row bg-white md:bg-transparent mb-4 md:mb-0 border border-slate-200 md:border-none">
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
                          Oleh: {m.requested_by || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-[18px] block md:table-cell md:text-center align-top relative border-t border-slate-100 md:border-none">
                        <span className="md:hidden text-[10px] font-tactical tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-2">SN Inventaris</span>
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
                      <td className="px-6 py-[18px] block md:table-cell align-top relative border-t border-slate-100 md:border-none">
                        <span className="md:hidden text-[10px] font-tactical tracking-widest text-slate-400 dark:text-slate-500 uppercase block mb-2">Detail Perubahan</span>
                        <div className="max-w-md w-full">
                          {isBatch ? (
                            <div className="flex flex-col items-start justify-center h-full">
                              <div className="text-xs font-mono text-slate-800 dark:text-white mb-2">
                                <span className="font-bold">JUMLAH BATCH:</span> {m.unit_data.length} Unit
                              </div>
                              <button 
                                onClick={() => toggleExpand(m.id)}
                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                              >
                                {expandedIds.includes(m.id) ? (
                                  <>Sembunyikan Detail Batch</>
                                ) : (
                                  <>Lihat Detail Batch</>
                                )}
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 gap-1.5 text-xs font-mono text-slate-800 dark:text-white">
                              {m.unit_data?.jenis && (
                                <div className="flex"><span className="text-blue-600 dark:text-blue-400 w-24">Jenis</span><span className="mx-2">:</span><span>{m.unit_data.jenis}</span></div>
                              )}
                              {m.unit_data?.asal_satuan && (
                                <div className="flex"><span className="text-blue-600 dark:text-blue-400 w-24">Satuan</span><span className="mx-2">:</span><span>{m.unit_data.asal_satuan}</span></div>
                              )}
                              <div className="flex"><span className="text-blue-600 dark:text-blue-400 w-24">Keterangan</span><span className="mx-2">:</span><span>{m.reason || '-'}</span></div>
                            </div>
                          )}
                          
                          {m.file_path && (
                            <div className="mt-3">
                              <a href={`/storage/${m.file_path}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cighra-primary dark:text-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 hover:bg-cighra-primary/20 transition-colors px-2.5 py-1.5 rounded-sm border border-cighra-primary/20 dark:border-cighra-gold/20">
                                <FileText size={14} /> LIHAT BUKTI DOKUMEN
                              </a>
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
                              Oleh: {m.approved_by}
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
                    {/* EXPANDABLE BATCH ROW */}
                    {isBatch && expandedIds.includes(m.id) && (
                      <tr className="bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700/50 block md:table-row">
                        <td colSpan={5} className="p-0 block md:table-cell">
                          <div className="px-6 py-5 md:px-10 border-l-4 border-cighra-primary dark:border-cighra-gold">
                            <div className="overflow-x-auto rounded-sm border border-slate-200 dark:border-slate-700/50 shadow-sm bg-white dark:bg-cighra-darkcard">
                              <table className="w-full text-left font-sans text-xs">
                                <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white">
                                  <tr>
                                    <th className="p-2 text-center">NO</th>
                                    <th className="p-2 text-center">NOMOR SERI</th>
                                    <th className="p-2 text-center">JENIS</th>
                                    <th className="p-2 text-center">SATUAN</th>
                                    <th className="p-2 text-center">STATUS</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent text-slate-800 dark:text-slate-300">
                                  {m.unit_data.map((u: any, uIdx: number) => (
                                    <tr key={uIdx} className="hover:bg-blue-100/50 dark:hover:bg-slate-700/30">
                                      <td className="p-2 font-mono text-center">{uIdx + 1}</td>
                                      <td className="p-2 font-mono font-bold text-slate-800 dark:text-white text-center">{u.nomor_seri}</td>
                                      <td className="p-2 uppercase text-xs text-center text-slate-800 dark:text-white">{u.jenis}</td>
                                      <td className="p-2 uppercase text-xs text-center text-slate-800 dark:text-white">{u.asal_satuan}</td>
                                      <td className="p-2 text-center">
                                        <span className={`px-2 py-0.5 text-[11px] font-mono font-bold border rounded-sm
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
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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

