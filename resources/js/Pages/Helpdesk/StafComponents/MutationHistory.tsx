import React, { useState } from 'react';
import { GitPullRequest, Clock, CheckCircle, XCircle, FileText, ExternalLink, Plus, Trash2 } from 'lucide-react';

interface MutationHistoryProps {
  dbMutations: any[];
}

const MutationHistory: React.FC<MutationHistoryProps> = ({ dbMutations }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const pendingMutations = dbMutations.filter((m: any) => m.status === 'pending');
  const historyMutations = dbMutations.filter((m: any) => m.status !== 'pending');

  const toggleExpand = (id: number) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(v => v !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const filteredMutations = (activeTab === 'pending' ? pendingMutations : historyMutations).filter((m: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    
    // Support searching within batch items
    const isBatch = Array.isArray(m.unit_data);
    if (isBatch) {
      const matchInBatch = m.unit_data.some((u: any) => 
        u.nomor_seri?.toLowerCase().includes(q) ?.toLowerCase().includes(q)
      );
      if (matchInBatch) return true;
    }

    return (
      (!isBatch && m.unit_data?.nomor_seri?.toLowerCase().includes(q)) ||

      m.requested_by?.toLowerCase().includes(q) ||
      m.reason?.toLowerCase().includes(q)
    );
  });

  const getTypeBadge = (type: string, isBatch: boolean = false) => {
    switch (type) {
      case 'request_add':
        return <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1"><Plus size={10} /> {isBatch ? 'TAMBAH MASSAL' : 'TAMBAH'}</span>;
      case 'request_delete':
        return <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1"><Trash2 size={10} /> HAPUS</span>;
      case 'approved_add':
        return <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1"><CheckCircle size={10} /> {isBatch ? 'TAMBAH MASSAL (DISETUJUI)' : 'TAMBAH (DISETUJUI)'}</span>;
      case 'approved_delete':
        return <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1"><CheckCircle size={10} /> HAPUS (DISETUJUI)</span>;
      case 'rejected_add':
        return <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/40 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1"><XCircle size={10} /> {isBatch ? 'TAMBAH MASSAL (DITOLAK)' : 'TAMBAH (DITOLAK)'}</span>;
      case 'rejected_delete':
        return <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800/40 px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1"><XCircle size={10} /> HAPUS (DITOLAK)</span>;
      case 'restore':
        return <span className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/40 px-2 py-0.5 text-[9px] font-mono font-bold">DIKEMBALIKAN</span>;
      default:
        return <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 text-[9px] font-mono font-bold">{type}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/40 px-2 py-0.5 text-[9px] font-mono font-bold animate-pulse">MENUNGGU</span>;
      case 'approved':
        return <span className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800/40 px-2 py-0.5 text-[9px] font-mono font-bold">DISETUJUI</span>;
      case 'rejected':
        return <span className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40 px-2 py-0.5 text-[9px] font-mono font-bold">DITOLAK</span>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in space-y-6 mt-6">
      {/* Header */}
      <div className="glass-panel border-t-4 border-t-cighra-gold p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cighra-gold/10 text-cighra-gold rounded-sm border border-cighra-gold/20">
            <GitPullRequest size={20} />
          </div>
          <div>
            <h3 className="font-tactical font-bold text-sm tracking-widest uppercase text-slate-800 dark:text-white">RIWAYAT MUTASI INVENTARIS</h3>
            <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase">Lacak status pengajuan penambahan & penghapusan unit DART</p>
          </div>
        </div>
        <input
          type="text"
          placeholder="CARI SN / NAMA..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-100 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 px-4 py-2 text-xs font-mono focus:border-cighra-gold outline-none uppercase w-full md:w-56 text-slate-800 dark:text-white"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-tactical text-xs tracking-widest border transition-all ${activeTab === 'pending' ? 'bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900 border-cighra-primary dark:border-cighra-gold' : 'bg-white dark:bg-cighra-darkcard border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-cighra-gold'}`}>
          MENUNGGU PERSETUJUAN ({pendingMutations.length})
        </button>
        <button onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-tactical text-xs tracking-widest border transition-all ${activeTab === 'history' ? 'bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900 border-cighra-primary dark:border-cighra-gold' : 'bg-white dark:bg-cighra-darkcard border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-cighra-gold'}`}>
          RIWAYAT LENGKAP ({historyMutations.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {filteredMutations.length === 0 ? (
          <div className="glass-panel p-10 text-center">
            <Clock className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-mono uppercase">
              {activeTab === 'pending' ? 'Tidak ada pengajuan yang menunggu persetujuan.' : 'Belum ada riwayat mutasi.'}
            </p>
          </div>
        ) : (
          filteredMutations.map((m: any) => {
            const isBatch = Array.isArray(m.unit_data);
            return (
              <div key={m.id} className="glass-panel p-4 hover:shadow-lg transition-shadow border-l-4 border-l-cighra-gold/50">
                <div className="flex flex-col md:flex-row justify-between items-start gap-3">
                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(m.type, isBatch)}
                      {getStatusBadge(m.status)}
                    </div>
                    {isBatch ? (
                      <div className="w-full">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/50 pb-2">
                          <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">
                            PENGAJUAN TAMBAH MASSAL ({m.unit_data.length} UNIT)
                          </p>
                          <button
                            onClick={() => toggleExpand(m.id)}
                            className="text-xs text-cighra-primary dark:text-cighra-gold font-mono hover:underline cursor-pointer font-bold"
                          >
                            {expandedIds.includes(m.id) ? 'SEMBUNYIKAN RINCIAN ▲' : 'LIHAT RINCIAN ▼'}
                          </button>
                        </div>
                        
                        {expandedIds.includes(m.id) && (
                          <div className="mt-3 overflow-x-auto border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-cighra-darkcard/50 rounded-sm">
                            <table className="w-full text-left font-sans text-xs">
                              <thead className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-tactical tracking-wider uppercase border-b border-slate-300 dark:border-slate-700">
                                <tr>
                                  <th className="p-2 w-10">NO</th>
                                  <th className="p-2">NOMOR SERI</th>
                                  <th className="p-2">NAMA DART</th>
                                  <th className="p-2">JENIS</th>
                                  <th className="p-2">SATUAN</th>
                                  <th className="p-2 text-right">STATUS</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 text-slate-800 dark:text-slate-300">
                                {m.unit_data.map((u: any, uIdx: number) => (
                                  <tr key={uIdx} className="hover:bg-slate-100 dark:hover:bg-slate-800/30">
                                    <td className="p-2 font-mono">{uIdx + 1}</td>
                                    <td className="p-2 font-mono font-bold text-cighra-primary dark:text-cighra-gold">{u.nomor_seri}</td>

                                    <td className="p-2 uppercase text-[10px]">{u.jenis}</td>
                                    <td className="p-2 uppercase text-[10px]">{u.asal_satuan}</td>
                                    <td className="p-2 text-right">
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
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">
                          [{m.unit_data?.nomor_seri || '-'}]
                        </p>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          {m.unit_data?.jenis} — {m.unit_data?.asal_satuan}
                        </p>
                      </div>
                    )}
                    {m.reason && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/50 p-2 border-l-2 border-cighra-gold">
                        "{m.reason}"
                      </p>
                    )}
                    {m.admin_notes && m.status !== 'pending' && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/10 p-2 border-l-2 border-blue-500">
                        <span className="font-bold text-blue-700 dark:text-blue-400">Catatan Admin:</span> {m.admin_notes}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-1 shrink-0 mt-2 md:mt-0">
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Diajukan: {m.created_at}</p>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Oleh: {m.requested_by}</p>
                    {m.approved_by && <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Diproses: {m.approved_by}</p>}
                    {m.document_path && (
                      <a href={m.document_path} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-cighra-primary dark:text-cighra-gold hover:underline">
                        <FileText size={12} /> LIHAT SURAT <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MutationHistory;
