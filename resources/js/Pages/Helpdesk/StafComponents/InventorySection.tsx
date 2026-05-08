import React from 'react';
import { Search } from 'lucide-react';

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
  setSortConfig
}) => {
  const jenisOptions = ['ALL', ...new Set(dbUnits.map((u: any) => u.jenis_dart))];
  const satuanOptions = ['ALL', ...new Set(dbUnits.map((u: any) => u.asal_satuan))];

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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
      <div className="bg-white/60 dark:bg-gunmetal/50 border border-soft-gunmetal/20 dark:border-soft-sand/10 p-4 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="block text-[10px] font-mono font-bold text-soft-gunmetal/60 dark:text-soft-sand/40 mb-1 uppercase">CARI PERANGKAT</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-soft-gunmetal/40" />
              <input 
                type="text" 
                placeholder="SN / NAMA..." 
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                className="w-full bg-sand/40 dark:bg-black/40 border border-soft-gunmetal/20 dark:border-soft-sand/10 pl-10 pr-4 py-2 text-xs font-mono focus:border-olive outline-none uppercase text-gunmetal dark:text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold text-soft-gunmetal/40 dark:text-soft-sand/30 mb-1 uppercase">JENIS UNIT</label>
            <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)} className="w-full bg-sand/50 dark:bg-black border border-soft-gunmetal/20 dark:border-soft-sand/10 px-4 py-2 text-xs font-mono focus:border-olive outline-none uppercase text-gunmetal dark:text-white">
              {jenisOptions.map((o: any) => <option key={o} value={o}>{o === 'ALL' ? 'SEMUA' : o}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-bold text-soft-gunmetal/40 dark:text-soft-sand/30 mb-1 uppercase">SATUAN KERJA</label>
            <select value={filterSatuan} onChange={(e) => setFilterSatuan(e.target.value)} className="w-full bg-sand/50 dark:bg-black border border-soft-gunmetal/20 dark:border-soft-sand/10 px-4 py-2 text-xs font-mono focus:border-olive outline-none uppercase text-gunmetal dark:text-white">
              {satuanOptions.map((o: any) => <option key={o} value={o}>{o === 'ALL' ? 'SEMUA' : o}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-black/60 border border-soft-gunmetal/20 dark:border-soft-sand/10 rounded-sm overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-gunmetal text-soft-sand/60 font-tactical tracking-widest border-b border-soft-sand/10">
              <tr>
                <th className="p-4 cursor-pointer hover:text-olive" onClick={() => handleSort('nomor_seri')}>SN</th>
                <th className="p-4 cursor-pointer hover:text-olive" onClick={() => handleSort('nama_dart')}>UNIT</th>
                <th className="p-4 cursor-pointer hover:text-olive" onClick={() => handleSort('jenis_dart')}>JENIS</th>
                <th className="p-4 cursor-pointer hover:text-olive" onClick={() => handleSort('asal_satuan')}>SATUAN</th>
                <th className="p-4 cursor-pointer hover:text-olive" onClick={() => handleSort('status_unit')}>STATUS</th>
                <th className="p-4">CEK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-gunmetal/10 dark:divide-soft-sand/5 text-gunmetal dark:text-white">
              {filteredUnits.map((u: any) => (
                <tr key={u.db_id} className="hover:bg-sand/30 dark:hover:bg-black/40 transition-colors group">
                  <td className="p-4 font-mono font-bold text-olive">{u.nomor_seri}</td>
                  <td className="p-4 font-bold uppercase">{u.nama_dart}</td>
                  <td className="p-4 uppercase">{u.jenis_dart}</td>
                  <td className="p-4 uppercase">{u.asal_satuan}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest
                      ${u.status_unit === 'Siap Ops' ? 'bg-camogreen/10 text-camogreen border-camogreen/30' : 
                        u.status_unit === 'Rusak' ? 'bg-targetred/10 text-targetred border-targetred/30' : 
                        'bg-blue-900/10 text-blue-500 border-blue-800/30'}
                    `}>
                      {u.status_unit.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-[10px] text-soft-gunmetal/40 dark:text-soft-sand/20">{u.last_maintenance}</td>
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
