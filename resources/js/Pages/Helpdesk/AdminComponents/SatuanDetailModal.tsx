import React from 'react';
import { X, MapPin, Building2, Package, Users, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface SatuanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  satuan: any;
  dbUnits: any[];
  dbUsers: any[];
  dbCases: any[];
}

const SatuanDetailModal: React.FC<SatuanDetailModalProps> = ({
  isOpen,
  onClose,
  satuan,
  dbUnits,
  dbUsers,
  dbCases
}) => {
  if (!isOpen || !satuan) return null;

  // Calculate statistics
  const satuanUnits = dbUnits.filter(u => u.satuan_id === satuan.id || u.asal_satuan === satuan.nama_satuan);
  const activeUnits = satuanUnits.filter(u => u.status_unit === 'Beroperasi');
  const damagedUnits = satuanUnits.filter(u => u.status_unit === 'Rusak' || u.status_unit === 'Perbaikan');
  
  const satuanUsers = dbUsers.filter(u => u.satuan_id === satuan.id || u.asal_satuan === satuan.nama_satuan);
  
  const satuanCases = dbCases.filter(c => c.unit?.satuan_id === satuan.id || c.unit?.asal_satuan === satuan.nama_satuan);
  const pendingCases = satuanCases.filter(c => c.status !== 'SELESAI' && c.status !== 'DITOLAK');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-cighra-darkcard w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700 my-auto">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cighra-primary/10 dark:bg-cighra-gold/10 rounded-xl text-cighra-primary dark:text-cighra-gold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-tactical font-bold text-slate-800 dark:text-white uppercase tracking-widest">
                {satuan.nama_satuan}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono uppercase">
                KODE: {satuan.kode_satuan || '-'} | KOTAMA: {satuan.kotama || '-'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Location Info */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <h4 className="text-xs font-tactical text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Informasi Lokasi
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Kordinat Peta</p>
                <p className="font-mono text-sm text-slate-800 dark:text-slate-200">
                  {satuan.latitude && satuan.longitude ? `${satuan.latitude}, ${satuan.longitude}` : 'Belum diatur'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Alamat Lengkap</p>
                <p className="font-mono text-sm text-slate-800 dark:text-slate-200">
                  {satuan.alamat || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <h4 className="text-xs font-tactical text-slate-500 dark:text-slate-400 tracking-widest uppercase mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
            Statistik Satuan
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-center">
              <Package className="w-6 h-6 text-slate-400 mb-2" />
              <p className="text-2xl font-tactical font-bold text-slate-800 dark:text-white">{satuanUnits.length}</p>
              <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest mt-1">Total Unit DART</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 border border-green-200 dark:border-green-900/30 rounded-xl flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-2xl font-tactical font-bold text-green-600 dark:text-green-500">{activeUnits.length}</p>
              <p className="text-[9px] font-mono font-bold text-green-600/70 dark:text-green-500/70 uppercase tracking-widest mt-1">Unit Aktif</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 border border-red-200 dark:border-red-900/30 rounded-xl flex flex-col items-center justify-center text-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mb-2" />
              <p className="text-2xl font-tactical font-bold text-red-600 dark:text-red-500">{damagedUnits.length}</p>
              <p className="text-[9px] font-mono font-bold text-red-600/70 dark:text-red-500/70 uppercase tracking-widest mt-1">Unit Bermasalah</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 border border-blue-200 dark:border-blue-900/30 rounded-xl flex flex-col items-center justify-center text-center">
              <FileText className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-2xl font-tactical font-bold text-blue-600 dark:text-blue-500">{pendingCases.length}</p>
              <p className="text-[9px] font-mono font-bold text-blue-600/70 dark:text-blue-500/70 uppercase tracking-widest mt-1">Laporan Pending</p>
            </div>

          </div>

          <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-tactical font-bold text-slate-800 dark:text-white uppercase">Personel Terdaftar</p>
                  <p className="text-[10px] font-mono text-slate-500 uppercase">Total pelapor dari satuan ini</p>
                </div>
             </div>
             <p className="text-xl font-tactical font-bold text-slate-800 dark:text-white">{satuanUsers.length}</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-tactical tracking-wider text-white bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 rounded-lg transition-colors shadow-lg"
          >
            TUTUP DETAIL
          </button>
        </div>
      </div>
    </div>
  );
};

export default SatuanDetailModal;
