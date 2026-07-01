import React from 'react';
import { Building2, MapPin, FileText } from 'lucide-react';
import { Modal } from '@/Components/ui/Modal';
import { Button } from '@/Components/ui/Button';

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DETAIL INFORMASI SATUAN"
      icon={<Building2 />}
      maxWidth="2xl"
      footer={
        <div className="w-full flex justify-end">
          <Button variant="secondary" onClick={onClose} className="uppercase" size="lg">
            TUTUP MODAL
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Identity Section */}
        <div className="pb-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 bg-cighra-primary dark:bg-cighra-gold flex items-center justify-center p-4 shadow-xl shrink-0">
               <Building2 className="w-12 h-12 text-white dark:text-slate-900" />
          </div>
          <div className="text-center md:text-left space-y-2">
              <p className="text-[10px] font-mono text-slate-500 tracking-[0.3em] font-bold uppercase">ID: {satuan.id}</p>
              <h4 className="text-3xl font-tactical font-extrabold text-slate-800 dark:text-white uppercase tracking-wider leading-none">{satuan.nama_satuan}</h4>
              <div className="inline-block bg-cighra-primary/10 dark:bg-cighra-gold/10 border border-cighra-primary/30 dark:border-cighra-gold/30 px-3 py-1 font-mono font-bold text-[10px] tracking-widest text-cighra-primary dark:text-cighra-gold">
                  IDENTIFICATION CODE: {satuan.kode_satuan || 'N/A'}
              </div>
          </div>
        </div>

        {/* Geo-Spatial Section (Side by Side) */}
        <div className="space-y-4">
            <h5 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-l-2 border-cighra-gold pl-2">GEO-SPATIAL INTELLIGENCE</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">COORDINATES (LAT/LNG)</label>
                    <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cighra-gold" />
                        {satuan.latitude && satuan.longitude ? `${satuan.latitude}, ${satuan.longitude}` : 'NO DATA'}
                    </p>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">PHYSICAL ADDRESS</label>
                    <p className="font-mono text-xs font-bold text-slate-800 dark:text-slate-300 leading-relaxed uppercase">
                        {satuan.alamat || 'UNSPECIFIED LOCATION'}
                    </p>
                </div>
            </div>
        </div>

        {/* Asset Capacity Summary */}
        <div className="space-y-4">
            <h5 className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest border-l-2 border-cighra-gold pl-2">ASSET CAPACITY SUMMARY</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-3xl font-tactical font-bold text-slate-800 dark:text-white leading-none">{satuanUnits.length}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase mt-2 font-bold tracking-wider">TOTAL ASSETS</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-3xl font-tactical font-bold text-green-600 leading-none">{activeUnits.length}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase mt-2 font-bold tracking-wider">OPERATIONAL</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-3xl font-tactical font-bold text-red-500 leading-none">{damagedUnits.length}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase mt-2 font-bold tracking-wider">IN MAINTENANCE</span>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center shadow-sm">
                    <span className="text-3xl font-tactical font-bold text-blue-500 leading-none">{satuanUsers.length}</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase mt-2 font-bold tracking-wider">AUTHORIZED PERSONNEL</span>
                </div>
            </div>
        </div>

        {/* Pending Status Report */}
        <div className="p-6 bg-slate-900 dark:bg-cighra-gold/5 border border-slate-700 dark:border-cighra-gold/20 flex items-center gap-5 relative overflow-hidden mt-8">
           <div className="absolute top-0 right-0 w-24 h-24 bg-cighra-gold opacity-[0.03] rotate-45 translate-x-12 -translate-y-12"></div>
           <div className="w-12 h-12 bg-cighra-gold flex items-center justify-center text-slate-900 shrink-0 shadow-lg">
              <FileText className="w-6 h-6" />
           </div>
           <div>
              <p className="font-tactical font-bold text-white dark:text-cighra-gold uppercase tracking-[0.2em]">PENDING STATUS REPORT</p>
              <p className="font-mono text-[10px] text-slate-400 dark:text-slate-400 mt-1 tracking-widest">THERE ARE <span className="text-white font-bold">{pendingCases.length} ACTIVE CASES</span> REQUIRING TECHNICAL INTERVENTION IN THIS SECTOR.</p>
           </div>
        </div>
      </div>
    </Modal>
  );
};

export default SatuanDetailModal;

