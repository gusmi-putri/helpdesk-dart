import React from 'react';
import { Package } from 'lucide-react';

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
  editingUnit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2">
            <Package size={18} /> {isAddMode ? 'TAMBAH UNIT DART BARU' : `EDIT UNIT: ${editingUnit?.nomor_seri}`}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-cighra-primary dark:text-cighra-gold text-xl">✕</button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Nomor Seri Unit</label>
              <input
                type="text"
                value={data.nomor_seri}
                onChange={(e) => setData('nomor_seri', e.target.value.toUpperCase())}
                className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.nomor_seri ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none`}
                required
                placeholder="MISAL: DART-001"
              />
              {errors.nomor_seri && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.nomor_seri}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Keterangan DART</label>
              <input
                type="text"
                value={data.nama_dart}
                onChange={(e) => setData('nama_dart', e.target.value)}
                className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.nama_dart ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none`}
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Jenis DART</label>
              <select
                value={data.jenis_dart}
                onChange={(e) => setData('jenis_dart', e.target.value)}
                className="w-full bg-white dark:bg-cighra-darkcard border border-gray-400 dark:border-slate-600 p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none"
                required
              >
                <option value="DART STD">DART STD</option>
                <option value="DART STK">DART STK</option>
                <option value="SKE">SKE</option>
                <option value="MOVING TARGET">MOVING TARGET</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Status Operasional</label>
              <select
                value={data.status_unit}
                onChange={(e) => setData('status_unit', e.target.value)}
                className="w-full bg-white dark:bg-cighra-darkcard border border-gray-400 dark:border-slate-600 p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none"
                required
              >
                <option value="Siap Ops">SIAP OPS</option>
                <option value="Rusak">RUSAK</option>
                <option value="Perbaikan">PERBAIKAN</option>
                <option value="Nonaktif">NONAKTIF</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">Asal Satuan / Lokasi</label>
              <input
                type="text"
                value={data.asal_satuan}
                onChange={(e) => setData('asal_satuan', e.target.value)}
                className={`w-full bg-white dark:bg-cighra-darkcard border ${errors.asal_satuan ? 'border-red-500' : 'border-gray-400 dark:border-slate-600'} p-2 text-sm font-mono focus:border-cighra-primary dark:border-cighra-gold outline-none`}
                required
                placeholder="MISAL: PUSKOMLEKAD"
              />
            </div>
          </div>
          <div className="pt-4 flex gap-2">
            <button
              type="submit"
              disabled={processing}
              className="flex-1 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white py-3 font-tactical font-bold tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-colors disabled:opacity-50"
            >
              {processing ? 'MEMPROSES...' : (isAddMode ? 'TAMBAHKAN UNIT' : 'SIMPAN PERUBAHAN')}
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-transparent border border-gray-500 text-slate-500 py-3 font-tactical font-bold tracking-widest hover:bg-gray-500/10 transition-colors">
              BATAL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UnitModal;
