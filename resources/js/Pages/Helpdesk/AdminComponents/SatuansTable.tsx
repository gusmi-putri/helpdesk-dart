import React, { useState } from 'react';
import { Search, Plus, MapPin, CheckCircle, Clock, Edit2, Trash2 } from 'lucide-react';

interface SatuansTableProps {
  dbSatuans: any[];
  handleAddSatuan: () => void;
  handleEditSatuan: (satuan: any) => void;
  handleDeleteSatuan: (satuan: any) => void;
}

const SatuansTable: React.FC<SatuansTableProps> = ({
  dbSatuans,
  handleAddSatuan,
  handleEditSatuan,
  handleDeleteSatuan
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSatuans = dbSatuans.filter((s: any) =>
    s.nama_satuan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-2xl overflow-hidden relative mt-6 animate-in fade-in duration-500">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>
      
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800">
        <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
          <MapPin className="text-cighra-gold w-6 h-6" /> DATA SATUAN KERJA
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
          <thead className="bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-slate-700">
            <tr>
              <th className="p-4">NO</th>
              <th className="p-4">NAMA SATUAN KERJA</th>
              <th className="p-4">KOORDINAT (LAT, LNG)</th>
              <th className="p-4">STATUS</th>
              <th className="p-4">STATUS PENGAJUAN</th>
              <th className="p-4 text-right">OPSI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {filteredSatuans.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-10 text-center text-slate-500 dark:text-slate-400 font-mono italic uppercase tracking-widest">
                  Tidak ada data satuan kerja yang ditemukan.
                </td>
              </tr>
            ) : (
              filteredSatuans.map((satuan: any, idx: number) => (
                <tr key={satuan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group bg-white dark:bg-transparent">
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                    {idx + 1}
                  </td>
                  <td className="p-4 font-mono font-bold text-cighra-primary dark:text-cighra-gold border-l-2 border-transparent group-hover:border-cighra-primary dark:border-cighra-gold">
                    {satuan.nama_satuan}
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-600 dark:text-slate-300">
                    {satuan.latitude && satuan.longitude 
                      ? `${satuan.latitude}, ${satuan.longitude}`
                      : <span className="text-slate-400 italic">Belum diset</span>}
                  </td>
                  <td className="p-4">
                    {satuan.is_verified ? (
                      <span className="px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase bg-camogreen/10 text-camogreen border-camogreen/30">
                        <CheckCircle className="w-3.5 h-3.5 inline mr-1" /> Terverifikasi
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                        <Clock className="w-3.5 h-3.5 inline mr-1" /> Belum Terverifikasi
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {satuan.pending_action ? (
                      <span className={`px-2 py-0.5 border text-[9px] font-bold tracking-widest uppercase ${
                        satuan.pending_action === 'create' ? 'bg-green-100 text-green-700 border-green-200' :
                        satuan.pending_action === 'edit' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {satuan.pending_action === 'create' ? 'Pengajuan Tambah' :
                         satuan.pending_action === 'edit' ? 'Pengajuan Edit' :
                         satuan.pending_action === 'delete' ? 'Pengajuan Hapus' : 'Pending'}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">-</span>
                    )}
                  </td>
                  <td className="p-4 flex gap-2 justify-end">
                    <button
                      onClick={() => handleEditSatuan(satuan)}
                      className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 text-slate-500 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                      title="Edit Satuan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSatuan(satuan)}
                      className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
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
