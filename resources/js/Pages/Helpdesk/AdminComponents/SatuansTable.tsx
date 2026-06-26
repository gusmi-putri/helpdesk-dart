import React, { useState } from 'react';
import { Search, Plus, MapPin, CheckCircle, Clock, Edit, Trash2, Eye } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';

interface SatuansTableProps {
  dbSatuans: any[];
  dbUnits?: any[];
  handleAddSatuan: () => void;
  handleEditSatuan: (satuan: any) => void;
  handleDeleteSatuan: (satuan: any) => void;
  handleShowDetailSatuan?: (satuan: any) => void;
  handleViewOnMap?: (satuan: any) => void;
}

const SatuansTable: React.FC<SatuansTableProps> = ({
  dbSatuans,
  dbUnits,
  handleAddSatuan,
  handleEditSatuan,
  handleDeleteSatuan,
  handleShowDetailSatuan,
  handleViewOnMap
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = dbSatuans.filter((s: any) =>
    s.nama_satuan.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.kode_satuan && s.kode_satuan.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const { sortedItems: filteredSatuans, sortConfig, handleSort } = useTableSort(filtered, { key: 'nama_satuan', direction: 'asc' });

  return (
    <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-2xl overflow-hidden relative mt-6 animate-in fade-in duration-500">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>
      
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800">
        <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
          <MapPin className="text-cighra-gold w-6 h-6" /> DATA SATUAN
        </h3>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleAddSatuan}
            className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-cighra-primary dark:border-cighra-gold shadow-lg uppercase cursor-pointer"
          >
            <Plus className="w-4 h-4" /> TAMBAH SATUAN
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="p-4 bg-slate-50 dark:bg-cighra-dark/30 border-b border-slate-200 dark:border-slate-600 flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-72">
          <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">CARI SATUAN</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="NAMA SATUAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 pl-9 pr-4 py-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold transition-colors uppercase"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-sans text-sm">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <SortableHeader label="KODE SATUAN" sortKey="kode_satuan" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="NAMA SATUAN" sortKey="nama_satuan" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="ALAMAT / LOKASI" sortKey="alamat" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="KOORDINAT" sortKey="latitude" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="TOTAL DART" />
              <SortableHeader label="STATUS LOKASI" />
              <SortableHeader label="AKSI" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {filteredSatuans.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-500 dark:text-slate-400 font-mono italic uppercase tracking-widest">
                  Tidak ada data SATUAN yang ditemukan.
                </td>
              </tr>
            ) : (
              filteredSatuans.map((satuan: any) => (
                <tr key={satuan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group bg-white dark:bg-transparent">
                  <td className="p-4 text-sm font-mono text-slate-800 dark:text-white truncate max-w-[150px]" title={satuan.kode_satuan || '-'}>
                    {satuan.kode_satuan || '-'}
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-800 dark:text-white truncate max-w-[200px]" title={satuan.nama_satuan}>
                    {satuan.nama_satuan}
                  </td>
                  <td className="p-4 text-sm font-mono text-slate-800 dark:text-white truncate max-w-[250px]" title={satuan.alamat || '-'}>
                    {satuan.alamat || '-'}
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-800 dark:text-white text-center">
                    {satuan.latitude && satuan.longitude 
                      ? `${satuan.latitude}, ${satuan.longitude}`
                      : <span className="text-slate-400 italic">Belum diset</span>}
                  </td>
                  <td className="p-4 font-tactical text-slate-800 dark:text-white text-center">
                    {dbUnits ? dbUnits.filter(u => u.satuan_id === satuan.id).length : 0}
                  </td>
                  <td className="p-4 text-center">
                    {satuan.latitude && satuan.longitude ? (
                      <span className="px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40">
                        Siap Ditampilkan
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40">
                        Belum Lengkap
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    {handleShowDetailSatuan && (
                      <button
                        onClick={() => handleShowDetailSatuan(satuan)}
                        className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEditSatuan(satuan)}
                      className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                      title="Edit Satuan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSatuan(satuan)}
                      className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                      title="Hapus Satuan"
                    >
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
  );
};

export default SatuansTable;

