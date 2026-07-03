import React, { useState } from 'react';
import { Search, Plus, Trash2, CheckSquare, Upload, Package } from 'lucide-react';
import SortableHeader from '@/Components/Table/SortableHeader';

interface InventorySectionProps {
  dbUnits: any[];
  unitSearch: string;
  setUnitSearch: (s: string) => void;
  filterJenis: string;
  setFilterJenis: (s: string) => void;
  filterSatuan: string;
  setFilterSatuan: (s: string) => void;
  sortConfig: { key: string, direction: 'asc' | 'desc' } | null;
  setSortConfig: (config: { key: string, direction: 'asc' | 'desc' } | null) => void;
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
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const baseJenisOptions = [
    'DART STD',
    'DART STK',
    'DART Portabel - Swing',
    'DART Portabel - Pop',
    'DART Portabel - Flip',
    'DART Marathon Target',
    'Moving Target'
  ];
  const jenisOptions = ['ALL', ...new Set([...baseJenisOptions, ...dbUnits.map((u: any) => u.jenis)])];
  const satuanOptions = ['ALL', ...new Set(dbUnits.map((u: any) => u.asal_satuan))];

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  const toggleSelectUnit = (id: number) => {
    if (selectedUnitIds.includes(id)) {
      setSelectedUnitIds(selectedUnitIds.filter(v => v !== id));
    } else {
      setSelectedUnitIds([...selectedUnitIds, id]);
    }
  };


  const unitStats = {
    TOTAL: dbUnits.length,
    SIAP: dbUnits.filter((u: any) => u.status_unit === 'Beroperasi').length,
    RUSAK: dbUnits.filter((u: any) => u.status_unit === 'Rusak').length,
    PERBAIKAN: dbUnits.filter((u: any) => u.status_unit === 'Perbaikan').length,
  };

