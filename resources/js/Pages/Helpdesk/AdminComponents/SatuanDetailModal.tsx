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
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 px-6 overflow-y-auto font-sans">
      <div className="bg-white dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300 rounded-sm overflow-hidden flex flex-col my-auto">
        
        {/* Header */}
        <div className="p-5 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/5 flex justify-between items-center px-8">
          <div className="flex items-center gap-4">
            <Building2 className="w-6 h-6 text-cighra-primary dark:text-cighra-gold" />
            <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase text-lg">
                DETAIL INFORMASI SATUAN
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors text-xl">✕</button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-1">
          {/* Identity Section */}
          <div className="pb-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-cighra-primary dark:bg-cighra-gold flex items-center justify-center p-4 shadow-xl">
                 <Building2 className="w-12 h-12 text-white dark:text-slate-900" />
            </div>
            <div className="text-center md:text-left space-y-2">
                <p className="text-[10px] font-mono text-slate-500 tracking-[0.3em] font-bold uppercase">{satuan.id}</p>
                <h4 className="text-3xl font-tactical font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none">{satuan.nama_satuan}</h4>
                <div className="inline-block bg-cighra-primary/10 dark:bg-cighra-gold/10 border border-cighra-primary/30 dark:border-cighra-gold/30 px-3 py-1 font-mono font-bold text-[10px] tracking-widest text-cighra-primary dark:text-cighra-gold">
                    IDENTIFICATION CODE: {satuan.kode_satuan || 'N/A'}
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h5 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-l-2 border-cighra-gold pl-2">GEO-SPATIAL INTELLIGENCE</h5>
                <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">COORDINATES (LAT/LNG)</label>
                        <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-cighra-gold" />
                            {satuan.latitude && satuan.longitude ? `${satuan.latitude}, ${satuan.longitude}` : 'NO DATA'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">PHYSICAL ADDRESS</label>
                        <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-300 leading-relaxed uppercase">
                            {satuan.alamat || 'UNSPECIFIED LOCATION'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h5 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-l-2 border-cighra-gold pl-2">ASSET CAPACITY SUMMARY</h5>
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-tactical font-bold text-slate-800 dark:text-white leading-none">{satuanUnits.length}</span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase mt-1">TOTAL ASSETS</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-tactical font-bold text-green-600 leading-none">{activeUnits.length}</span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase mt-1">OPERATIONAL</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-tactical font-bold text-red-500 leading-none">{damagedUnits.length}</span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase mt-1">IN MAINTENANCE</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                        <span className="text-2xl font-tactical font-bold text-blue-500 leading-none">{satuanUsers.length}</span>
                        <span className="text-[8px] font-mono text-slate-500 uppercase mt-1">AUTHORIZED PERSONNEL</span>
                    </div>
                </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 dark:bg-cighra-gold/5 border border-slate-700 dark:border-cighra-gold/20 flex items-center gap-5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-24 h-24 bg-cighra-gold opacity-[0.03] rotate-45 translate-x-12 -translate-y-12"></div>
             <div className="w-12 h-12 bg-cighra-gold flex items-center justify-center text-slate-900 shrink-0 shadow-lg">
                <FileText className="w-6 h-6" />
             </div>
             <div>
                <p className="font-tactical font-bold text-white dark:text-cighra-gold uppercase tracking-[0.2em]">PENDING STATUS REPORT</p>
                <p className="font-mono text-[9px] text-slate-400 dark:text-slate-400 mt-0.5 tracking-widest">THERE ARE <span className="text-white font-bold">{pendingCases.length} ACTIVE CASES</span> REQUIRING TECHNICAL INTERVENTION IN THIS SECTOR.</p>
             </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={onClose}
               className="bg-cighra-primary dark:bg-cighra-darkcard text-white px-12 py-3.5 font-tactical font-bold tracking-[0.2em] hover:bg-slate-700 dark:hover:bg-slate-800 border border-slate-700 transition-all uppercase shadow-lg active:scale-95"
            >
              TUTUP MODAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatuanDetailModal;

