import React, { useState } from 'react';
import { GitPullRequest, CheckCircle, XCircle, Archive, RotateCcw, FileText, ExternalLink, Plus, Trash2, Clock, Search, Eye, X } from 'lucide-react';
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

  const pendingMutations = dbMutations.filter((m: any) => m.status === 'pending');
  const historyMutations = dbMutations.filter((m: any) => m.status !== 'pending');

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

  const handleRestore = (unitId: number) => {
    setProcessing(true);
    router.post(`/units/${unitId}/restore`, { reason: 'Dikembalikan dari arsip oleh Admin.' }, {
      onSuccess: () => { setRestoreModal({ isOpen: false, unit: null }); setProcessing(false); },
      onError: () => setProcessing(false),
    });
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { bg: string; icon: any; label: string }> = {
      'request_add': { bg: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40', icon: Plus, label: 'TAMBAH' },
      'request_delete': { bg: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40', icon: Trash2, label: 'HAPUS' },
      'approved_add': { bg: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40', icon: CheckCircle, label: 'TAMBAH ✓' },
      'approved_delete': { bg: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40', icon: CheckCircle, label: 'HAPUS ✓' },
      'rejected_add': { bg: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/40', icon: XCircle, label: 'TAMBAH ✗' },
      'rejected_delete': { bg: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800/40', icon: XCircle, label: 'HAPUS ✗' },
      'restore': { bg: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/40', icon: RotateCcw, label: 'RESTORE' },
    };
    const b = badges[type] || { bg: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200', icon: Clock, label: type };
    const Icon = b.icon;
    return <span className={`${b.bg} border px-2 py-0.5 text-[9px] font-mono font-bold flex items-center gap-1`}><Icon size={10} /> {b.label}</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="glass-panel border-t-4 border-t-cighra-gold p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cighra-gold/10 text-cighra-gold rounded-sm border border-cighra-gold/20">
            <GitPullRequest size={24} />
          </div>
          <div>
            <h2 className="text-xl font-tactical font-bold tracking-widest uppercase text-slate-800 dark:text-white">PERSETUJUAN MUTASI INVENTARIS</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-tighter uppercase">Kelola pengajuan penambahan & penghapusan unit DART</p>
          </div>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="CARI..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 dark:bg-cighra-dark border border-slate-200 dark:border-slate-700 rounded-sm py-2 pl-10 pr-4 text-xs font-tactical tracking-widest focus:ring-1 focus:ring-cighra-gold outline-none uppercase text-slate-800 dark:text-white" />
        </div>
      </div>

      {/* Tabs */}
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

      {/* Tab: Pending */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingMutations.length === 0 ? (
            <div className="glass-panel p-10 text-center">
              <CheckCircle className="w-10 h-10 text-green-300 dark:text-green-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-mono uppercase">Tidak ada pengajuan yang menunggu persetujuan.</p>
            </div>
          ) : (
            pendingMutations.map((m: any) => (
              <div key={m.id} className="glass-panel p-5 border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(m.type)}
                      <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/40 px-2 py-0.5 text-[9px] font-mono font-bold animate-pulse">MENUNGGU</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">
                      [{m.unit_data?.nomor_seri || '-'}] {m.unit_data?.nama_dart || '-'}
                    </p>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {m.unit_data?.jenis_dart} — {m.unit_data?.asal_satuan} | Diajukan: {m.created_at} oleh {m.requested_by}
                    </p>
                    {m.reason && (
                      <p className="text-xs text-slate-700 dark:text-slate-200 italic bg-slate-50 dark:bg-slate-800/50 p-2 border-l-2 border-cighra-gold">"{m.reason}"</p>
                    )}
                    {m.document_path && (
                      <a href={m.document_path} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-mono text-cighra-primary dark:text-cighra-gold hover:underline mt-1">
                        <FileText size={12} /> LIHAT SURAT PENDUKUNG <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0 lg:w-56">
                    <textarea placeholder="Catatan Admin (opsional)..." value={reviewingMutation === m.id ? adminNotes : ''}
                      onChange={(e) => { setReviewingMutation(m.id); setAdminNotes(e.target.value); }}
                      onFocus={() => setReviewingMutation(m.id)}
                      className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-2 py-1.5 text-[10px] font-mono resize-none h-16 focus:border-cighra-gold outline-none text-slate-800 dark:text-white" />
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(m.id)} disabled={processing}
                        className="flex-1 py-2 bg-green-600 text-white font-tactical text-[10px] tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-1 disabled:opacity-50">
                        <CheckCircle size={12} /> SETUJUI
                      </button>
                      <button onClick={() => handleReject(m.id)} disabled={processing}
                        className="flex-1 py-2 bg-red-600 text-white font-tactical text-[10px] tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-1 disabled:opacity-50">
                        <XCircle size={12} /> TOLAK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
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
                <thead className="bg-slate-800 text-slate-100 font-tactical tracking-widest">
                  <tr>
                    <th className="p-4">NOMOR SERI</th>
                    <th className="p-4">NAMA DART</th>
                    <th className="p-4">JENIS</th>
                    <th className="p-4">SATUAN</th>
                    <th className="p-4">DIHAPUS PADA</th>
                    <th className="p-4 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-transparent text-slate-800 dark:text-white">
                  {dbArchivedUnits.map((u: any) => (
                    <tr key={u.db_id} className="hover:bg-slate-50 dark:hover:bg-black/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-cighra-primary dark:text-cighra-gold">{u.nomor_seri}</td>
                      <td className="p-4 font-bold uppercase">{u.nama_dart}</td>
                      <td className="p-4 uppercase text-slate-500 dark:text-slate-400">{u.jenis_dart}</td>
                      <td className="p-4 uppercase text-slate-500 dark:text-slate-400">{u.asal_satuan}</td>
                      <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-[10px]">{u.deleted_at}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => setRestoreModal({ isOpen: true, unit: u })}
                          className="px-3 py-1.5 bg-purple-600 text-white font-tactical text-[10px] tracking-widest hover:bg-purple-700 transition-all flex items-center gap-1 ml-auto">
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
              <p className="text-sm text-slate-500 font-mono uppercase">Belum ada riwayat mutasi.</p>
            </div>
          ) : (
            historyMutations.filter((m: any) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return m.unit_data?.nomor_seri?.toLowerCase().includes(q) || m.unit_data?.nama_dart?.toLowerCase().includes(q) || m.requested_by?.toLowerCase().includes(q);
            }).map((m: any) => (
              <div key={m.id} className={`glass-panel p-4 border-l-4 ${m.status === 'approved' ? 'border-l-green-500' : 'border-l-red-500'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-3">
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getTypeBadge(m.type)}
                      <span className={`px-2 py-0.5 text-[9px] font-mono font-bold border ${m.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40' : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40'}`}>
                        {m.status === 'approved' ? 'DISETUJUI' : 'DITOLAK'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white uppercase">[{m.unit_data?.nomor_seri || '-'}] {m.unit_data?.nama_dart || '-'}</p>
                    {m.reason && <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{m.reason}"</p>}
                    {m.admin_notes && <p className="text-xs text-blue-700 dark:text-blue-400"><strong>Admin:</strong> {m.admin_notes}</p>}
                  </div>
                  <div className="text-right text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0 space-y-0.5">
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
            ))
          )}
        </div>
      )}
      {/* Restore Confirmation Modal */}
      {restoreModal.isOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setRestoreModal({ isOpen: false, unit: null })}>
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
                  [{restoreModal.unit?.nomor_seri}] {restoreModal.unit?.nama_dart}
                </p>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {restoreModal.unit?.jenis_dart} — {restoreModal.unit?.asal_satuan}
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleRestore(restoreModal.unit?.db_id)}
                  disabled={processing}
                  className="flex-1 py-3 bg-purple-600 text-white font-tactical font-bold tracking-widest hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
    </div>
  );
};

export default MutationApproval;