  const filteredUnits = dbUnits.filter((u: any) => {
    const matchesSearch =
      u.nomor_seri.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.asal_satuan.toLowerCase().includes(unitSearch.toLowerCase());
    const matchesJenis = filterJenis === 'ALL' || u.jenis === filterJenis;
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL UNIT', value: unitStats.TOTAL, color: 'border-cighra-primary dark:border-cighra-gold', text: 'text-cighra-primary dark:text-cighra-gold' },
          { label: 'BEROPERASI', value: unitStats.SIAP, color: 'border-green-500', text: 'text-green-500' },
          { label: 'RUSAK / KENDALA', value: unitStats.RUSAK, color: 'border-cighra-primary dark:border-cighra-gold', text: 'text-cighra-primary dark:text-cighra-gold' },
          { label: 'DALAM PERBAIKAN', value: unitStats.PERBAIKAN, color: 'border-blue-500', text: 'text-blue-500' },
        ].map((s, i) => (
          <div key={i} className={`bg-white dark:bg-cighra-darkcard/80 border-l-4 ${s.color} p-4 shadow-md`}>
            <p className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-300 tracking-widest uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-tactical font-bold ${s.text}`}>{s.value}</p>
          </div>
        ))}
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
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-tactical font-bold text-xs tracking-widest transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> AJUKAN PENGHAPUSAN MASSAL
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>
        <div className="p-5 border-b border-slate-200 dark:border-slate-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800">
          <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
            <Package className="text-cighra-gold w-6 h-6" /> DATA INVENTARIS UNIT
          </h3>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {onRequestDeleteBatch && (
              <button
                onClick={() => {
                  setIsDeleteMode(!isDeleteMode);
                  setSelectedUnitIds([]);
                }}
                className={`px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-all border shadow-lg uppercase cursor-pointer ${
                  isDeleteMode 
                    ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-700' 
                    : 'bg-red-600 hover:bg-red-500 text-white border-red-600'
                }`}
              >
                <Trash2 className="w-4 h-4" /> {isDeleteMode ? 'TUTUP MODE HAPUS' : 'MODE HAPUS MASSAL'}
              </button>
            )}
            {onAddBatch && (
              <button
                onClick={onAddBatch}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-blue-600 shadow-lg uppercase cursor-pointer"
              >
                <Upload className="w-4 h-4" /> AJUKAN MASSAL (CSV)
              </button>
            )}
            {onAddUnit && (
              <button
                onClick={onAddUnit}
                className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-cighra-primary dark:border-cighra-gold shadow-lg uppercase cursor-pointer"
              >
                <Plus className="w-4 h-4" /> AJUKAN TAMBAH UNIT
              </button>
            )}
          </div>
        </div>

        {/* Filter Row */}
        <div className="p-4 bg-slate-50 dark:bg-cighra-dark/30 border-b border-slate-200 dark:border-slate-600 flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-72">
            <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">CARI PERANGKAT</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="SN / KETERANGAN..."
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 pl-9 pr-4 py-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold transition-colors uppercase"
              />
            </div>
          </div>
          <div className="w-full md:w-56">
            <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">JENIS UNIT</label>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold transition-colors uppercase"
            >
              {jenisOptions.map((o: any) => (
                <option key={o} value={o}>{o === 'ALL' ? 'SEMUA JENIS' : o}</option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-56">
            <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">SATUAN</label>
            <select
              value={filterSatuan}
              onChange={(e) => setFilterSatuan(e.target.value)}
              className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold transition-colors uppercase"
            >
              {satuanOptions.map((o: any) => (
                <option key={o} value={o}>{o === 'ALL' ? 'SEMUA SATUAN' : o}</option>
              ))}
            </select>
          </div>
        </div>

        {isDeleteMode && (
          <div className="p-4 bg-red-500/5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center text-[10px] font-mono text-red-600 dark:text-red-400">
            <span className="font-bold flex items-center gap-2">
              ⚠️ MODE HAPUS MASSAL AKTIF: KLIK PADA BARIS UNIT UNTUK MENANDAI PENGHAPUSAN.
            </span>
            <button
              type="button"
              onClick={() => {
                if (selectedUnitIds.length === filteredUnits.length) {
                  setSelectedUnitIds([]);
                } else {
                  setSelectedUnitIds(filteredUnits.map((u: any) => u.db_id));
                }
              }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-300 px-3 py-1 font-mono font-bold tracking-widest uppercase border border-red-500/30 transition-colors cursor-pointer"
            >
              {selectedUnitIds.length === filteredUnits.length ? 'BATAL PILIH SEMUA' : 'PILIH SEMUA'}
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                {isDeleteMode && (
                  <th className="p-4 w-28 text-center text-red-500 font-mono text-xs uppercase tracking-wider">
                    PILIHAN HAPUS
                  </th>
                )}
                <SortableHeader label="NOMOR SERI" sortKey="nomor_seri" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="JENIS" sortKey="jenis" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="ASAL SATUAN / LOKASI" sortKey="asal_satuan" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="STATUS" sortKey="status_unit" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="MAINTENANCE" sortKey="last_maintenance" currentSort={sortConfig} onSort={handleSort} />
                {onRequestDelete && !isDeleteMode && <SortableHeader label="OPSI" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={isDeleteMode ? 7 : (onRequestDelete ? 6 : 5)} className="p-10 text-center text-slate-500 dark:text-slate-400 font-mono italic uppercase tracking-widest">Tidak ada unit yang ditemukan.</td>
                </tr>
              ) : (
                filteredUnits.map((u: any) => {
                  const isSelected = selectedUnitIds.includes(u.db_id);
                  return (
                    <tr
                      key={u.db_id}
                      onClick={isDeleteMode ? () => toggleSelectUnit(u.db_id) : undefined}
                      className={`transition-colors group bg-white dark:bg-transparent ${
                        isDeleteMode 
                          ? 'cursor-pointer select-none' 
                          : ''
                      } ${
                        isSelected 
                          ? 'bg-red-500/5 dark:bg-red-950/20 border-l-4 border-l-red-600' 
                          : isDeleteMode 
                            ? 'hover:bg-slate-50 dark:hover:bg-slate-800/30 border-l-4 border-l-transparent' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {isDeleteMode && (
                        <td className="p-4 text-center">
                          {isSelected ? (
                            <span className="px-2.5 py-1 bg-red-600/90 text-white text-[9px] font-mono font-bold tracking-widest uppercase inline-block border border-red-700">
                              HAPUS
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[9px] font-mono font-bold tracking-widest uppercase inline-block border border-slate-200 dark:border-slate-700">
                              LEWATI
                            </span>
                          )}
                        </td>
                      )}
                      <td className="p-4 font-mono font-bold text-slate-800 dark:text-white text-center">{u.nomor_seri}</td>
                      <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-300 uppercase text-center">{u.jenis}</td>
                      <td className="p-4 text-gunmetal dark:text-slate-300 uppercase text-center">{u.asal_satuan}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase inline-block mx-auto
                          ${u.status_unit === 'Beroperasi' ? 'bg-camogreen/10 text-camogreen border-camogreen/30' :
                            u.status_unit === 'Rusak' ? 'bg-cighra-primary/10 dark:bg-cighra-gold/10 text-cighra-primary dark:text-cighra-gold border-cighra-primary dark:border-cighra-gold/30' :
                              u.status_unit === 'Perbaikan' ? 'bg-blue-900/10 text-blue-500 border-blue-800/30' :
                                'bg-slate-900/10 text-slate-500 border-slate-800/30'}
                        `}>
                          {u.status_unit === 'Perbaikan' ? 'Dalam Perbaikan' : u.status_unit}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[10px] text-slate-500 dark:text-slate-400 text-center">{u.last_maintenance}</td>

                      {onRequestDelete && !isDeleteMode && (
                        <td className="p-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRequestDelete(u);
                            }}
                            className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm cursor-pointer mx-auto block"
                            title="Ajukan Penghapusan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventorySection;

