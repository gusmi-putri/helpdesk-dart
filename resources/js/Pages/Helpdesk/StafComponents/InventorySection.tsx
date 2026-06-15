import React, { useState } from 'react';
import { Search, Plus, Trash2, CheckSquare, Download, Upload, Package, Filter, ArrowUp, ArrowDown } from 'lucide-react';

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

  const handleDownloadTemplate = () => {
    const csvContent = "nomor_seri,nama_dart,jenis_dart,asal_satuan,status_unit\nCONTOH-001,KETERANGAN DART,DART STD,NAMA SATUAN,Beroperasi";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_unit_dart.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const unitStats = {
    TOTAL: dbUnits.length,
    SIAP: dbUnits.filter((u: any) => u.status_unit === 'Beroperasi').length,
    RUSAK: dbUnits.filter((u: any) => u.status_unit === 'Rusak').length,
    PERBAIKAN: dbUnits.filter((u: any) => u.status_unit === 'Perbaikan').length,
  };

  const filteredUnits = dbUnits.filter((u: any) => {
    const matchesSearch = u.nama_dart.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.nomor_seri.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.asal_satuan.toLowerCase().includes(unitSearch.toLowerCase());
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
            <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">SATUAN KERJA</label>
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

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-slate-700">
              <tr>
                {onRequestDeleteBatch && (
                  <th className="p-4 w-10">
                    <input
                      type="checkbox"
                      onChange={toggleSelectAll}
                      checked={filteredUnits.length > 0 && selectedUnitIds.length === filteredUnits.length}
                      className="w-4 h-4 cursor-pointer accent-cighra-primary dark:accent-cighra-gold"
                    />
                  </th>
                )}
                {[
                  { label: 'NOMOR SERI', key: 'nomor_seri' },
                  { label: 'JENIS', key: 'jenis_dart' },
                  { label: 'ASAL SATUAN / LOKASI', key: 'asal_satuan' },
                  { label: 'STATUS', key: 'status_unit' },
                  { label: 'MAINTENANCE', key: 'last_maintenance' },
                  { label: 'KETERANGAN', key: 'nama_dart' },
                ].map((col) => (
                  <th
                    key={col.key}
                    className="p-4 cursor-pointer hover:text-cighra-primary dark:text-cighra-gold transition-colors"
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <Filter className="w-3 h-3 opacity-30" />
                      {sortConfig?.key === col.key && (
                        sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-cighra-primary dark:text-cighra-gold" /> : <ArrowDown className="w-3 h-3 text-cighra-primary dark:text-cighra-gold" />
                      )}
                    </div>
                  </th>
                ))}
                {onRequestDelete && <th className="p-4 text-right">OPSI</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={onRequestDeleteBatch ? 8 : 7} className="p-10 text-center text-slate-500 dark:text-slate-400 font-mono italic uppercase tracking-widest">Tidak ada unit yang ditemukan.</td>
                </tr>
              ) : (
                filteredUnits.map((u: any) => (
                  <tr key={u.db_id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group bg-white dark:bg-transparent ${selectedUnitIds.includes(u.db_id) ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                    {onRequestDeleteBatch && (
                      <td className="p-4">
                        <input type="checkbox" checked={selectedUnitIds.includes(u.db_id)} onChange={() => toggleSelectUnit(u.db_id)} className="w-4 h-4 cursor-pointer accent-cighra-primary dark:accent-cighra-gold" />
                      </td>
                    )}
                    <td className="p-4 font-mono font-bold text-cighra-primary dark:text-cighra-gold border-l-2 border-transparent group-hover:border-cighra-primary dark:border-cighra-gold">{u.nomor_seri}</td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-300 uppercase">{u.jenis_dart}</td>
                    <td className="p-4 text-gunmetal dark:text-slate-300 uppercase">{u.asal_satuan}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase
                        ${u.status_unit === 'Beroperasi' ? 'bg-camogreen/10 text-camogreen border-camogreen/30' :
                          u.status_unit === 'Rusak' ? 'bg-cighra-primary/10 dark:bg-cighra-gold/10 text-cighra-primary dark:text-cighra-gold border-cighra-primary dark:border-cighra-gold/30' :
                            u.status_unit === 'Perbaikan' ? 'bg-blue-900/10 text-blue-500 border-blue-800/30' :
                              'bg-slate-900/10 text-slate-500 border-slate-800/30'}
                      `}>
                        {u.status_unit === 'Perbaikan' ? 'Dalam Perbaikan' : u.status_unit}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[10px] text-slate-500 dark:text-slate-400">{u.last_maintenance}</td>
                    <td className="p-4 text-slate-800 dark:text-white font-bold uppercase">{u.nama_dart}</td>
                    {onRequestDelete && (
                      <td className="p-4 text-right">
                        <button onClick={() => onRequestDelete(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm cursor-pointer" title="Ajukan Penghapusan">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventorySection;
