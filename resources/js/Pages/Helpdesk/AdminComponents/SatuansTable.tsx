import React, { useState } from 'react';
import { Search, Plus, MapPin, Edit, Trash2, Eye, Building2 } from 'lucide-react';
import { EmptyState } from '@/Components/ui/EmptyState';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';
import { useForm } from '@inertiajs/react';
import { useStore } from '@/store/useStore';
import SatuanModal from './SatuanModal';
import SatuanDetailModal from './SatuanDetailModal';
import SatuanDeleteModal from './SatuanDeleteModal';

interface SatuansTableProps {
  dbSatuans: any[];
  dbUnits?: any[];
  dbCases?: any[];
  dbUsers?: any[];
  isPengajuan?: boolean;
  handleViewOnMap?: (satuan: any) => void;
}

const SatuansTable: React.FC<SatuansTableProps> = ({
  dbSatuans,
  dbUnits,
  dbCases,
  dbUsers,
  isPengajuan,
  handleViewOnMap
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal visibility states
  const [isSatuanDetailModalOpen, setIsSatuanDetailModalOpen] = useState(false);
  const [isSatuanModalOpen, setIsSatuanModalOpen] = useState(false);
  const [isSatuanDeleteModalOpen, setIsSatuanDeleteModalOpen] = useState(false);
  
  // Data states
  const [selectedSatuan, setSelectedSatuan] = useState<any>(null);
  const [satuanToDelete, setSatuanToDelete] = useState<any>(null);
  const [isSatuanAddMode, setIsSatuanAddMode] = useState(true);
  const [editingSatuan, setEditingSatuan] = useState<any>(null);

  const addNotification = useStore(state => state.addNotification);

  // Form state
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    kode_satuan: '',
    nama_satuan: '',
    alamat: '',
    latitude: '',
    longitude: ''
  });

  const filtered = dbSatuans.filter((s: any) =>
    (s.nama_satuan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.kode_satuan || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.alamat || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { sortedItems: filteredSatuans, sortConfig, handleSort } = useTableSort(filtered, { key: 'nama_satuan', direction: 'asc' });

  // Handlers
  const handleShowDetailSatuan = (satuan: any) => {
    setSelectedSatuan(satuan);
    setIsSatuanDetailModalOpen(true);
  };

  const handleAddSatuan = () => {
    setIsSatuanAddMode(true);
    setEditingSatuan(null);
    clearErrors();
    reset();
    setIsSatuanModalOpen(true);
  };

  const handleEditSatuan = (satuan: any) => {
    setIsSatuanAddMode(false);
    setEditingSatuan(satuan);
    clearErrors();
    setData({
      kode_satuan: satuan.kode_satuan || '',
      nama_satuan: satuan.nama_satuan,
      alamat: satuan.alamat || '',
      latitude: satuan.latitude || '',
      longitude: satuan.longitude || ''
    });
    setIsSatuanModalOpen(true);
  };

  const handleDeleteSatuan = (satuan: any) => {
    setSatuanToDelete(satuan);
    setIsSatuanDeleteModalOpen(true);
  };

  const handleSatuanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSatuanAddMode) {
      post('/satuans', {
        onSuccess: () => {
          setIsSatuanModalOpen(false);
          reset();
          if (isPengajuan) addNotification('Pengajuan penambahan SATUAN dikirim.');
        }
      });
    } else {
      const hasChanged = data.nama_satuan !== editingSatuan.nama_satuan || 
                         data.tingkat !== editingSatuan.tingkat;
                         
      if (!hasChanged) {
        setIsSatuanModalOpen(false);
        if (isPengajuan) {
          addNotification('Tidak ada perubahan', 'info');
        }
        return;
      }
      
      put(`/satuans/${editingSatuan.id}`, {
        onSuccess: () => {
          setIsSatuanModalOpen(false);
          if (isPengajuan) addNotification('Pengajuan perubahan SATUAN dikirim.');
        }
      });
    }
  };

  return (
    <>
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
          <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">CARI SATUAN</label>
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
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <table className="w-full text-left font-sans text-xs">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              <SortableHeader label="KODE" sortKey="kode_satuan" currentSort={sortConfig} onSort={handleSort} width="80px" />
              <SortableHeader label="NAMA SATUAN" sortKey="nama_satuan" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="ALAMAT / LOKASI" sortKey="alamat" currentSort={sortConfig} onSort={handleSort} />
              <SortableHeader label="KOORDINAT" sortKey="latitude" currentSort={sortConfig} onSort={handleSort} width="140px" />
              <SortableHeader label="JML" width="60px" />
              <SortableHeader label="STATUS" width="90px" />
              <SortableHeader label="AKSI" width="110px" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
            {filteredSatuans.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8">
                  <EmptyState 
                    icon={<Building2 className="w-16 h-16 opacity-50" />}
                    title={searchTerm ? 'PENCARIAN TIDAK DITEMUKAN' : 'DATA KOSONG'}
                    description={searchTerm ? 'Tidak ditemukan data satuan yang cocok dengan pencarian Anda.' : 'Belum ada data satuan yang terdaftar di sistem.'}
                  />
                </td>
              </tr>
            ) : (
              filteredSatuans.map((satuan: any) => (
                <tr key={satuan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group bg-white dark:bg-transparent">
                  <td className="p-2 px-2 text-[11px] font-mono text-slate-800 dark:text-white text-center" title={satuan.kode_satuan || '-'}>
                    <span className="block truncate max-w-[80px]">{satuan.kode_satuan || '-'}</span>
                  </td>
                  <td className="p-2 px-3 font-mono font-bold text-[11px] text-slate-800 dark:text-white" title={satuan.nama_satuan}>
                    <span className="block truncate max-w-[180px]">{satuan.nama_satuan}</span>
                  </td>
                  <td className="p-2 px-3 text-xs font-mono text-slate-600 dark:text-slate-300" title={satuan.alamat || '-'}>
                    <span className="block truncate max-w-[200px]">{satuan.alamat || '-'}</span>
                  </td>
                  <td className="p-2 px-2 text-[11px] font-mono text-slate-600 dark:text-slate-400 text-center w-[140px]">
                    {satuan.latitude && satuan.longitude
                      ? <span className="block truncate">{satuan.latitude}, {satuan.longitude}</span>
                      : <span className="text-slate-400 italic">Belum diset</span>}
                  </td>
                  <td className="p-2 px-2 font-tactical text-[11px] text-slate-800 dark:text-white text-center w-[60px]">
                    {dbUnits ? dbUnits.filter(u => u.satuan_id === satuan.id).length : 0}
                  </td>
                  <td className="p-2 px-3 text-center">
                    {satuan.latitude && satuan.longitude ? (
                      <span className="px-1.5 py-0.5 border text-[8px] font-bold tracking-widest uppercase bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40">
                        Siap
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 border text-[8px] font-bold tracking-widest uppercase bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40">
                        Belum
                      </span>
                    )}
                  </td>
                  <td className="p-2 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleViewOnMap ? handleViewOnMap(satuan) : handleShowDetailSatuan(satuan)}
                        className="p-1.5 bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                        title={handleViewOnMap ? "Lihat di Peta" : "Lihat Detail"}
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleEditSatuan(satuan)}
                        className="p-1.5 bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                        title="Edit Satuan"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSatuan(satuan)}
                        className="p-1.5 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                        title="Hapus Satuan"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
      {/* Embedded Modals */}
      <SatuanDetailModal
        isOpen={isSatuanDetailModalOpen}
        onClose={() => setIsSatuanDetailModalOpen(false)}
        satuan={selectedSatuan}
        dbUnits={dbUnits || []}
        dbUsers={dbUsers || []}
        dbCases={dbCases || []}
      />

      <SatuanDeleteModal
        isOpen={isSatuanDeleteModalOpen}
        onClose={() => setIsSatuanDeleteModalOpen(false)}
        satuan={satuanToDelete}
        isPengajuan={isPengajuan}
      />

      <SatuanModal
        isOpen={isSatuanModalOpen}
        onClose={() => setIsSatuanModalOpen(false)}
        onSubmit={handleSatuanSubmit}
        data={data}
        setData={setData}
        errors={errors}
        processing={processing}
        isAddMode={isSatuanAddMode}
        isPengajuan={isPengajuan}
        submitDisabled={!isSatuanAddMode && (
          data.nama_satuan === editingSatuan?.nama_satuan && 
          data.tingkat === editingSatuan?.tingkat
        )}
      />
    </>
  );
};

export default SatuansTable;
