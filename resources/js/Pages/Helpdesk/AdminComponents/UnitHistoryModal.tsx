import React from 'react';
import { Clock, AlertTriangle, Wrench } from 'lucide-react';

interface UnitHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: any;
  dbCases: any[];
}

const UnitHistoryModal: React.FC<UnitHistoryModalProps> = ({ isOpen, onClose, unit, dbCases }) => {
  if (!isOpen || !unit) return null;

  // Filter cases based on unit_id
  const unitHistory = dbCases.filter((c: any) => c.unit_id === unit.id || c.unit_id === unit.db_id);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 px-6 overflow-y-auto">
      <div className="bg-white dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-5xl shadow-[0_0_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300 rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/5 flex justify-between items-center px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Clock className="w-6 h-6 text-cighra-primary dark:text-cighra-gold" />
            <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase text-lg">LOG RIWAYAT PERBAIKAN: {unit.nomor_seri}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors text-xl">✕</button>
        </div>

        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-12 h-12 bg-slate-200/20 dark:bg-slate-700/20 rotate-45 translate-x-6 -translate-y-6"></div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Status Asset</p>
              <p className={`text-sm font-bold font-mono ${unit.status_unit === 'Beroperasi' ? 'text-green-600' : 'text-red-500'}`}>{unit.status_unit?.toUpperCase()}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Model / Varian</p>
              <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100 uppercase">{unit.jenis}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Area Penempatan</p>
              <p className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100 uppercase">{unit.asal_satuan}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-1">Database Records</p>
              <p className="text-sm font-bold font-mono text-cighra-primary dark:text-cighra-gold">{unitHistory.length} ENTRI LOG</p>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-[0.3em] font-bold pb-2 border-b border-slate-200 dark:border-slate-800">SEQUENCE OF HISTORICAL DATA</h5>
            {unitHistory.length === 0 ? (
              <div className="p-16 text-center text-slate-500 dark:text-slate-500 italic font-mono uppercase tracking-[0.2em] border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-transparent">
                SYSTEM MESSAGE: NO SERVICE RECORDS FOUND FOR THIS ASSET.
              </div>
            ) : (
              unitHistory.map((entry: any) => (
                <div key={entry.caseId} className="border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-cighra-darkcard/40 p-6 relative shadow-sm group hover:border-cighra-gold/30 transition-all">
                  <div className="absolute top-0 left-0 w-1 h-full bg-cighra-primary dark:bg-cighra-gold opacity-30 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-cighra-primary dark:text-cighra-gold font-bold tracking-widest px-2 py-0.5 border border-cighra-primary/30 dark:border-cighra-gold/30 bg-white dark:bg-black/40">
                            {entry.caseId}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            LOGGED AT: {entry.kerusakan.tanggal}
                          </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wide">{entry.kerusakan.barangRusak}</h4>
                    </div>
                    <span className={`px-4 py-1.5 text-[10px] font-mono font-bold border tracking-widest shadow-sm transition-all
                      ${entry.status === 'SELESAI' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' :
                        entry.status === 'PROSES' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'}
                    `}>
                      {entry.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <p className="text-[10px] font-mono font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" /> Issue Documentation
                      </p>
                      <div className="p-4 bg-white dark:bg-black/30 border-l-4 border-orange-400/50 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono italic">
                        "{entry.kerusakan.deskripsi}"
                      </div>
                      <p className="text-[9px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-tighter">
                        REPORTED BY: {entry.kerusakan.pelapor.toUpperCase()}
                      </p>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
                        <Wrench className="w-4 h-4" /> Technical Intervention
                      </p>
                      {entry.perbaikan.tindakan ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-white dark:bg-black/30 border-l-4 border-blue-400/50 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
                            {entry.perbaikan.tindakan}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {entry.perbaikan.metodePerbaikan && (
                              <span className="text-[9px] bg-slate-800 dark:bg-blue-900/20 text-white dark:text-blue-400 border border-slate-700 dark:border-blue-900/40 px-2 py-1 font-tactical font-bold tracking-widest">
                                METHOD: {entry.perbaikan.metodePerbaikan.toUpperCase()}
                              </span>
                            )}
                            {entry.perbaikan.tanggalSelesai && (
                              <span className="text-[9px] bg-green-600 dark:bg-green-900/20 text-white dark:text-green-500 border border-green-600 dark:border-green-900/40 px-2 py-1 font-tactical font-bold tracking-widest">
                                RESOLVED: {entry.perbaikan.tanggalSelesai}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 border border-dashed border-slate-300 dark:border-slate-800 text-[10px] text-slate-400 font-mono italic">
                          AWAITING TECHNICAL LOG ENTRY...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitHistoryModal;

