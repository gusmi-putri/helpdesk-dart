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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-cighra-darkcard w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 my-auto">

        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cighra-primary/10 dark:bg-cighra-gold/10 rounded-xl text-cighra-primary dark:text-cighra-gold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-tactical font-bold text-slate-800 dark:text-white uppercase tracking-widest">
                {isPengajuan
                  ? (isAddMode ? 'Pengajuan Tambah SATUAN' : 'Pengajuan Edit SATUAN')
                  : (isAddMode ? 'Tambah SATUAN' : 'Edit SATUAN')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Lengkapi informasi SATUAN di bawah ini.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5">
          {/* Form Fields */}
          <div>
            <label className="block text-xs font-tactical tracking-widest text-slate-600 dark:text-slate-300 mb-2 uppercase">
              Nama SATUAN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.nama_satuan}
              onChange={(e) => setData('nama_satuan', e.target.value.toUpperCase())}
              placeholder="Cth: SATBRIMOB POLDA JABAR"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cighra-primary dark:focus:ring-cighra-gold focus:border-transparent transition-all uppercase"
            />
            {errors.nama_satuan && <p className="text-red-500 text-xs mt-1 font-medium">{errors.nama_satuan}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-tactical tracking-widest text-slate-600 dark:text-slate-300 mb-2 uppercase">
                Kode Satuan
              </label>
              <input
                type="text"
                value={data.kode_satuan}
                onChange={(e) => setData('kode_satuan', e.target.value.toUpperCase())}
                placeholder="Cth: SBRM-01"
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cighra-primary dark:focus:ring-cighra-gold focus:border-transparent transition-all uppercase"
              />
              {errors.kode_satuan && <p className="text-red-500 text-xs mt-1 font-medium">{errors.kode_satuan}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-tactical tracking-widest text-slate-600 dark:text-slate-300 mb-2 uppercase">
              Alamat Lengkap
            </label>
            <textarea
              value={data.alamat}
              onChange={(e) => setData('alamat', e.target.value)}
              placeholder="Alamat lengkap satuan..."
              rows={2}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cighra-primary dark:focus:ring-cighra-gold focus:border-transparent transition-all"
            />
            {errors.alamat && <p className="text-red-500 text-xs mt-1 font-medium">{errors.alamat}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-tactical tracking-widest text-slate-600 dark:text-slate-300 mb-2 uppercase">
                Latitude (Garis Lintang)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={data.latitude}
                  onChange={(e) => setData('latitude', e.target.value)}
                  placeholder="-6.123456"
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cighra-primary dark:focus:ring-cighra-gold focus:border-transparent transition-all"
                />
              </div>
              {errors.latitude && <p className="text-red-500 text-xs mt-1 font-medium">{errors.latitude}</p>}
            </div>

            <div>
              <label className="block text-xs font-tactical tracking-widest text-slate-600 dark:text-slate-300 mb-2 uppercase">
                Longitude (Garis Bujur)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={data.longitude}
                  onChange={(e) => setData('longitude', e.target.value)}
                  placeholder="106.123456"
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-cighra-primary dark:focus:ring-cighra-gold focus:border-transparent transition-all"
                />
              </div>
              {errors.longitude && <p className="text-red-500 text-xs mt-1 font-medium">{errors.longitude}</p>}
            </div>
          </div>

          {isPengajuan ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/30">
              <p className="text-xs text-yellow-700 dark:text-yellow-400">
                <span className="font-bold">Info:</span> Data SATUAN yang Anda buat akan masuk sebagai <b>pengajuan</b> dan menunggu persetujuan Admin.
              </p>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <p className="text-xs text-blue-700 dark:text-blue-400">
                <span className="font-bold">Info:</span> Menyimpan kordinat (latitude & longitude) akan secara otomatis <b>memverifikasi</b> SATUAN ini.
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="px-5 py-2.5 text-sm font-tactical tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              BATAL
            </button>
            <button
              type="submit"
              disabled={processing}
              className="px-5 py-2.5 flex items-center gap-2 text-sm font-tactical tracking-wider text-white bg-cighra-primary dark:text-slate-900 dark:bg-cighra-gold hover:opacity-90 rounded-lg shadow-lg shadow-cighra-primary/20 dark:shadow-cighra-gold/20 transition-all disabled:opacity-50"
            >
              {processing ? 'Menyimpan...' : isPengajuan ? 'AJUKAN DATA' : (
                <>
                  <Save className="w-4 h-4" /> SIMPAN DATA
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SatuanModal;

