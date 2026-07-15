import React, { useState } from 'react';
import { CheckCircle, XCircle, Archive, RotateCcw, FileText, ExternalLink, Plus, Trash2, Clock, Search, X } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';
import { router } from '@inertiajs/react';

interface MutationApprovalProps {
  dbMutations: any[];
  dbArchivedUnits: any[];
}

const MutationApproval: React.FC<MutationApprovalProps> = ({ dbMutations, dbArchivedUnits }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'archive' | 'history'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewingMutation, setReviewingMutation] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [restoreModal, setRestoreModal] = useState<{ isOpen: boolean; unit: any }>({ isOpen: false, unit: null });

  // Batch states
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [selectedIndicesMap, setSelectedIndicesMap] = useState<Record<number, number[]>>({});
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const pendingMutations = dbMutations.filter((m: any) => m.status === 'pending');
  const historyMutations = dbMutations.filter((m: any) => m.status !== 'pending');

  const { sortedItems: sortedArchivedUnits, sortConfig: archiveSort, handleSort: handleArchiveSort } = useTableSort(dbArchivedUnits, { key: 'deleted_at', direction: 'desc' });

  const formatRanges = (nums: number[]) => {
    if (nums.length === 0) return 'Pilih unit...';
    const sorted = [...nums].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        if (start === end) {
          ranges.push(`${start}`);
        } else {
          ranges.push(`${start}-${end}`);
        }
        start = sorted[i];
        end = sorted[i];
      }
    }
    if (start === end) {
      ranges.push(`${start}`);
    } else {
      ranges.push(`${start}-${end}`);
    }
    return ranges.join(', ');
  };

  const toggleExpand = (id: number) => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(v => v !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const getSelectedIndices = (mutationId: number, unitData: any[]) => {
    if (selectedIndicesMap[mutationId] !== undefined) {
      return selectedIndicesMap[mutationId];
    }
    // Default: all pending
    return unitData
      .map((u, i) => ({ u, i }))
      .filter(item => item.u.status === 'pending')
      .map(item => item.i);
  };

  const toggleIndexSelection = (mutationId: number, index: number, unitData: any[]) => {
    const current = getSelectedIndices(mutationId, unitData);
    let updated;
    if (current.includes(index)) {
      updated = current.filter(i => i !== index);
    } else {
      updated = [...current, index];
    }
    setSelectedIndicesMap({
      ...selectedIndicesMap,
      [mutationId]: updated
    });
  };

  const handleApprove = (mutationId: number) => {
    setProcessing(true);
    router.post(`/mutations/${mutationId}/approve`, { admin_notes: adminNotes }, {
      onSuccess: () => { setReviewingMutation(null); setAdminNotes(''); setProcessing(false); },
      onError: () => setProcessing(false),
    });
  };

  const handleReject = (mutationId: number) => {
    setProcessing(true);
    router.post(`/mutations/${mutationId}/reject`, { admin_notes: adminNotes || 'Ditolak.' }, {
      onSuccess: () => { setReviewingMutation(null); setAdminNotes(''); setProcessing(false); },
      onError: () => setProcessing(false),
    });
  };

  const handleApproveUnit = (mutationId: number, idx: number) => {
    setProcessing(true);
    router.post(`/mutations/${mutationId}/approve`, {
      unit_index: idx,
      admin_notes: adminNotes
    }, {
      onSuccess: () => { setAdminNotes(''); setProcessing(false); },
      onError: () => setProcessing(false),
    });
  };

  const handleRejectUnit = (mutationId: number, idx: number) => {
    setProcessing(true);
    router.post(`/mutations/${mutationId}/reject`, {
      unit_index: idx,
      admin_notes: adminNotes || 'Ditolak.'
    }, {
      onSuccess: () => { setAdminNotes(''); setProcessing(false); },
      onError: () => setProcessing(false),
    });
  };

  const handleApproveBatchIndices = (mutationId: number, indices: number[]) => {
    setProcessing(true);
    router.post(`/mutations/${mutationId}/approve`, {
      unit_indices: indices,
      admin_notes: adminNotes
    }, {
      onSuccess: () => { setAdminNotes(''); setProcessing(false); },
      onError: () => setProcessing(false),
    });
  };

  const handleRejectRemaining = (mutationId: number) => {
    setProcessing(true);
    router.post(`/mutations/${mutationId}/reject`, {
      admin_notes: adminNotes || 'Sisa ditolak.'
    }, {
      onSuccess: () => { setAdminNotes(''); setProcessing(false); },
      onError: () => setProcessing(false),
    });
  };

  const handleRestore = (unitId: number) => {
    setProcessing(true);
    router.post(`/units/${unitId}/restore`, { reason: 'Dikembalikan dari arsip oleh Admin.' }, {
      onSuccess: () => { setRestoreModal({ isOpen: false, unit: null }); setProcessing(false); },
      onError: () => setProcessing(false),
    });
  };

  const getTypeBadge = (type: string, isBatch: boolean = false) => {
    const badges: Record<string, { bg: string; icon: any; label: string }> = {
      'request_add': { bg: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40', icon: Plus, label: isBatch ? 'TAMBAH MASSAL' : 'TAMBAH' },
      'request_delete': { bg: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40', icon: Trash2, label: 'HAPUS' },
      'approved_add': { bg: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40', icon: CheckCircle, label: isBatch ? 'TAMBAH MASSAL ✓' : 'TAMBAH ✓' },
      'approved_delete': { bg: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40', icon: CheckCircle, label: 'HAPUS ✓' },
      'rejected_add': { bg: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/40', icon: XCircle, label: isBatch ? 'TAMBAH MASSAL ✗' : 'TAMBAH ✗' },
      'rejected_delete': { bg: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/40', icon: XCircle, label: 'HAPUS ✗' },
      'restore': { bg: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40', icon: RotateCcw, label: 'RESTORE' },
    };
    const b = badges[type] || { bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200', icon: Clock, label: type };
    const Icon = b.icon;
    return <span className={`${b.bg} border px-2 py-0.5 text-[11px] font-mono font-bold flex items-center gap-1`}><Icon size={10} /> {b.label}</span>;
  };
  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="animate-in fade-in relative bg-white dark:bg-cighra-darkcard/50 rounded-md">
        <div className="p-4">

      {/* Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'pending', label: `PENGAJUAN MASUK (${pendingMutations.length})`, icon: Clock },
            { key: 'archive', label: `ARSIP UNIT (${dbArchivedUnits.length})`, icon: Archive },
            { key: 'history', label: `RIWAYAT (${historyMutations.length})`, icon: FileText },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 font-tactical text-xs tracking-widest border transition-all flex items-center gap-2
                ${activeTab === tab.key ? 'bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900 border-cighra-primary dark:border-cighra-gold' : 'bg-white dark:bg-cighra-darkcard border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-cighra-gold'}`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <input type="text" placeholder="CARI NAMA / KODE UNIT..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 px-4 py-2 text-xs font-mono focus:border-cighra-gold outline-none uppercase text-slate-800 dark:text-white rounded-sm" />
        </div>
      </div>

      {/* Tab: Pending */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingMutations.length === 0 ? (
            <div className="glass-panel p-10 text-center">
              <CheckCircle className="w-10 h-10 text-green-300 dark:text-green-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-mono uppercase">Tidak ada pengajuan yang menunggu persetujuan.</p>
            </div>
          ) : (
            pendingMutations.map((m: any) => {
              const isBatch = m.type === 'request_add' && Array.isArray(m.unit_data);
              const pendingUnits = isBatch ? m.unit_data.filter((u: any) => u.status === 'pending') : [];
              const selectedIndices = isBatch ? getSelectedIndices(m.id, m.unit_data) : [];

              return (
                <div key={m.id} className="glass-panel p-5 border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        {getTypeBadge(m.type, isBatch)}
                        <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/40 px-2 py-0.5 text-[11px] font-mono font-bold animate-pulse">MENUNGGU</span>
                      </div>
                      
                      {isBatch ? (
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">
                            PENGAJUAN TAMBAH MASSAL ({m.unit_data.length} UNIT)
                          </p>
                          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                            Diajukan: {m.created_at} oleh {m.requested_by}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">
                            [{m.unit_data?.nomor_seri || '-'}]
                          </p>
                          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                            {m.unit_data?.jenis} — {m.unit_data?.asal_satuan} | Diajukan: {m.created_at} oleh {m.requested_by}
                          </p>
                        </div>
                      )}

                      {m.reason && (
                        <p className="text-xs text-slate-700 dark:text-slate-200 italic bg-slate-50 dark:bg-slate-800/50 p-2 border-l-2 border-cighra-gold">"{m.reason}"</p>
                      )}
                      {m.document_path && (
                        <a href={m.document_path} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-mono text-cighra-primary dark:text-cighra-gold hover:underline mt-1">
                          <FileText size={12} /> LIHAT SURAT PENDUKUNG <ExternalLink size={10} />
                        </a>
                      )}

                      {isBatch && (
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => toggleExpand(m.id)}
                            className="text-xs text-cighra-primary dark:text-cighra-gold font-mono hover:underline font-bold"
                          >
                            {expandedIds.includes(m.id) ? 'SEMBUNYIKAN RINCIAN ▲' : `LIHAT RINCIAN UNIT (${pendingUnits.length} pending) ▼`}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0 lg:w-56">
                      <textarea placeholder="Catatan Admin (opsional)..." value={reviewingMutation === m.id ? adminNotes : ''}
                        onChange={(e) => { setReviewingMutation(m.id); setAdminNotes(e.target.value); }}
                        onFocus={() => setReviewingMutation(m.id)}
                        className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-xs font-mono resize-none h-16 focus:border-cighra-gold outline-none text-slate-800 dark:text-white" />
                      <div className="flex gap-2">
                        {isBatch ? (
                          <>
                            <button onClick={() => handleApprove(m.id)} disabled={processing || pendingUnits.length === 0}
                              className="flex-1 py-2 bg-green-600 text-white font-tactical text-xs tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                              title="Setujui seluruh sisa unit yang pending">
                              <CheckCircle size={12} /> TERIMA SEMUA
                            </button>
                            <button onClick={() => handleReject(m.id)} disabled={processing || pendingUnits.length === 0}
                              className="flex-1 py-2 bg-red-600 text-white font-tactical text-xs tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
                              title="Tolak seluruh sisa unit yang pending">
                              <XCircle size={12} /> TOLAK SEMUA
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleApprove(m.id)} disabled={processing}
                              className="flex-1 py-2 bg-green-600 text-white font-tactical text-xs tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-1 disabled:opacity-50">
                              <CheckCircle size={12} /> SETUJUI
                            </button>
                            <button onClick={() => handleReject(m.id)} disabled={processing}
                              className="flex-1 py-2 bg-red-600 text-white font-tactical text-xs tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-1 disabled:opacity-50">
                              <XCircle size={12} /> TOLAK
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Batch Details Expanded Panel */}
                  {isBatch && expandedIds.includes(m.id) && (
                    <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4">
                      {/* Canva Range Action Header */}
                      <div className="flex flex-wrap items-center gap-3 bg-slate-100 dark:bg-slate-800/40 p-3 rounded-sm">
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">RANGE PENGESAHAN:</span>
                        
                        {/* Canva-style select dropdown */}
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() => setOpenDropdownId(openDropdownId === m.id ? null : m.id)}
                            className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-mono rounded-sm flex items-center gap-2 hover:border-cighra-gold cursor-pointer"
                          >
                            <span>Unit {formatRanges(selectedIndices.map(i => i + 1))}</span>
                            <span className="text-slate-400">▼</span>
                          </button>
                          
                          {openDropdownId === m.id && (
                            <>
                              {/* Overlay to close when clicking outside */}
                              <div className="fixed inset-0 z-[190]" onClick={() => setOpenDropdownId(null)} />
                              <div className="absolute left-0 mt-1 w-64 bg-slate-950 border border-slate-700 shadow-2xl rounded-sm z-[200] p-3 space-y-3 animate-in fade-in zoom-in-95 duration-100 text-slate-200">
                                <label className="flex items-center gap-3 p-1.5 rounded-sm text-xs font-mono cursor-pointer hover:bg-slate-800">
                                  <input
                                    type="checkbox"
                                    checked={selectedIndices.length === pendingUnits.length && pendingUnits.length > 0}
                                    onChange={() => {
                                      const allPending = m.unit_data
                                        .map((u: any, i: number) => ({ u, i }))
                                        .filter((item: any) => item.u.status === 'pending')
                                        .map((item: any) => item.i);
                                      if (selectedIndices.length === allPending.length) {
                                        setSelectedIndicesMap({ ...selectedIndicesMap, [m.id]: [] });
                                      } else {
                                        setSelectedIndicesMap({ ...selectedIndicesMap, [m.id]: allPending });
                                      }
                                    }}
                                    className="w-4 h-4 cursor-pointer accent-cighra-gold"
                                  />
                                  <span className="font-bold text-cighra-gold">Pilih Semua</span>
                                </label>
                                
                                <div className="border-t border-slate-800 my-1" />
                                
                                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                                  {m.unit_data.map((u: any, idx: number) => {
                                    const isItemPending = u.status === 'pending';
                                    const isSelected = selectedIndices.includes(idx);
                                    return (
                                      <label key={idx} className={`flex items-center gap-3 p-1.5 rounded-sm text-xs font-mono ${isItemPending ? 'cursor-pointer hover:bg-slate-800 text-slate-200' : 'text-slate-500 opacity-60'}`}>
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          disabled={!isItemPending}
                                          onChange={() => {
                                            if (isItemPending) {
                                              toggleIndexSelection(m.id, idx, m.unit_data);
                                            }
                                          }}
                                          className="w-4 h-4 cursor-pointer accent-cighra-gold"
                                        />
                                        <span className="flex-1 truncate">
                                          Unit {idx + 1}: {u.nomor_seri} {u.status !== 'pending' ? `(${u.status.toUpperCase()})` : ''}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => setOpenDropdownId(null)}
                                  className="w-full py-2 bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900 rounded-sm font-tactical font-bold text-xs tracking-widest hover:bg-cighra-primary/95 dark:hover:bg-cighra-gold/95 transition-all text-center uppercase cursor-pointer"
                                >
                                  Selesai
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                        
                        <button
                          type="button"
                          disabled={processing || selectedIndices.length === 0}
                          onClick={() => handleApproveBatchIndices(m.id, selectedIndices)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-tactical text-xs tracking-widest rounded-sm transition-colors cursor-pointer"
                        >
                          SETUJUI UNIT TERPILIH
                        </button>
                        
                        <button
                          type="button"
                          disabled={processing || pendingUnits.length === 0}
                          onClick={() => handleRejectRemaining(m.id)}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-tactical text-xs tracking-widest rounded-sm transition-colors cursor-pointer"
                        >
                          TOLAK SISA UNIT
                        </button>
                      </div>

                      {/* Detail Table */}
                      <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 bg-white dark:bg-cighra-darkcard/50 rounded-sm">
                        <table className="w-full text-left font-sans text-xs">
                          <thead className="bg-cighra-primary dark:bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-white/10 text-xs">
                            <tr>
                              <SortableHeader label="NO" />
                              <SortableHeader label="NOMOR SERI" />
                              <SortableHeader label="KETERANGAN DART" />
                              <SortableHeader label="JENIS" />
                              <SortableHeader label="ASAL SATUAN" />
                              <SortableHeader label="STATUS" />
                              <SortableHeader label="AKSI CEPAT" />
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 text-slate-800 dark:text-slate-200">
                            {m.unit_data.map((u: any, idx: number) => {
                              const isItemPending = u.status === 'pending';
                              return (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                                  <td className="p-3 font-mono text-center">{idx + 1}</td>
                                  <td className="p-3 font-mono font-bold text-slate-800 dark:text-white text-center">{u.nomor_seri}</td>

                                  <td className="p-3 uppercase font-mono text-xs text-center text-slate-800 dark:text-white">{u.jenis}</td>
                                  <td className="p-3 uppercase text-center text-slate-800 dark:text-white">{u.asal_satuan}</td>
                                  <td className="p-3 text-center">
                                    <span className={`px-2 py-0.5 text-[11px] font-mono font-bold border rounded-sm
                                      ${u.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40' :
                                        u.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40' :
                                        'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40 animate-pulse'
                                      }
                                    `}>
                                      {u.status === 'approved' ? 'DISETUJUI' : u.status === 'rejected' ? 'DITOLAK' : 'MENUNGGU'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    <div className="flex gap-2 justify-center">
                                      <button
                                        type="button"
                                        disabled={processing || !isItemPending}
                                        onClick={() => handleApproveUnit(m.id, idx)}
                                        className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-mono text-xs rounded-sm transition-colors cursor-pointer"
                                        title="Setujui unit ini saja"
                                      >
                                        Terima
                                      </button>
                                      <button
                                        type="button"
                                        disabled={processing || !isItemPending}
                                        onClick={() => handleRejectUnit(m.id, idx)}
                                        className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-mono text-xs rounded-sm transition-colors cursor-pointer"
                                        title="Tolak unit ini saja"
                                      >
                                        Tolak
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab: Archive */}
      {activeTab === 'archive' && (
        <div className="glass-panel overflow-hidden">
          {dbArchivedUnits.length === 0 ? (
            <div className="p-10 text-center">
              <Archive className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-mono uppercase">Tidak ada unit yang diarsipkan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cighra-primary dark:bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-white/10 text-xs">
                  <tr>
                    <SortableHeader label="NOMOR SERI" sortKey="nomor_seri" currentSort={archiveSort} onSort={handleArchiveSort} />
                    <SortableHeader label="NAMA DART" sortKey="nama_satuan" currentSort={archiveSort} onSort={handleArchiveSort} />
                    <SortableHeader label="JENIS" sortKey="jenis" currentSort={archiveSort} onSort={handleArchiveSort} />
                    <SortableHeader label="SATUAN" sortKey="asal_satuan" currentSort={archiveSort} onSort={handleArchiveSort} />
                    <SortableHeader label="DIHAPUS PADA" sortKey="deleted_at" currentSort={archiveSort} onSort={handleArchiveSort} />
                    <SortableHeader label="AKSI" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-transparent text-slate-800 dark:text-white">
                  {sortedArchivedUnits.map((u: any) => (
                    <tr key={u.db_id} className="hover:bg-slate-50 dark:hover:bg-black/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-800 dark:text-white text-center">{u.nomor_seri}</td>
                      <td className="p-4 uppercase text-slate-800 dark:text-white text-center">{u.nama_satuan || '-'}</td>
                      <td className="p-4 uppercase text-slate-800 dark:text-white text-center">{u.jenis}</td>
                      <td className="p-4 uppercase text-slate-800 dark:text-white text-center">{u.asal_satuan}</td>
                      <td className="p-4 text-slate-800 dark:text-white font-mono text-xs text-center">{u.deleted_at}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => setRestoreModal({ isOpen: true, unit: u })}
                          className="px-3 py-1.5 bg-purple-600 text-white font-tactical text-xs tracking-widest hover:bg-purple-700 transition-all flex items-center gap-1 mx-auto cursor-pointer">
                          <RotateCcw size={12} /> KEMBALIKAN
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {historyMutations.length === 0 ? (
            <div className="glass-panel p-10 text-center">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-mono uppercase">Belum ada riwayat pengajuan.</p>
            </div>
          ) : (
            historyMutations.filter((m: any) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              const isBatch = Array.isArray(m.unit_data);
              if (isBatch) {
                return m.unit_data.some((u: any) =>
                  u.nomor_seri?.toLowerCase().includes(q) || u.asal_satuan?.toLowerCase().includes(q)
                ) || m.requested_by?.toLowerCase().includes(q);
              }
              return m.unit_data?.nomor_seri?.toLowerCase().includes(q) || m.unit_data?.asal_satuan?.toLowerCase().includes(q) || m.requested_by?.toLowerCase().includes(q);
            }).map((m: any) => {
              const isBatch = Array.isArray(m.unit_data);
              return (
                <div key={m.id} className={`glass-panel p-4 border-l-4 ${m.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <div className="flex flex-col md:flex-row justify-between gap-3">
                    <div className="flex-1 space-y-1 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        {getTypeBadge(m.type, isBatch)}
                        <span className={`px-2 py-0.5 text-[11px] font-mono font-bold border ${m.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40'}`}>
                          {m.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}
                        </span>
                      </div>
                      
                      {isBatch ? (
                        <div className="w-full">
                          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/50 pb-2 mb-2">
                            <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">
                              PENGAJUAN TAMBAH MASSAL ({m.unit_data.length} UNIT)
                            </p>
                            <button
                              type="button"
                              onClick={() => toggleExpand(m.id)}
                              className="text-xs text-cighra-primary dark:text-cighra-gold font-mono hover:underline font-bold cursor-pointer"
                            >
                              {expandedIds.includes(m.id) ? 'SEMBUNYIKAN RINCIAN ▲' : 'LIHAT RINCIAN ▼'}
                            </button>
                          </div>
                          
                          {expandedIds.includes(m.id) && (
                            <div className="mt-3 overflow-x-auto border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-cighra-darkcard/50 rounded-sm">
                              <table className="w-full text-left font-sans text-xs">
                                <thead className="bg-cighra-primary dark:bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-white/10 text-xs">
                                  <tr>
                                    <SortableHeader label="NO" />
                                    <SortableHeader label="NOMOR SERI" />
                                    <SortableHeader label="KETERANGAN" />
                                    <SortableHeader label="JENIS" />
                                    <SortableHeader label="SATUAN" />
                                    <SortableHeader label="STATUS" />
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50 text-slate-800 dark:text-slate-300">
                                  {m.unit_data.map((u: any, uIdx: number) => (
                                    <tr key={uIdx} className="hover:bg-slate-100 dark:hover:bg-slate-800/30">
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
                          )}
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">[{m.unit_data?.nomor_seri || '-'}]</p>
                      )}

                      {m.reason && <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{m.reason}"</p>}
                      {m.admin_notes && <p className="text-xs text-blue-700 dark:text-blue-400"><strong>Admin:</strong> {m.admin_notes}</p>}
                    </div>
                    <div className="text-right text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0 space-y-0.5">
                      <p>Diajukan: {m.created_at}</p>
                      <p>Oleh: {m.requested_by}</p>
                      {m.approved_by && <p>Diproses: {m.approved_by}</p>}
                      {m.document_path && (
                        <a href={m.document_path} target="_blank" rel="noopener noreferrer" className="text-cighra-primary dark:text-cighra-gold hover:underline flex items-center gap-1 justify-end">
                          <FileText size={10} /> SURAT
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {restoreModal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setRestoreModal({ isOpen: false, unit: null })}>
          <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-purple-500 dark:border-purple-400 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="p-4 border-b border-purple-500 dark:border-purple-400 bg-purple-900/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RotateCcw className="text-purple-500 dark:text-purple-400 w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
                <h3 className="font-tactical font-bold text-purple-700 dark:text-purple-300 tracking-widest uppercase">KONFIRMASI PENGEMBALIAN</h3>
              </div>
              <button onClick={() => setRestoreModal({ isOpen: false, unit: null })} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                APAKAH ANDA YAKIN INGIN MENGEMBALIKAN UNIT INI DARI ARSIP KE DATABASE AKTIF?
              </p>
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/40 p-3 space-y-1">
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase">Detail Unit:</p>
                <p className="text-sm font-bold text-purple-700 dark:text-purple-300 uppercase">
                  [{restoreModal.unit?.nomor_seri}]
                </p>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {restoreModal.unit?.jenis} — {restoreModal.unit?.asal_satuan}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleRestore(restoreModal.unit?.db_id)}
                  disabled={processing}
                  className="flex-1 py-3 bg-purple-600 text-white font-tactical font-bold tracking-widest hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <RotateCcw size={14} /> YA, KEMBALIKAN
                </button>
                <button
                  onClick={() => setRestoreModal({ isOpen: false, unit: null })}
                  className="flex-1 py-3 bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-tactical font-bold tracking-widest hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  BATAL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div> {/* End inner padding wrapper */}
      </div> {/* End outer wrapper */}
    </div>
  );
};

export default MutationApproval;

