import React from 'react';
import { Package, Search, Plus, Filter, ArrowUp, ArrowDown, History, Edit, Trash2 } from 'lucide-react';

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
          { label: 'TOTAL UNIT', value: unitStats.TOTAL, color: 'border-olive', text: 'text-olive' },
          { label: 'SIAP OPERASIONAL', value: unitStats.SIAP, color: 'border-green-500', text: 'text-green-500' },
          { label: 'RUSAK / KENDALA', value: unitStats.RUSAK, color: 'border-targetred', text: 'text-targetred' },
          { label: 'DALAM PERBAIKAN', value: unitStats.PERBAIKAN, color: 'border-blue-500', text: 'text-blue-500' },
        ].map((s, i) => (
          <div key={i} className={`bg-sand/30 dark:bg-black/40 border-l-4 ${s.color} p-4 shadow-md`}>
            <p className="text-[9px] font-mono font-bold text-soft-gunmetal/60 dark:text-soft-sand/40 tracking-widest uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-tactical font-bold ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-sand/30 dark:bg-black/40 border border-soft-gunmetal/10 dark:border-soft-sand/5 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-olive"></div>
        <div className="p-5 border-b border-soft-gunmetal/10 dark:border-soft-sand/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-sand/20 dark:bg-black/20">
          <h3 className="text-gunmetal dark:text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
            <Package className="text-olive w-6 h-6" /> DATA INVENTARIS UNIT
          </h3>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-soft-gunmetal/60 dark:text-soft-sand/40" />
              <input
                type="text"
                placeholder="CARI SERI / NAMA / LOKASI..."
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                className="bg-sand/50 dark:bg-gunmetal border border-soft-gunmetal/20 dark:border-soft-sand/10 pl-9 pr-4 py-2 text-sm font-mono text-gunmetal dark:text-white focus:outline-none focus:border-olive transition-colors w-64 uppercase"
              />
            </div>
            <button
              onClick={handleAddUnit}
              className="bg-olive hover:bg-camogreen text-sand px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-olive shadow-lg uppercase"
            >
              <Plus className="w-4 h-4" /> TAMBAH UNIT
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-[#1a2024] text-gray-400 font-tactical tracking-widest border-b border-gray-700">
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
                    className="p-4 cursor-pointer hover:text-olive transition-colors"
                    onClick={() => handleUnitSort(col.key)}
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      <Filter className="w-3 h-3 opacity-30" />
                      {unitSortConfig?.key === col.key && (
                        unitSortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-olive" /> : <ArrowDown className="w-3 h-3 text-olive" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-4 text-right">OPSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-soft-gunmetal/40 dark:text-soft-sand/20 font-mono italic uppercase tracking-widest">Tidak ada unit yang ditemukan.</td>
                </tr>
              ) : (
                filteredUnits.map((u: any) => (
                  <tr key={u.db_id} className="hover:bg-gray-200 dark:hover:bg-gray-800/80 transition-colors group">
                    <td className="p-4 font-mono font-bold text-olive border-l-2 border-transparent group-hover:border-olive">{u.nomor_seri}</td>
                    <td className="p-4 text-gunmetal dark:text-white font-bold uppercase">{u.nama_dart}</td>
                    <td className="p-4 font-mono text-xs text-soft-gunmetal/60 dark:text-soft-sand/40 uppercase">{u.jenis_dart}</td>
                    <td className="p-4 text-gunmetal dark:text-soft-sand uppercase">{u.asal_satuan}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase
                        ${u.status_unit === 'Siap Ops' ? 'bg-camogreen/10 text-camogreen border-camogreen/30' :
                          u.status_unit === 'Rusak' ? 'bg-targetred/10 text-targetred border-targetred/30' :
                            'bg-blue-900/10 text-blue-500 border-blue-800/30'}
                      `}>
                        {u.status_unit}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[10px] text-soft-gunmetal/40 dark:text-soft-sand/20">{u.last_maintenance}</td>
                    <td className="p-4 flex gap-2 justify-end">
                      <button onClick={() => handleShowUnitHistory(u)} className="p-2 bg-gray-300 dark:bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-300 transition-colors border border-gray-400 dark:border-gray-600" title="Riwayat">
                        <History className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEditUnit(u)} className="p-2 bg-gray-300 dark:bg-gray-800 hover:bg-olive hover:text-gunmetal dark:hover:text-white text-gray-700 dark:text-gray-300 transition-colors border border-gray-400 dark:border-gray-600" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteUnit(u)} className="p-2 bg-gray-300 dark:bg-gray-800 hover:bg-targetred hover:text-white text-gray-700 dark:text-gray-300 transition-colors border border-gray-400 dark:border-gray-600" title="Hapus">
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
    </div>
  );
};

export default UnitsTable;
