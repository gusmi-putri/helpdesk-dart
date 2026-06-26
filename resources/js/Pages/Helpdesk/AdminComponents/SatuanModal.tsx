import React from 'react';
import { X, MapPin, Building2, Save } from 'lucide-react';

interface SatuanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  data: any;
  setData: (field: string, value: any) => void;
  errors: any;
  processing: boolean;
  isAddMode: boolean;
  isPengajuan?: boolean;
}

const SatuanModal: React.FC<SatuanModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  data,
  setData,
  errors,
  processing,
  isAddMode,
  isPengajuan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 px-6 overflow-y-auto">
      <div className="bg-white dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300 rounded-sm overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/5 flex justify-between items-center px-8">
          <div className="flex items-center gap-4">
            <Building2 className="w-6 h-6 text-cighra-primary dark:text-cighra-gold" />
            <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase text-lg">
              {isPengajuan ? (isAddMode ? 'PENGAJUAN TAMBAH SATUAN' : 'PENGAJUAN EDIT SATUAN') : (isAddMode ? 'TAMBAH DATA SATUAN' : 'EDIT DATA SATUAN')}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors text-xl">✕</button>
        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Form Fields */}
          <div className="col-span-2">
            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
              Nama SATUAN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.nama_satuan}
              onChange={(e) => setData('nama_satuan', e.target.value.toUpperCase())}
              placeholder="CTH: SATBRIMOB POLDA JABAR"
              className="w-full bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-700 p-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none uppercase"
            />
            {errors.nama_satuan && <p className="text-red-500 text-[9px] mt-1 font-mono uppercase">{errors.nama_satuan}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
              Kode Satuan
            </label>
            <input
              type="text"
              value={data.kode_satuan}
              onChange={(e) => setData('kode_satuan', e.target.value.toUpperCase())}
              placeholder="CTH: SBRM-01"
              className="w-full bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-700 p-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none uppercase"
            />
            {errors.kode_satuan && <p className="text-red-500 text-[9px] mt-1 font-mono uppercase">{errors.kode_satuan}</p>}
          </div>

          <div className="col-span-2">
            <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
              Alamat Lengkap
            </label>
            <textarea
              value={data.alamat}
              onChange={(e) => setData('alamat', e.target.value)}
              placeholder="ALAMAT LENGKAP SATUAN..."
              rows={2}
              className="w-full bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-700 p-2 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none uppercase"
            />
            {errors.alamat && <p className="text-red-500 text-[9px] mt-1 font-mono uppercase">{errors.alamat}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
                Latitude (LINTANG)
              </label>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={data.latitude}
                  onChange={(e) => setData('latitude', e.target.value)}
                  placeholder="-6.123456"
                  className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-700 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none"
                />
              </div>
              {errors.latitude && <p className="text-red-500 text-[9px] mt-1 font-mono uppercase">{errors.latitude}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 tracking-widest uppercase">
                Longitude (BUJUR)
              </label>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={data.longitude}
                  onChange={(e) => setData('longitude', e.target.value)}
                  placeholder="106.123456"
                  className="w-full pl-8 pr-2 py-2 bg-white dark:bg-slate-800 border border-gray-400 dark:border-slate-700 text-sm font-mono focus:border-cighra-primary dark:focus:border-cighra-gold outline-none"
                />
              </div>
              {errors.longitude && <p className="text-red-500 text-[9px] mt-1 font-mono uppercase">{errors.longitude}</p>}
            </div>
          </div>

          <div className="col-span-2">
            {isPengajuan ? (
              <div className="bg-yellow-500/10 p-4 border-l-4 border-yellow-500">
                <p className="text-[10px] text-yellow-600 dark:text-yellow-400 font-mono leading-relaxed">
                  <span className="font-bold uppercase tracking-widest block mb-1">PEMBERITAHUAN:</span> 
                  Data SATUAN yang Anda buat akan masuk sebagai pengajuan dan menunggu persetujuan Admin.
                </p>
              </div>
            ) : (
              <div className="bg-blue-500/10 p-4 border-l-4 border-blue-500">
                <p className="text-[10px] text-blue-600 dark:text-blue-400 font-mono leading-relaxed">
                  <span className="font-bold uppercase tracking-widest block mb-1">INFO VERIFIKASI:</span> 
                  Menyimpan kordinat (latitude & longitude) akan secara otomatis memverifikasi SATUAN ini.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 flex gap-4 px-8 pb-8">
          <button
            type="submit"
            disabled={processing}
            className="flex-[2] bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white p-3.5 font-tactical font-bold tracking-widest hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
          >
            {processing ? 'MEMPROSES...' : isPengajuan ? 'AJUKAN DATA' : (
              <>
                <Save className="w-4 h-4" /> SIMPAN DATA SATUAN
              </>
            )}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="flex-1 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 p-3.5 font-tactical font-bold tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase"
          >
            BATAL
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default SatuanModal;

