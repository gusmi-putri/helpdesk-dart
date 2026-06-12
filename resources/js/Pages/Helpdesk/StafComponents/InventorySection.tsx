import React, { useState } from 'react';
import { Search, Plus, Trash2, FileText, CheckSquare } from 'lucide-react';

interface InventorySectionProps {
  dbUnits: any[];
  unitSearch: string;
  setUnitSearch: (s: string) => void;
  filterJenis: string;
  setFilterJenis: (s: string) => void;
  filterSatuan: string;
  setFilterSatuan: (s: string) => void;
  sortConfig: {key: string, direction: 'asc' | 'desc'} | null;
  setSortConfig: (config: {key: string, direction: 'asc' | 'desc'} | null) => void;
  onAddUnit?: () => void;
  onAddBatch?: () => void;
  onRequestDelete?: (unit: any) => void;
  onRequestDeleteBatch?: (units: any[]) => void;
}

const InventorySection: React.FC<InventorySectionProps> = ({
  dbUnits,
  unitSearch,
  setUnitSearch,
  filterJenis,
  setFilterJenis,
  filterSatuan,
  setFilterSatuan,
  sortConfig,
  setSortConfig,
  onAddUnit,
  onAddBatch,
  onRequestDelete,
  onRequestDeleteBatch,
}) => {
  const [selectedUnitIds, setSelectedUnitIds] = useState<number[]>([]);
  const jenisOptions = ['ALL', ...new Set(dbUnits.map((u: any) => u.jenis_dart))];
  const satuanOptions = ['ALL', ...new Set(dbUnits.map((u: any) => u.asal_satuan))];

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUnitIds(filteredUnits.map((u: any) => u.db_id));
    } else {
      setSelectedUnitIds([]);
    }
  };

  const toggleSelectUnit = (id: number) => {
    if (selectedUnitIds.includes(id)) {
      setSelectedUnitIds(selectedUnitIds.filter(v => v !== id));
    } else {
      setSelectedUnitIds([...selectedUnitIds, id]);
    }
  };

  const filteredUnits = dbUnits.filter((u: any) => {
    const matchesSearch = u.nama_dart.toLowerCase().includes(unitSearch.toLowerCase()) || 
                         u.nomor_seri.toLowerCase().includes(unitSearch.toLowerCase());
    const matchesJenis = filterJenis === 'ALL' || u.jenis_dart === filterJenis;
    const matchesSatuan = filterSatuan === 'ALL' || u.asal_satuan === filterSatuan;
    return matchesSearch && matchesJenis && matchesSatuan;
  }).sort((a: any, b: any) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="animate-in fade-in space-y-6 mt-6">
      <div className="bg-white dark:bg-cighra-dark/50 border border-slate-200 dark:border-slate-600 p-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <label className="block text-[10px] font-mono font-bold text-slate-500 dark:text-slate-300 mb-1 uppercase">CARI PERANGKAT</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="SN / KETERANGAN..." 
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 pl-10 pr-4 py-2 text-xs font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none uppercase text-slate-800 dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">JENIS UNIT</label>
            <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)} className="w-full bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 px-4 py-2 text-xs font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none uppercase text-slate-800 dark:text-white">
              {jenisOptions.map((o: any) => <option key={o} value={o}>{o === 'ALL' ? 'SEMUA' : o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">SATUAN KERJA</label>
            <select value={filterSatuan} onChange={(e) => setFilterSatuan(e.target.value)} className="w-full bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 px-4 py-2 text-xs font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none uppercase text-slate-800 dark:text-white">
              {satuanOptions.map((o: any) => <option key={o} value={o}>{o === 'ALL' ? 'SEMUA' : o}</option>)}
            </select>
          </div>
          {onAddUnit && (
            <div className="flex flex-col xl:flex-row items-end gap-2 xl:col-span-1">
              <button onClick={onAddUnit}
                className="w-full bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900 px-4 py-2 font-tactical font-bold text-xs tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> AJUKAN TAMBAH UNIT
              </button>
              {onAddBatch && (
                <button onClick={onAddBatch}
                  className="w-full bg-slate-800 dark:bg-slate-700 text-white dark:text-slate-200 px-4 py-2 font-tactical font-bold text-xs tracking-widest hover:bg-slate-700 dark:hover:bg-slate-600 transition-all flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" /> MASSAL (CSV)
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {onRequestDeleteBatch && selectedUnitIds.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-3 flex justify-between items-center shadow-md animate-in slide-in-from-top-2">
          <p className="text-sm font-tactical font-bold text-red-700 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
            <CheckSquare className="w-4 h-4" /> {selectedUnitIds.length} UNIT TERPILIH
          </p>
          <button 
            onClick={() => {
              const selected = dbUnits.filter(u => selectedUnitIds.includes(u.db_id));
              onRequestDeleteBatch(selected);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-tactical font-bold text-xs tracking-widest transition-colors flex items-center gap-2 shadow-sm"
          >
            <Trash2 className="w-4 h-4" /> AJUKAN PENGHAPUSAN MASSAL
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-cighra-darkcard/70 border border-slate-200 dark:border-slate-600 rounded-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-slate-700">
              <tr>
                {onRequestDeleteBatch && (
                  <th className="p-4 w-10"></th>
                )}
                <th className="p-4 cursor-pointer hover:text-cighra-gold" onClick={() => handleSort('nomor_seri')}>SN</th>
                <th className="p-4 cursor-pointer hover:text-cighra-gold" onClick={() => handleSort('jenis_dart')}>JENIS</th>
                <th className="p-4 cursor-pointer hover:text-cighra-gold" onClick={() => handleSort('asal_satuan')}>SATUAN</th>
                <th className="p-4 cursor-pointer hover:text-cighra-gold" onClick={() => handleSort('status_unit')}>STATUS</th>
                <th className="p-4">CEK</th>
                <th className="p-4 cursor-pointer hover:text-cighra-gold" onClick={() => handleSort('nama_dart')}>KETERANGAN</th>
                {onRequestDelete && <th className="p-4 text-right">OPSI</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-soft-sand/5 text-slate-800 dark:text-white bg-white dark:bg-transparent">
              {filteredUnits.map((u: any) => (
                <tr key={u.db_id} className={`hover:bg-slate-50 dark:hover:bg-black/40 transition-colors group ${selectedUnitIds.includes(u.db_id) ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                  {onRequestDeleteBatch && (
                    <td className="p-4">
                      <input type="checkbox" checked={selectedUnitIds.includes(u.db_id)} onChange={() => toggleSelectUnit(u.db_id)} className="w-4 h-4 cursor-pointer accent-cighra-primary dark:accent-cighra-gold" />
                    </td>
                  )}
                  <td className="p-4 font-mono font-bold text-cighra-primary dark:text-cighra-gold">{u.nomor_seri}</td>
                  <td className="p-4 uppercase text-slate-500 dark:text-slate-400">{u.jenis_dart}</td>
                  <td className="p-4 uppercase text-slate-500 dark:text-slate-400">{u.asal_satuan}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest shadow-sm
                      ${u.status_unit === 'Beroperasi' ? 'bg-camogreen dark:bg-camogreen/20 text-white dark:text-green-400 border-camogreen dark:border-camogreen/30' : 
                        u.status_unit === 'Rusak' ? 'bg-red-50 dark:bg-cighra-gold/10 text-red-700 dark:text-cighra-gold border-red-200 dark:border-cighra-gold/30' : 
                        u.status_unit === 'Perbaikan' ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-500 border-blue-200 dark:border-blue-800/30' :
                        'bg-slate-50 dark:bg-slate-900/10 text-slate-700 dark:text-slate-500 border-slate-200 dark:border-slate-800/30'}
                    `}>
                      {u.status_unit === 'Perbaikan' ? 'DALAM PERBAIKAN' : u.status_unit.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[10px] text-slate-400 dark:text-slate-400">{u.last_maintenance}</td>
                  <td className="p-4 font-bold uppercase">{u.nama_dart}</td>
                  {onRequestDelete && (
                    <td className="p-4 text-right">
                      <button onClick={() => onRequestDelete(u)}
                        className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Ajukan Penghapusan">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventorySection;
