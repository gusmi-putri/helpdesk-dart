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
                         data.kode_satuan !== (editingSatuan.kode_satuan || '') ||
                         data.alamat !== (editingSatuan.alamat || '') ||
                         data.latitude !== (editingSatuan.latitude || '') ||
                         data.longitude !== (editingSatuan.longitude || '');
                         
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
    <div className="flex flex-col md:flex-row justify-between items-end mt-4 mb-5 animate-in fade-in duration-500 gap-4">
      <div className="w-full md:w-[40%]">
        <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">CARI SATUAN</label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="NAMA SATUAN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 pl-10 pr-4 py-2 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold focus:ring-1 focus:ring-cighra-primary/30 transition-all uppercase rounded-none shadow-sm"
          />
        </div>
      </div>
      
      <div className="w-full md:w-auto">
        <button
          onClick={handleAddSatuan}
          className="w-full md:w-auto bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-5 py-2.5 text-[11px] font-tactical font-bold tracking-widest flex items-center justify-center gap-2 transition-colors border border-cighra-primary dark:border-cighra-gold shadow-sm uppercase rounded-none"
        >
          <Plus className="w-4 h-4" /> TAMBAH SATUAN
        </button>
      </div>
    </div>

    <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-xl overflow-hidden relative animate-in fade-in duration-500">
      <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>
      
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-600 flex items-center justify-between bg-slate-800">
        <h3 className="text-white font-tactical font-bold text-base tracking-widest flex items-center gap-3 uppercase m-0 leading-none">
          <MapPin className="text-cighra-gold w-5 h-5" /> DATA SATUAN
        </h3>

        <div className="flex items-center">
          <span className="bg-slate-700 text-slate-300 text-[10px] font-mono px-2.5 py-1 rounded-sm uppercase font-bold tracking-widest shadow-inner">
            {filteredSatuans.length} DATA
          </span>
        </div>
      </div>



      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left font-sans text-xs block md:table">
          <thead className="bg-slate-800 border-b border-slate-700 hidden md:table-header-group">
            <tr>
              <SortableHeader label="KODE" sortKey="kode_satuan" currentSort={sortConfig} onSort={handleSort} width="10%" />
              <SortableHeader label="NAMA SATUAN" sortKey="nama_satuan" currentSort={sortConfig} onSort={handleSort} width="24%" />
              <SortableHeader label="ALAMAT / LOKASI" sortKey="alamat" currentSort={sortConfig} onSort={handleSort} width="28%" />
              <SortableHeader label="KOORDINAT" sortKey="latitude" currentSort={sortConfig} onSort={handleSort} width="18%" />
              <SortableHeader label="JML" width="8%" />
              <SortableHeader label="STATUS" width="7%" />
              <SortableHeader label="AKSI" width="5%" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 block md:table-row-group w-full">
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
                <tr key={satuan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group bg-white dark:bg-transparent flex flex-col md:table-row border-b md:border-b-0 border-slate-100 dark:border-slate-700/50">
                  <td className="p-4 md:p-3 md:px-5 font-mono text-slate-600 dark:text-slate-400 md:text-left block md:table-cell relative" title={satuan.kode_satuan || '-'}>
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase block mb-1">KODE</span>
                    <span className="block truncate font-bold text-[11px] md:font-normal">{satuan.kode_satuan || '-'}</span>
                  </td>
                  <td className="p-4 md:p-3 md:px-5 font-bold text-sm md:text-xs text-slate-800 dark:text-white block md:table-cell relative tracking-wide" title={satuan.nama_satuan}>
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase block mb-1">NAMA SATUAN</span>
                    <span className="block truncate">{satuan.nama_satuan}</span>
                  </td>
                  <td className="p-4 md:p-3 md:px-5 text-xs text-slate-600 dark:text-slate-300 block md:table-cell relative" title={satuan.alamat || '-'}>
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase block mb-1">ALAMAT / LOKASI</span>
                    <span className="block truncate leading-relaxed max-w-[300px]">{satuan.alamat || '-'}</span>
                  </td>
                  <td className="p-4 md:p-3 md:px-5 text-[11px] font-mono text-slate-500 dark:text-slate-400 md:text-left block md:table-cell relative">
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase block mb-1">KOORDINAT</span>
                    {satuan.latitude && satuan.longitude
                      ? <span className="block truncate">{satuan.latitude}, {satuan.longitude}</span>
                      : <span className="text-slate-400 italic">Belum diset</span>}
                  </td>
                  <td className="p-4 md:p-3 md:px-5 font-tactical text-sm md:text-[11px] text-slate-800 dark:text-white md:text-center block md:table-cell relative">
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase block mb-1">JUMLAH</span>
                    {dbUnits ? dbUnits.filter(u => u.satuan_id === satuan.id).length : 0}
                  </td>
                  <td className="p-4 md:p-3 md:px-5 md:text-center block md:table-cell relative">
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase block mb-1">STATUS</span>
                    {satuan.latitude && satuan.longitude ? (
                      <span className="inline-block px-2 py-1 border text-[9px] font-bold tracking-widest uppercase bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40 rounded-none shadow-sm">
                        Siap
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 border text-[9px] font-bold tracking-widest uppercase bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40 rounded-none shadow-sm">
                        Belum
                      </span>
                    )}
                  </td>
                  <td className="p-4 md:p-3 md:px-5 md:text-center block md:table-cell relative bg-slate-50 md:bg-transparent dark:bg-slate-800/20">
                    <span className="md:hidden text-[10px] font-bold text-slate-400 uppercase block mb-2">AKSI</span>
                    <div className="flex items-center justify-start md:justify-center gap-2">
                      <button
                        onClick={() => handleViewOnMap ? handleViewOnMap(satuan) : handleShowDetailSatuan(satuan)}
                        className="inline-flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-none shadow-sm"
                        title={handleViewOnMap ? "Lihat di Peta" : "Lihat Detail"}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditSatuan(satuan)}
                        className="inline-flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-none shadow-sm"
                        title="Edit Satuan"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSatuan(satuan)}
                        className="inline-flex items-center justify-center w-8 h-8 bg-white dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-white hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800/50 transition-colors border border-slate-200 dark:border-slate-600 rounded-none shadow-sm"
                        title="Hapus Satuan"
                      >
                        <Trash2 className="w-4 h-4" />
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
          data.kode_satuan === (editingSatuan?.kode_satuan || '') &&
          data.alamat === (editingSatuan?.alamat || '') &&
          data.latitude === (editingSatuan?.latitude || '') &&
          data.longitude === (editingSatuan?.longitude || '')
        )}
      />
    </>
  );
};

export default SatuansTable;
