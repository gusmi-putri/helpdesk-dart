import React, { useState } from 'react';
import { Package, Search, Plus, History, Edit, Trash2, Upload, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { EmptyState } from '@/Components/ui/EmptyState';
import { usePage, router, useForm } from '@inertiajs/react';
import SortableHeader from '@/Components/Table/SortableHeader';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';
import UnitHistoryModal from './UnitHistoryModal';
import AdminUnitBatchModal from './AdminUnitBatchModal';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/Components/Table/Pagination';

interface UnitsTableProps {
  dbUnits: any[];
  dbSatuans?: any[];
  dbCases?: any[];
}

const UnitsTable: React.FC<UnitsTableProps> = ({
  dbUnits,
  dbSatuans,
  dbCases
}) => {
  const [importResult, setImportResult] = useState<any>(null);
  const [selectedUnitIds, setSelectedUnitIds] = useState<number[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);

  // Local filter states
  const [unitSearch, setUnitSearch] = useState('');
  const [filterJenis, setFilterJenis] = useState('ALL');
  const [filterSatuan, setFilterSatuan] = useState('ALL');
  const [unitSortConfig, setUnitSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Modal visibility states
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isUnitDeleteModalOpen, setIsUnitDeleteModalOpen] = useState(false);
  const [isUnitHistoryModalOpen, setIsUnitHistoryModalOpen] = useState(false);
  const [isAdminBatchModalOpen, setIsAdminBatchModalOpen] = useState(false);
  
  // Data states
  const [editingUnit, setEditingUnit] = useState<any>(null);
  const [isUnitAddMode, setIsUnitAddMode] = useState(true);
  const [unitToDelete, setUnitToDelete] = useState<any>(null);
  const [selectedUnitForHistory, setSelectedUnitForHistory] = useState<any>(null);
  const [isBatchUploading, setIsBatchUploading] = useState(false);

  const unitForm = useForm({
    nomor_seri: '',
    jenis: 'DART STD',
    satuan_id: '',
    asal_satuan: '',
    status_unit: 'Beroperasi',
    document: null as File | null,
  });

  const toggleSelectUnit = (id: number) => {
    if (selectedUnitIds.includes(id)) {
      setSelectedUnitIds(selectedUnitIds.filter(v => v !== id));
    } else {
      setSelectedUnitIds([...selectedUnitIds, id]);
    }
  };

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

  const [prevImportResultStr, setPrevImportResultStr] = useState<string | null>(null);

  if (flash?.import_result && flash.import_result !== prevImportResultStr) {
    setPrevImportResultStr(flash.import_result);
    try {
      const result = JSON.parse(flash.import_result);
      setImportResult(result);
    } catch {
      // ignore
    }
  }

  const unitStats = {
    TOTAL: dbUnits.length,
    SIAP: dbUnits.filter((u: any) => u.status_unit === 'Beroperasi').length,
    RUSAK: dbUnits.filter((u: any) => u.status_unit === 'Rusak').length,
    PERBAIKAN: dbUnits.filter((u: any) => u.status_unit === 'Perbaikan').length,
  };

  const filteredUnits = dbUnits.filter((u: any) => {
    const matchesSearch = (u.nomor_seri || '').toLowerCase().includes(unitSearch.toLowerCase()) ||
      (u.asal_satuan || '').toLowerCase().includes(unitSearch.toLowerCase()) ||
      (u.jenis || '').toLowerCase().includes(unitSearch.toLowerCase());
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

  const { currentPage, totalPages, paginatedItems, handlePageChange, itemsPerPage, totalItems } = usePagination(filteredUnits, 15);

  const handleUnitSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (unitSortConfig && unitSortConfig.key === key && unitSortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setUnitSortConfig({ key, direction });
  };

  const handleAddUnit = () => {
    setIsUnitAddMode(true);
    setEditingUnit(null);
    unitForm.reset();
    unitForm.clearErrors();
    setIsUnitModalOpen(true);
  };

  const handleEditUnit = (unit: any) => {
    setIsUnitAddMode(false);
    setEditingUnit(unit);
    unitForm.clearErrors();
    unitForm.setData({
      nomor_seri: unit.nomor_seri,
      jenis: unit.jenis,
      satuan_id: unit.satuan_id || '',
      asal_satuan: unit.asal_satuan,
      status_unit: unit.status_unit,
      document: null
    });
    setIsUnitModalOpen(true);
  };

  const handleDeleteUnit = (unit: any) => {
    setUnitToDelete(unit);
    setIsUnitDeleteModalOpen(true);
  };

  const handleShowUnitHistory = (unit: any) => {
    setSelectedUnitForHistory(unit);
    setIsUnitHistoryModalOpen(true);
  };

  const handleConfirmDeleteUnit = () => {
    if (unitToDelete) {
      router.delete(`/units/${unitToDelete.db_id}`, {
        onSuccess: () => {
          setIsUnitDeleteModalOpen(false);
          setUnitToDelete(null);
        }
      });
    }
  };

  const handleUnitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnitAddMode) {
      unitForm.post('/units', {
        onSuccess: () => {
          setIsUnitModalOpen(false);
          unitForm.reset();
        }
      });
    } else {
      unitForm.put(`/units/${editingUnit.db_id}`, {
        onSuccess: () => {
          setIsUnitModalOpen(false);
        }
      });
    }
  };

  const handleImportBatchSubmit = (formData: FormData) => {
    setIsBatchUploading(true);
    router.post('/units/import', formData, {
      forceFormData: true,
      onSuccess: () => {
        setIsAdminBatchModalOpen(false);
        setIsBatchUploading(false);
      },
      onError: () => {
        setIsBatchUploading(false);
      }
    });
  };

  const handleDeleteUnitBatch = () => {
    const ids = dbUnits.filter(u => selectedUnitIds.includes(u.db_id)).map((u: any) => u.db_id);
    const snList = dbUnits.filter(u => selectedUnitIds.includes(u.db_id)).map((u: any) => u.nomor_seri).join(', ');
    if (window.confirm(`APAKAH ANDA YAKIN INGIN MENGHAPUS SECARA MASSAL ${ids.length} UNIT INVENTARIS BERIKUT?\n\nDaftar Seri:\n${snList}\n\nTindakan ini akan mengarsipkan unit tersebut secara permanen.`)) {
      router.post('/units/destroy-batch', { ids }, {
        onSuccess: () => {
          setSelectedUnitIds([]);
          setIsDeleteMode(false);
        }
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {selectedUnitIds.length > 0 && isDeleteMode && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-3 flex justify-between items-center shadow-md animate-in slide-in-from-top-2">
          <p className="text-sm font-tactical font-bold text-red-700 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
            ⚠️ {selectedUnitIds.length} UNIT TERPILIH UNTUK DIHAPUS
          </p>
          <button
            onClick={handleDeleteUnitBatch}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-tactical font-bold text-xs tracking-widest transition-colors flex items-center gap-2 shadow-sm cursor-pointer border border-red-600"
          >
            <Trash2 className="w-4 h-4" /> EKSEKUSI HAPUS MASSAL
          </button>
        </div>
      )}
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL UNIT', value: unitStats.TOTAL, color: 'border-cighra-primary dark:border-cighra-gold', text: 'text-cighra-primary dark:text-cighra-gold' },
          { label: 'BEROPERASI', value: unitStats.SIAP, color: 'border-green-500', text: 'text-green-500' },
          { label: 'RUSAK / KENDALA', value: unitStats.RUSAK, color: 'border-cighra-primary dark:border-cighra-gold', text: 'text-cighra-primary dark:text-cighra-gold' },
          { label: 'DALAM PERBAIKAN', value: unitStats.PERBAIKAN, color: 'border-blue-500', text: 'text-blue-500' },
        ].map((s, i) => (
          <div key={i} className={`bg-white dark:bg-cighra-darkcard/80 border-l-4 ${s.color} p-4 shadow-md`}>
            <p className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-300 tracking-widest uppercase mb-1">{s.label}</p>
            <p className={`text-2xl font-tactical font-bold ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>
        <div className="p-5 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-cighra-primary dark:bg-slate-800">
          <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
            <Package className="text-cighra-gold w-6 h-6" /> DATA INVENTARIS UNIT
          </h3>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                setIsDeleteMode(!isDeleteMode);
                setSelectedUnitIds([]);
              }}
              className={`px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-all border shadow-lg uppercase cursor-pointer ${
                isDeleteMode 
                  ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-700' 
                  : 'bg-red-600 hover:bg-red-500 text-white border-red-600'
              }`}
            >
              <Trash2 className="w-4 h-4" /> {isDeleteMode ? 'TUTUP MODE HAPUS' : 'MODE HAPUS MASSAL'}
            </button>
            <button
              onClick={() => setIsAdminBatchModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-blue-600 shadow-lg uppercase cursor-pointer"
            >
              <Upload className="w-4 h-4" /> IMPORT CSV
            </button>
            <button
              onClick={handleAddUnit}
              className="bg-white dark:bg-cighra-gold text-cighra-primary dark:text-slate-900 hover:bg-slate-100 dark:hover:bg-cighra-gold/90 px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border-2 border-white dark:border-cighra-gold shadow-lg uppercase cursor-pointer"
            >
              <Plus className="w-4 h-4" /> TAMBAH UNIT
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="p-4 bg-slate-50 dark:bg-cighra-dark/30 border-b border-slate-200 dark:border-slate-600 flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-72">
            <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">CARI PERANGKAT</label>
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
            <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">JENIS UNIT</label>
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
            <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">SATUAN</label>
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

        {isDeleteMode && (
          <div className="p-4 bg-red-500/5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs font-mono text-red-600 dark:text-red-400">
            <span className="font-bold flex items-center gap-2">
              ⚠️ MODE HAPUS MASSAL AKTIF: KLIK PADA BARIS UNIT UNTUK MENANDAI PENGHAPUSAN.
            </span>
            <button
              type="button"
              onClick={() => {
                if (selectedUnitIds.length === filteredUnits.length) {
                  setSelectedUnitIds([]);
                } else {
                  setSelectedUnitIds(filteredUnits.map((u: any) => u.db_id));
                }
              }}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-300 px-3 py-1 font-mono font-bold tracking-widest uppercase border border-red-500/30 transition-colors cursor-pointer"
            >
              {selectedUnitIds.length === filteredUnits.length ? 'BATAL PILIH SEMUA' : 'PILIH SEMUA'}
            </button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white">
              <tr>
                {isDeleteMode && (
                  <th className="p-4 w-28 text-center text-red-500 font-mono text-xs uppercase tracking-wider">
                    PILIHAN HAPUS
                  </th>
                )}
                {[
                  { label: 'NOMOR SERI', key: 'nomor_seri' },
                  { label: 'JENIS', key: 'jenis' },
                  { label: 'ASAL SATUAN', key: 'asal_satuan' },
                  { label: 'STATUS', key: 'status_unit' },
                  { label: 'MAINTENANCE', key: 'last_maintenance' },
                ].map((col) => (
                  <SortableHeader 
                    key={col.key} 
                    label={col.label} 
                    sortKey={col.key} 
                    currentSort={unitSortConfig} 
                    onSort={handleUnitSort} 
                  />
                ))}
                {!isDeleteMode && <SortableHeader label="OPSI" />}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-0 text-center"><EmptyState title="TIDAK ADA DATA" description="Tidak ada unit yang ditemukan berdasarkan pencarian Anda." /></td>
                </tr>
              ) : (
                paginatedItems.map((u: any) => {
                  const isSelected = selectedUnitIds.includes(u.db_id);
                  return (
                    <tr 
                      key={u.db_id}
                      onClick={isDeleteMode ? () => toggleSelectUnit(u.db_id) : undefined}
                      className={`transition-colors group bg-white dark:bg-transparent ${
                        isDeleteMode 
                          ? 'cursor-pointer select-none' 
                          : ''
                      } ${
                        isSelected 
                          ? 'bg-red-500/5 dark:bg-red-950/20 border-l-4 border-l-red-600' 
                          : isDeleteMode 
                            ? 'hover:bg-blue-100/50 dark:hover:bg-slate-800/30 border-l-4 border-l-transparent' 
                            : 'hover:bg-blue-100/50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      {isDeleteMode && (
                        <td className="p-4 text-center">
                          {isSelected ? (
                            <span className="px-2.5 py-1 bg-red-600/90 text-white text-[11px] font-mono font-bold tracking-widest uppercase inline-block border border-red-700">
                              HAPUS
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 text-[11px] font-mono font-bold tracking-widest uppercase inline-block border border-slate-200 dark:border-slate-700">
                              LEWATI
                            </span>
                          )}
                        </td>
                      )}
                      <td className="p-4 font-mono font-bold text-slate-800 dark:text-white text-center truncate max-w-[150px]" title={u.nomor_seri}>{u.nomor_seri}</td>
                      <td className="p-4 font-mono text-xs text-slate-800 dark:text-white uppercase text-center truncate max-w-[150px]" title={u.jenis}>{u.jenis}</td>
                      <td className="p-4 font-mono text-xs text-slate-800 dark:text-white uppercase text-center truncate max-w-[200px]" title={u.asal_satuan}>{u.asal_satuan}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-0.5 border text-[11px] font-bold tracking-widest uppercase inline-block mx-auto
                          ${u.status_unit === 'Beroperasi' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40' :
                            u.status_unit === 'Rusak' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40' :
                              u.status_unit === 'Perbaikan' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40' :
                                'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600'}
                        `}>
                          {u.status_unit === 'Perbaikan' ? 'Dalam Perbaikan' : u.status_unit}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-xs text-slate-800 dark:text-white text-center">{u.last_maintenance}</td>

                      {!isDeleteMode && (
                        <td className="p-4 flex gap-2 justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowUnitHistory(u);
                            }}
                            className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                            title="Riwayat"
                          >
                            <History className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditUnit(u);
                            }}
                            className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-white transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUnit(u);
                            }}
                            className="p-2 bg-slate-50 dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors border border-slate-200 dark:border-slate-600 rounded-sm"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>
      {/* Import Result Modal */}
      <BaseModal
        isOpen={!!importResult}
        onClose={() => setImportResult(null)}
        title="HASIL IMPORT DATA"
        icon={importResult?.success ? <CheckCircle /> : <AlertTriangle />}
        maxWidth="md"
        headerColor="primary"
        footer={
          <div className="w-full">
            <Button
              variant="primary"
              onClick={() => setImportResult(null)}
              className="w-full uppercase"
              size="lg"
            >
              TUTUP
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-cighra-primary/5 dark:bg-cighra-darkcard border border-cighra-primary/20 dark:border-slate-800 text-sm font-mono font-bold text-slate-800 dark:text-slate-300 leading-relaxed uppercase tracking-wider">
              {importResult?.success ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white dark:bg-cighra-darkcard/80 p-3 border border-slate-200 dark:border-slate-600">
                      <p className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-300 uppercase tracking-widest mb-1">TOTAL BARIS</p>
                      <p className="text-xl font-tactical font-bold text-slate-800 dark:text-white">{importResult.total}</p>
                    </div>
                    <div className="bg-white dark:bg-cighra-darkcard/80 p-3 border border-camogreen/30">
                      <p className="text-[11px] font-mono font-bold text-camogreen uppercase tracking-widest mb-1">BERHASIL</p>
                      <p className="text-xl font-tactical font-bold text-camogreen">{importResult.imported}</p>
                    </div>
                    <div className="bg-white dark:bg-cighra-darkcard/80 p-3 border border-yellow-500/30">
                      <p className="text-[11px] font-mono font-bold text-yellow-500 uppercase tracking-widest mb-1">DILEWATI</p>
                      <p className="text-xl font-tactical font-bold text-yellow-500">{importResult.skipped}</p>
                    </div>
                  </div>
                  {importResult.skipped > 0 && (
                    <p className="text-xs font-mono text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 p-2 border border-yellow-500/20">
                      ⚠ {importResult.skipped} baris dilewati karena Nomor Seri sudah terdaftar di sistem.
                    </p>
                  )}
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-300 text-center uppercase">
                    Data inventaris telah diperbarui secara otomatis.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-cighra-primary dark:text-cighra-gold font-mono">{importResult?.message || 'Terjadi kesalahan saat memproses file.'}</p>
              )}
          </div>
        </div>
      </BaseModal>

      {/* Embedded Modals */}
      <UnitModal
        isOpen={isUnitModalOpen}
        onClose={() => setIsUnitModalOpen(false)}
        onSubmit={handleUnitSubmit}
        data={unitForm.data}
        setData={unitForm.setData}
        errors={unitForm.errors}
        processing={unitForm.processing}
        isAddMode={isUnitAddMode}
        editingUnit={editingUnit}
        dbSatuans={dbSatuans || []}
      />

      <UnitDeleteModal
        isOpen={isUnitDeleteModalOpen}
        onClose={() => setIsUnitDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteUnit}
        unit={unitToDelete}
      />

      <UnitHistoryModal
        isOpen={isUnitHistoryModalOpen}
        onClose={() => setIsUnitHistoryModalOpen(false)}
        unit={selectedUnitForHistory}
        dbCases={dbCases || []}
      />

      <AdminUnitBatchModal
        isOpen={isAdminBatchModalOpen}
        onClose={() => setIsAdminBatchModalOpen(false)}
        onSubmit={handleImportBatchSubmit}
        processing={isBatchUploading}
      />
    </div>
  );
};

export default UnitsTable;
