import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Trash2, CheckSquare, Upload, Package, 
  CheckCircle, Wrench, XCircle, ChevronLeft, ChevronRight,
  MoreVertical, FileArchive, Trash, CheckCircle2, AlertTriangle, Calendar,
  RotateCcw
} from 'lucide-react';
import SortableHeader from '@/Components/Table/SortableHeader';
import { EmptyState } from '@/Components/ui/EmptyState';
import { Button } from '@/Components/ui/Button';

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
  onRequestDeleteBatch?: (units: any[]) => void;
  onRequestDelete?: (unit: any) => void;
  onEditUnit?: (unit: any) => void;
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
  onEditUnit,
}) => {
  const [selectedUnitIds, setSelectedUnitIds] = useState<number[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const filteredUnits = useMemo(() => {
    return dbUnits.filter((u: any) => {
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
  }, [dbUnits, unitSearch, filterJenis, filterSatuan, sortConfig]);

  const totalPages = Math.ceil(filteredUnits.length / itemsPerPage);
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      


      {/* 2. KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* TOTAL UNIT */}
        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50 p-3 rounded-none flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-500"></div>
          <div className="p-2.5 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ml-1">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Total Unit</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-bold font-mono text-slate-800 dark:text-white">{unitStats.TOTAL}</h4>
            </div>
          </div>
        </div>

        {/* BEROPERASI */}
        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50 p-3 rounded-none flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>
          <div className="p-2.5 rounded-none bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 ml-1">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Beroperasi</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-bold font-mono text-slate-800 dark:text-white">{unitStats.SIAP}</h4>
            </div>
          </div>
        </div>

        {/* DALAM PERBAIKAN */}
        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50 p-3 rounded-none flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
          <div className="p-2.5 rounded-none bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 ml-1">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Dlm Perbaikan</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-bold font-mono text-slate-800 dark:text-white">{unitStats.PERBAIKAN}</h4>
            </div>
          </div>
        </div>

        {/* RUSAK */}
        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50 p-3 rounded-none flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
          <div className="p-2.5 rounded-none bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 ml-1">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Rusak</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-bold font-mono text-slate-800 dark:text-white">{unitStats.RUSAK}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* DELETE BATCH WARNING */}
      {onRequestDeleteBatch && selectedUnitIds.length > 0 && isDeleteMode && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-4 flex justify-between items-center shadow-sm animate-in slide-in-from-top-2 rounded-none">
          <p className="text-[11px] font-mono font-bold text-red-700 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
            <CheckSquare className="w-5 h-5" /> {selectedUnitIds.length} UNIT TERPILIH UNTUK DIHAPUS
          </p>
          <button
            onClick={() => {
              const selected = dbUnits.filter(u => selectedUnitIds.includes(u.db_id));
              onRequestDeleteBatch(selected);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-none font-tactical font-bold text-[11px] tracking-widest transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4" /> EKSEKUSI HAPUS
          </button>
        </div>
      )}

      {/* 3. FILTER TOOLBAR */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
        <div className="w-full md:flex-1">
          <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Cari Perangkat</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="NOMOR SERI / LOKASI..."
              value={unitSearch}
              onChange={(e) => { setUnitSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 pl-10 pr-4 py-2.5 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold focus:ring-1 focus:ring-cighra-primary/30 transition-all uppercase rounded-none"
            />
          </div>
        </div>

        <div className="w-full md:w-44">
          <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Jenis</label>
          <select
            value={filterJenis}
            onChange={(e) => { setFilterJenis(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold focus:ring-1 focus:ring-cighra-primary/30 transition-all uppercase rounded-none"
          >
            {jenisOptions.map((o: any) => (
              <option key={o} value={o}>{o === 'ALL' ? 'SEMUA JENIS' : o}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-44">
          <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Satuan</label>
          <select
            value={filterSatuan}
            onChange={(e) => { setFilterSatuan(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold focus:ring-1 focus:ring-cighra-primary/30 transition-all uppercase rounded-none"
          >
            {satuanOptions.map((o: any) => (
              <option key={o} value={o}>{o === 'ALL' ? 'SEMUA SATUAN' : o}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <button 
            onClick={() => {
              setUnitSearch('');
              setFilterJenis('ALL');
              setFilterSatuan('ALL');
              setCurrentPage(1);
            }}
            className="w-full md:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold font-mono uppercase tracking-wider rounded-none transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* 4. TABLE SECTION */}
      <div className="bg-white dark:bg-cighra-darkcard/70 border border-slate-200 dark:border-slate-600 rounded-sm overflow-hidden shadow-xl mt-4">
        
        {/* Card Header (Navy) */}
        <div className="p-4 border-b border-white/10 bg-cighra-primary dark:bg-slate-800 flex items-center justify-between text-white">
          <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2">
            <Package className="w-4 h-4 text-cighra-gold" />
            <span className="font-bold">DATABASE INVENTARIS UNIT</span>
            <span className="bg-slate-700 text-slate-300 text-[10px] font-mono px-2.5 py-1 rounded-sm uppercase font-bold tracking-widest">
              {filteredUnits.length} Unit
            </span>
          </h3>
          <div className="flex items-center gap-2 ml-auto">
            {onRequestDeleteBatch && (
              <button
                onClick={() => {
                  setIsDeleteMode(!isDeleteMode);
                  setSelectedUnitIds([]);
                }}
                className={`px-3 py-1.5 text-[10px] font-tactical font-bold tracking-widest flex items-center gap-1.5 transition-all border uppercase cursor-pointer ${
                  isDeleteMode
                    ? 'bg-slate-600 hover:bg-slate-500 text-white border-slate-500'
                    : 'bg-red-600/80 hover:bg-red-600 text-white border-red-500/50'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" /> {isDeleteMode ? 'TUTUP MODE HAPUS' : 'MODE HAPUS MASSAL'}
              </button>
            )}
            {onAddBatch && (
              <button
                onClick={onAddBatch}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[10px] font-tactical font-bold tracking-widest flex items-center gap-1.5 transition-colors uppercase cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> AJUKAN MASSAL (CSV)
              </button>
            )}
            {onAddUnit && (
              <button
                onClick={onAddUnit}
                className="px-3 py-1.5 bg-cighra-gold hover:bg-cighra-gold/90 text-slate-900 text-[10px] font-tactical font-bold tracking-widest flex items-center gap-1.5 transition-colors border border-cighra-gold uppercase cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> TAMBAH UNIT
              </button>
            )}
          </div>
        </div>

        {isDeleteMode && (
          <div className="p-3 bg-red-50 border-b border-red-100 flex justify-between items-center text-[11px] font-mono font-bold text-red-600 tracking-wider uppercase">
            <span className="flex items-center gap-2">
              ⚠️ MODE HAPUS MASSAL AKTIF: KLIK BARIS UNTUK MENANDAI
            </span>
            <button
              type="button"
              onClick={() => {
                if (selectedUnitIds.length === filteredUnits.length) setSelectedUnitIds([]);
                else setSelectedUnitIds(filteredUnits.map((u: any) => u.db_id));
              }}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-1.5 rounded-none transition-colors cursor-pointer"
            >
              {selectedUnitIds.length === filteredUnits.length ? 'BATAL PILIH SEMUA' : 'PILIH SEMUA'}
            </button>
          </div>
        )}

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left font-sans table-fixed min-w-[800px]">
            {/* Table Header */}
            <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white">
              <tr>
                {isDeleteMode && (
                  <th className="p-4 w-[8%] text-center text-red-400 font-tactical tracking-widest uppercase">
                    PILIH
                  </th>
                )}
                <SortableHeader label="NOMOR SERI" sortKey="nomor_seri" currentSort={sortConfig} onSort={handleSort} width="20%" />
                <SortableHeader label="JENIS" sortKey="jenis" currentSort={sortConfig} onSort={handleSort} width="20%" />
                <SortableHeader label="ASAL SATUAN" sortKey="asal_satuan" currentSort={sortConfig} onSort={handleSort} width="24%" />
                <SortableHeader label="STATUS" sortKey="status_unit" currentSort={sortConfig} onSort={handleSort} width="15%" />
                <SortableHeader label="MAINTENANCE" sortKey="last_maintenance" currentSort={sortConfig} onSort={handleSort} width="15%" />
                {!isDeleteMode && (
                  <SortableHeader label="OPSI" width="6%" />
                )}
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent">
              {paginatedUnits.length === 0 ? (
                <tr>
                  <td colSpan={isDeleteMode ? 7 : 6} className="p-12 text-center">
                    <EmptyState 
                      icon={<Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />}
                      title="BELUM ADA DATA INVENTARIS" 
                      description="Silakan tambahkan unit baru menggunakan tombol di atas." 
                    />
                  </td>
                </tr>
              ) : (
                paginatedUnits.map((u: any) => (
                  <tr 
                    key={u.db_id} 
                    className={`hover:bg-blue-100/50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer ${
                      selectedUnitIds.includes(u.db_id) ? 'bg-red-50/50' : ''
                    }`}
                    onClick={() => isDeleteMode && toggleSelectUnit(u.db_id)}
                  >
                    {isDeleteMode && (
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div 
                          className={`w-5 h-5 mx-auto rounded-sm border flex items-center justify-center cursor-pointer transition-colors ${
                            selectedUnitIds.includes(u.db_id) 
                              ? 'bg-red-500 border-red-500' 
                              : 'border-slate-300 dark:border-slate-600 hover:border-red-400'
                          }`}
                          onClick={() => toggleSelectUnit(u.db_id)}
                        >
                          {selectedUnitIds.includes(u.db_id) && <CheckSquare className="w-3 h-3 text-white" />}
                        </div>
                      </td>
                    )}
                    
                    {/* NOMOR SERI */}
                    <td className="p-4 align-middle">
                      <div className="text-[16px] font-[700] font-mono text-slate-800 dark:text-white uppercase tracking-tight">
                        {u.nomor_seri}
                      </div>
                    </td>

                    {/* JENIS */}
                    <td className="p-4 align-middle text-center">
                      <span className="text-[13px] font-mono font-medium text-slate-700 dark:text-slate-300 uppercase">
                        {u.jenis}
                      </span>
                    </td>

                    {/* LOKASI */}
                    <td className="p-4 align-middle text-center">
                      <span className="text-[13px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase line-clamp-2" title={u.asal_satuan}>
                        {u.asal_satuan}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="p-4 align-middle text-center">
                      <span className={`inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-widest font-mono border ${
                        u.status_unit === 'Beroperasi' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                        u.status_unit === 'Perbaikan' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
                        'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                      }`}>
                        {u.status_unit === 'Perbaikan' ? 'DALAM PERBAIKAN' : u.status_unit}
                      </span>
                    </td>

                    {/* MAINTENANCE */}
                    <td className="p-4 align-middle text-center">
                      <span className="text-slate-600 dark:text-slate-400 font-mono text-[12px] font-medium uppercase">
                        {u.last_maintenance || '-'}
                      </span>
                    </td>

                    {/* OPSI */}
                    {!isDeleteMode && (
                      <td className="p-4 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center gap-2">
                          {onEditUnit && (
                            <button
                              type="button"
                              onClick={() => onEditUnit(u)}
                              className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-600 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                              title="Edit Unit"
                            >
                              <Wrench className="w-4 h-4" />
                            </button>
                          )}
                          {onRequestDelete && (
                            <button
                              type="button"
                              onClick={() => onRequestDelete(u)}
                              className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                              title="Hapus Unit"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. PAGINATION */}
        <div className="bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-tactical font-bold text-slate-500 uppercase tracking-widest">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 rounded-none text-[11px] font-mono px-2 py-1.5 focus:outline-none focus:border-cighra-primary text-slate-700 dark:text-slate-300"
            >
              <option value={10}>10 Baris</option>
              <option value={20}>20 Baris</option>
              <option value={50}>50 Baris</option>
            </select>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-none disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs uppercase tracking-wider font-bold"
            >
              SEBELUMNYA
            </button>
            <div className="px-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              HALAMAN {currentPage} DARI {Math.max(1, totalPages)}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-none disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs uppercase tracking-wider font-bold"
            >
              SELANJUTNYA
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InventorySection;
