import React from 'react';
import { Package, Search, Plus, Filter, ArrowUp, ArrowDown, History, Edit, Trash2, Upload, CheckCircle, AlertTriangle, X, Download } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

interface UnitsTableProps {
  dbUnits: any[];
  unitSearch: string;
  setUnitSearch: (s: string) => void;
  handleAddUnit?: () => void;
  onImportBatch?: () => void;
  unitSortConfig: { key: string, direction: 'asc' | 'desc' } | null;
  handleUnitSort: (key: string) => void;
  handleShowUnitHistory: (unit: any) => void;
  handleEditUnit?: (unit: any) => void;
  handleDeleteUnit?: (unit: any) => void;
}

const UnitsTable: React.FC<UnitsTableProps> = ({
  dbUnits,
  unitSearch,
  setUnitSearch,
  handleAddUnit,
  onImportBatch,
  unitSortConfig,
  handleUnitSort,
  handleShowUnitHistory,
  handleEditUnit,
  handleDeleteUnit
}) => {
  const [importResult, setImportResult] = React.useState<any>(null);

  // Local filter states
  const [filterJenis, setFilterJenis] = React.useState('ALL');
  const [filterSatuan, setFilterSatuan] = React.useState('ALL');

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

  // Read flash data from Inertia
  const { flash } = usePage().props as any;

  React.useEffect(() => {
    if (flash?.import_result) {
      try {
        const result = JSON.parse(flash.import_result);
        setImportResult(result);
      } catch (e) {
        // ignore parse error
      }
    }
  }, [flash?.import_result]);

  const unitStats = {
    TOTAL: dbUnits.length,
    SIAP: dbUnits.filter((u: any) => u.status_unit === 'Beroperasi').length,
    RUSAK: dbUnits.filter((u: any) => u.status_unit === 'Rusak').length,
    PERBAIKAN: dbUnits.filter((u: any) => u.status_unit === 'Perbaikan').length,
  };

  const filteredUnits = dbUnits.filter((u: any) => {
    const matchesSearch = u.nomor_seri.toLowerCase().includes(unitSearch.toLowerCase()) ||
      u.asal_satuan.toLowerCase().includes(unitSearch.toLowerCase());
    const matchesJenis = filterJenis === 'ALL' || u.jenis === filterJenis;
    const matchesSatuan = filterSatuan === 'ALL' || u.asal_satuan === filterSatuan;
    return matchesSearch && matchesJenis && matchesSatuan;
  }).sort((a: any, b: any) => {
    if (!unitSortConfig) return 0;
    const { key, direction } = unitSortConfig;
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

      <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>
        <div className="p-5 border-b border-slate-200 dark:border-slate-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800">
          <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
            <Package className="text-cighra-gold w-6 h-6" /> DATA INVENTARIS UNIT
          </h3>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {onImportBatch && (
              <button
                onClick={onImportBatch}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-blue-600 shadow-lg uppercase cursor-pointer"
              >
                <Upload className="w-4 h-4" /> IMPORT CSV
              </button>
            )}
            {handleAddUnit && (
              <button
                onClick={handleAddUnit}
                className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-cighra-primary dark:border-cighra-gold shadow-lg uppercase cursor-pointer"
              >
                <Plus className="w-4 h-4" /> TAMBAH UNIT
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
                {[
                  { label: 'NOMOR SERI', key: 'nomor_seri' },
                  { label: 'JENIS', key: 'jenis' },
                  { label: 'ASAL SATUAN / LOKASI', key: 'asal_satuan' },
                  { label: 'STATUS', key: 'status_unit' },
                  { label: 'MAINTENANCE', key: 'last_maintenance' },

                ].map((col) => (
                  <th
                    key={col.key}
                    className="p-4 cursor-pointer hover:text-cighra-primary dark:text-cighra-gold transition-colors"
                    onClick={() => handleUnitSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <Filter className="w-3 h-3 opacity-30" />
                      {unitSortConfig?.key === col.key && (
                        unitSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-cighra-primary dark:text-cighra-gold" /> : <ArrowDown className="w-3 h-3 text-cighra-primary dark:text-cighra-gold" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-4 text-right">OPSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-slate-500 dark:text-slate-400 font-mono italic uppercase tracking-widest">Tidak ada unit yang ditemukan.</td>
                </tr>
              ) : (
                filteredUnits.map((u: any) => (
                  <tr key={u.db_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group bg-white dark:bg-transparent">
                    <td className="p-4 font-mono font-bold text-cighra-primary dark:text-cighra-gold border-l-2 border-transparent group-hover:border-cighra-primary dark:border-cighra-gold">{u.nomor_seri}</td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-300 uppercase">{u.jenis}</td>
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

                    <td className="p-4 flex gap-2 justify-end">
                      <button onClick={() => handleShowUnitHistory(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 text-slate-500 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Riwayat">
                        <History className="w-4 h-4" />
                      </button>
                      {handleEditUnit && (
                        <button onClick={() => handleEditUnit(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 text-slate-500 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {handleDeleteUnit && (
                        <button onClick={() => handleDeleteUnit(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Hapus">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Import Result Modal */}
      {importResult && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setImportResult(null)}>
          <div className="bg-white dark:bg-cighra-dark border border-slate-300 dark:border-slate-600 shadow-2xl max-w-md w-full mx-4 rounded-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`p-4 flex items-center justify-between ${importResult.success ? 'bg-camogreen/10 border-b border-camogreen/20' : 'bg-cighra-primary/10 dark:bg-cighra-gold/10 border-b border-cighra-primary dark:border-cighra-gold/20'}`}>
              <h3 className="font-tactical font-bold tracking-widest text-sm flex items-center gap-2 text-slate-800 dark:text-white uppercase">
                {importResult.success ? <CheckCircle className="w-5 h-5 text-camogreen" /> : <AlertTriangle className="w-5 h-5 text-cighra-primary dark:text-cighra-gold" />}
                HASIL IMPORT DATA
              </h3>
              <button onClick={() => setImportResult(null)} className="text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:text-cighra-gold transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {importResult.success ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white dark:bg-cighra-darkcard/80 p-3 border border-slate-200 dark:border-slate-600">
                      <p className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-1">TOTAL BARIS</p>
                      <p className="text-xl font-tactical font-bold text-slate-800 dark:text-white">{importResult.total}</p>
                    </div>
                    <div className="bg-white dark:bg-cighra-darkcard/80 p-3 border border-camogreen/30">
                      <p className="text-[9px] font-mono font-bold text-camogreen uppercase tracking-widest mb-1">BERHASIL</p>
                      <p className="text-xl font-tactical font-bold text-camogreen">{importResult.imported}</p>
                    </div>
                    <div className="bg-white dark:bg-cighra-darkcard/80 p-3 border border-yellow-500/30">
                      <p className="text-[9px] font-mono font-bold text-yellow-500 uppercase tracking-widest mb-1">DILEWATI</p>
                      <p className="text-xl font-tactical font-bold text-yellow-500">{importResult.skipped}</p>
                    </div>
                  </div>
                  {importResult.skipped > 0 && (
                    <p className="text-[10px] font-mono text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 p-2 border border-yellow-500/20">
                      ⚠ {importResult.skipped} baris dilewati karena Nomor Seri sudah terdaftar di sistem.
                    </p>
                  )}
                  <p className="text-[10px] font-mono text-slate-500 dark:text-slate-300 text-center uppercase">
                    Data inventaris telah diperbarui secara otomatis.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-cighra-primary dark:text-cighra-gold font-mono">{importResult.message || 'Terjadi kesalahan saat memproses file.'}</p>
              )}
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-600 flex justify-end">
              <button
                onClick={() => setImportResult(null)}
                className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-6 py-2 text-xs font-tactical font-bold tracking-widest transition-colors"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnitsTable;
