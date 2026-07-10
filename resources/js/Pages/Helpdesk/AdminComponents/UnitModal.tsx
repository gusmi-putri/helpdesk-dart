import React from 'react';
import { Package } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
  processing: boolean;
  isAddMode: boolean;
  editingUnit?: any;
  dbSatuans?: any[];
}

const UnitModal: React.FC<UnitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
  errors,
  processing,
  isAddMode,
  editingUnit,
  dbSatuans
}) => {
  if (!isOpen) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isAddMode ? 'TAMBAH UNIT DART BARU' : `EDIT UNIT: ${editingUnit?.nomor_seri}`}
      icon={<Package />}
      maxWidth="2xl"
      headerColor="primary"
      footer={
        <div className="flex gap-4 w-full">
          <Button
            type="submit"
            form="unitForm"
            disabled={processing}
            
           variant="primary" className="flex-[2] uppercase" size="lg">
            {processing ? 'MEMPROSES...' : (isAddMode ? 'TAMBAHKAN UNIT' : 'SIMPAN PERUBAHAN')}
          </Button>
          <Button 
            type="button" 
            onClick={onClose} 
            
           variant="secondary" className="flex-1 uppercase" size="lg">
            BATAL
          </Button>
        </div>
      }
    >
      <form id="unitForm" onSubmit={onSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Nomor Seri Unit</label>
            <input
              type="text"
              value={data.nomor_seri}
              onChange={(e) => setData('nomor_seri', e.target.value.toUpperCase())}
              className={`w-full bg-slate-50 dark:bg-cighra-darkcard border ${errors.nomor_seri ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm`}
              required
              placeholder="CTH: DART-001"
            />
            {errors.nomor_seri && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.nomor_seri}</p>}
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Jenis Unit DART</label>
            <select
              value={data.jenis}
              onChange={(e) => setData('jenis', e.target.value)}
              className="w-full bg-slate-50 dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm"
              required
            >
              <option value="DART STD">DART STD</option>
              <option value="DART STK">DART STK</option>
              <option value="DART Portabel - Swing">DART Portabel - Swing</option>
              <option value="DART Portabel - Pop">DART Portabel - Pop</option>
              <option value="DART Portabel - Flip">DART Portabel - Flip</option>
              <option value="DART Marathon Target">DART Marathon Target</option>
              <option value="Moving Target">Moving Target</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Status Operasional</label>
            <select
              value={data.status_unit}
              onChange={(e) => setData('status_unit', e.target.value)}
              className="w-full bg-slate-50 dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-700 p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white rounded-sm"
              required
            >
              <option value="Beroperasi">BEROPERASI</option>
              <option value="Rusak">RUSAK</option>
              <option value="Perbaikan">DALAM PERBAIKAN</option>
              <option value="Nonaktif">NONAKTIF</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Asal Satuan / Lokasi Penempatan</label>
            <select
              value={data.satuan_id || ''}
              onChange={(e) => {
                 setData('satuan_id', e.target.value);
                 const selectedSatuan = dbSatuans?.find((s: any) => s.id == e.target.value);
                 if (selectedSatuan) setData('asal_satuan', selectedSatuan.nama_satuan);
              }}
              className={`w-full bg-slate-50 dark:bg-cighra-darkcard border ${errors.satuan_id ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white uppercase rounded-sm`}
              required
            >
              <option value="">PILIH SATUAN</option>
              {dbSatuans?.map((satuan: any) => (
                <option key={satuan.id} value={satuan.id}>{satuan.nama_satuan.toUpperCase()}</option>
              ))}
            </select>
            {errors.satuan_id && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.satuan_id}</p>}
          </div>
          {isAddMode && (
            <div className="col-span-2">
              <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Surat Pendukung / Dokumentasi (PDF/IMG)</label>
              <input
                type="file"
                onChange={(e) => setData('document', e.target.files?.[0] || null)}
                className={`w-full bg-slate-50 dark:bg-cighra-darkcard border ${errors.document ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'} p-3 text-sm font-mono focus:ring-1 focus:ring-cighra-gold outline-none transition-all dark:text-white file:mr-4 file:py-1 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-tactical file:bg-cighra-primary file:text-white dark:file:bg-cighra-gold dark:file:text-slate-900 cursor-pointer rounded-sm`}
                required
                accept=".pdf,.png,.jpg,.jpeg"
              />
              {errors.document && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.document}</p>}
            </div>
          )}
        </div>
      </form>
    </BaseModal>
  );
};

export default UnitModal;

