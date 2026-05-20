import React from 'react';
import { Package, Search, Plus, Filter, ArrowUp, ArrowDown, History, Edit, Trash2, Upload, CheckCircle, AlertTriangle, X, Download } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

interface UnitsTableProps {
  dbUnits: any[];
  unitSearch: string;
  setUnitSearch: (s: string) => void;
  handleAddUnit: () => void;
  unitSortConfig: { key: string, direction: 'asc' | 'desc' } | null;
  handleUnitSort: (key: string) => void;
  handleShowUnitHistory: (unit: any) => void;
  handleEditUnit: (unit: any) => void;
  handleDeleteUnit: (unit: any) => void;
}

const UnitsTable: React.FC<UnitsTableProps> = ({
  dbUnits,
  unitSearch,
  setUnitSearch,
  handleAddUnit,
  unitSortConfig,
  handleUnitSort,
  handleShowUnitHistory,
  handleEditUnit,
  handleDeleteUnit
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [importResult, setImportResult] = React.useState<any>(null);

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

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      router.post('/units/import', formData, {
        onFinish: () => {
          setIsUploading(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      });
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = "nomor_seri,nama_dart,jenis_dart,asal_satuan,status_unit\nCONTOH-001,NAMA UNIT DART,DART STD,NAMA SATUAN,Siap Ops";
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
    SIAP: dbUnits.filter((u: any) => u.status_unit === 'Siap Ops').length,
    RUSAK: dbUnits.filter((u: any) => u.status_unit === 'Rusak').length,
    PERBAIKAN: dbUnits.filter((u: any) => u.status_unit === 'Perbaikan').length,
  };

  const filteredUnits = dbUnits.filter((u: any) =>
    u.nomor_seri.toLowerCase().includes(unitSearch.toLowerCase()) ||
    u.nama_dart.toLowerCase().includes(unitSearch.toLowerCase()) ||
    u.asal_satuan.toLowerCase().includes(unitSearch.toLowerCase())
  ).sort((a: any, b: any) => {
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
          { label: 'SIAP OPERASIONAL', value: unitStats.SIAP, color: 'border-green-500', text: 'text-green-500' },
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
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500 dark:text-slate-300" />
              <input
                type="text"
                placeholder="CARI SERI / NAMA / LOKASI..."
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 pl-9 pr-4 py-2 text-sm font-mono text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:border-cighra-gold transition-colors w-64 uppercase"
              />
            </div>
            <input 
              type="file" 
              accept=".csv,.txt" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImport}
            />
            <button
              onClick={handleDownloadTemplate}
              className="bg-cighra-light dark:bg-slate-800 hover:bg-cighra-light dark:hover:bg-gunmetal/80 text-slate-600 dark:text-slate-300 px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-slate-300 dark:border-slate-600 shadow uppercase"
            >
              <Download className="w-4 h-4" /> TEMPLATE
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className={`bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-blue-600 shadow-lg uppercase ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Upload className={`w-4 h-4 ${isUploading ? 'animate-bounce' : ''}`} /> {isUploading ? 'MENGUNGGAH...' : 'IMPORT CSV'}
            </button>
            <button
              onClick={handleAddUnit}
              className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-cighra-primary dark:border-cighra-gold shadow-lg uppercase"
            >
              <Plus className="w-4 h-4" /> TAMBAH UNIT
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-slate-700">
              <tr>
                {[
                  { label: 'NOMOR SERI', key: 'nomor_seri' },
                  { label: 'NAMA UNIT', key: 'nama_dart' },
                  { label: 'JENIS', key: 'jenis_dart' },
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
                    <td className="p-4 text-slate-800 dark:text-white font-bold uppercase">{u.nama_dart}</td>
                    <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-300 uppercase">{u.jenis_dart}</td>
                    <td className="p-4 text-gunmetal dark:text-slate-300 uppercase">{u.asal_satuan}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase
                        ${u.status_unit === 'Siap Ops' ? 'bg-camogreen/10 text-camogreen border-camogreen/30' :
                          u.status_unit === 'Rusak' ? 'bg-cighra-primary/10 dark:bg-cighra-gold/10 text-cighra-primary dark:text-cighra-gold border-cighra-primary dark:border-cighra-gold/30' :
                            'bg-blue-900/10 text-blue-500 border-blue-800/30'}
                      `}>
                        {u.status_unit}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[10px] text-slate-500 dark:text-slate-400">{u.last_maintenance}</td>
                    <td className="p-4 flex gap-2 justify-end">
                      <button onClick={() => handleShowUnitHistory(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 text-slate-500 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Riwayat">
                        <History className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEditUnit(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 text-slate-500 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteUnit(u)} className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 text-slate-500 dark:text-slate-300 hover:text-red-600 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
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
