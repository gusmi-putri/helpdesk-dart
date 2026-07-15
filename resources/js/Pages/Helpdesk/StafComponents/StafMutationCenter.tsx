import React, { useState } from 'react';
import { Users, Package } from 'lucide-react';
import MutationHistory from './MutationHistory';
import UserMutationHistory from './UserMutationHistory';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';

interface StafMutationCenterProps {
  dbMutations: any[];
  dbUserMutations: any[];
  dbSatuans: any[];
  activeTab: 'PERSONEL' | 'INVENTARIS' | 'SATUAN';
  setActiveTab: (tab: 'PERSONEL' | 'INVENTARIS' | 'SATUAN') => void;
}

const StafMutationCenter: React.FC<StafMutationCenterProps> = ({
  dbMutations,
  dbUserMutations,
  dbSatuans,
  activeTab,
  setActiveTab
}) => {
  const [satuanSearch, setSatuanSearch] = useState('');

  const pendingPersonelCount = dbUserMutations.filter((m: any) => m.status === 'pending').length;
  const pendingMutationsCount = dbMutations.filter((m: any) => m.status === 'pending').length;
  
  const pendingSatuans = dbSatuans.filter((s: any) => s.pending_action !== null);
  const pendingSatuansCount = pendingSatuans.length;

  const filteredSatuans = pendingSatuans.filter((s: any) => {
    if (!satuanSearch) return true;
    const q = satuanSearch.toLowerCase();
    return (
      (s.nama_satuan || '').toLowerCase().includes(q) ||
      (s.kode_satuan || '').toLowerCase().includes(q) ||
      (s.alamat || '').toLowerCase().includes(q)
    );
  });

  const { sortedItems: sortedSatuans, sortConfig: satuanSort, handleSort: handleSatuanSort } = useTableSort(filteredSatuans, { key: 'created_at', direction: 'desc' });

  return (
    <div className="animate-in fade-in relative space-y-4">
      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('PERSONEL')}
          className={`flex-1 py-3 px-6 text-sm font-tactical tracking-widest uppercase transition-all border-b-2 flex items-center justify-center gap-2 ${
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
          className={`flex-1 py-3 px-6 text-sm font-tactical tracking-widest uppercase transition-all border-b-2 flex items-center justify-center gap-2 ${
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
          className={`flex-1 py-3 px-6 text-sm font-tactical tracking-widest uppercase transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'SATUAN'
              ? 'border-cighra-primary dark:border-cighra-gold text-cighra-primary dark:text-cighra-gold bg-white dark:bg-slate-800/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/30'
          }`}
        >
          <Package className="w-4 h-4" /> SATUAN
          {pendingSatuansCount > 0 && (
            <span className="bg-cighra-gold text-slate-900 font-bold text-xs px-1.5 py-0.5 rounded-full ml-1">{pendingSatuansCount}</span>
          )}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'PERSONEL' && (
          <UserMutationHistory dbMutations={dbUserMutations} />
        )}
        {activeTab === 'INVENTARIS' && (
          <MutationHistory dbMutations={dbMutations} />
        )}
        {activeTab === 'SATUAN' && (
          <div className="animate-in fade-in space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
              <div className="w-full md:w-[38%] relative">
                <input
                  type="text"
                  placeholder="CARI NAMA / KODE SATUAN..."
                  value={satuanSearch}
                  onChange={(e) => setSatuanSearch(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 px-4 py-2 text-xs font-mono focus:border-cighra-gold outline-none uppercase text-slate-800 dark:text-white rounded-sm"
                />
              </div>
              <div className="w-full md:w-auto flex justify-end"></div>
            </div>

            <div className="bg-white dark:bg-cighra-darkcard/50 rounded-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-sm block md:table table-fixed">
                  <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white font-tactical tracking-wider text-xs hidden md:table-header-group">
                    <tr>
                      <SortableHeader label="NO" className="w-16 text-center" />
                      <SortableHeader label="NAMA SATUAN" sortKey="nama_satuan" currentSort={satuanSort} onSort={handleSatuanSort} className="w-[25%]" />
                      <SortableHeader label="ALAMAT" sortKey="alamat" currentSort={satuanSort} onSort={handleSatuanSort} className="w-[25%]" />
                      <SortableHeader label="KOORDINAT" className="w-[20%]" />
                      <SortableHeader label="STATUS" className="w-[15%] text-center" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent block md:table-row-group">
                    {sortedSatuans.length === 0 ? (
                      <tr className="block md:table-row">
                        <td colSpan={5} className="p-16 text-center text-slate-500 italic font-mono uppercase tracking-widest block md:table-cell">
                          Tidak ada pengajuan satuan
                        </td>
                      </tr>
                    ) : (
                      sortedSatuans.map((s: any, idx: number) => (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 block md:table-row border-b md:border-0 border-slate-200 dark:border-slate-700 mb-2 md:mb-0 pb-2 md:pb-0">
                          <td className="p-3 font-mono text-center hidden md:table-cell">{idx + 1}</td>
                          <td className="p-3 block md:table-cell">
                            <span className="inline-block md:hidden text-[10px] font-bold text-slate-400 mb-1">NAMA SATUAN:</span>
                            <div className="font-bold text-slate-800 dark:text-white uppercase">{s.nama_satuan}</div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">{s.kode_satuan || '-'}</div>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400 block md:table-cell">
                            <span className="inline-block md:hidden text-[10px] font-bold text-slate-400 mb-1">ALAMAT:</span>
                            <div className="text-xs line-clamp-1">{s.alamat || '-'}</div>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-400 block md:table-cell">
                            <span className="inline-block md:hidden text-[10px] font-bold text-slate-400 mb-1">KOORDINAT:</span>
                            <div className="text-xs font-mono">{s.latitude && s.longitude ? `${s.latitude}, ${s.longitude}` : '-'}</div>
                          </td>
                          <td className="p-3 text-center block md:table-cell">
                            <span className="inline-block md:hidden text-[10px] font-bold text-slate-400 mb-1 mr-2">STATUS:</span>
                            <span className="px-2 py-0.5 text-[11px] font-mono font-bold border rounded-sm border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10">
                              MENUNGGU
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StafMutationCenter;
