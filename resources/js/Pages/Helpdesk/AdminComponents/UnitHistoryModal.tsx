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
    <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-blue-600 w-full max-w-4xl shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-blue-600 bg-blue-900/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-blue-500 tracking-widest uppercase flex items-center gap-2">
            <Clock className="w-5 h-5" /> RIWAYAT PERBAIKAN: {unit.nomor_seri}
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-cighra-primary dark:text-cighra-gold text-xl">✕</button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-white/40 dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600/50">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Keterangan</p>
              <p className="text-sm font-bold uppercase">{unit.nama_dart}</p>
            </div>
            <div className="p-3 bg-white/40 dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600/50">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Jenis DART</p>
              <p className="text-sm font-bold uppercase">{unit.jenis_dart}</p>
            </div>
            <div className="p-3 bg-white/40 dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600/50">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Lokasi</p>
              <p className="text-sm font-bold uppercase">{unit.asal_satuan}</p>
            </div>
            <div className="p-3 bg-white/40 dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600/50">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Total Kasus</p>
              <p className="text-sm font-bold uppercase text-blue-500">{unitHistory.length} ENTRI</p>
            </div>
          </div>

          <div className="space-y-4">
            {unitHistory.length === 0 ? (
              <div className="p-10 text-center text-slate-500 italic font-mono uppercase tracking-widest border border-dashed border-gray-400 dark:border-slate-600">
                Unit ini belum memiliki catatan kerusakan/perbaikan di sistem.
              </div>
            ) : (
              unitHistory.map((entry: any) => (
                <div key={entry.caseId} className="border border-slate-200 dark:border-slate-600/50 bg-white/20 dark:bg-cighra-darkcard/80 p-4 relative group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-50"></div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-mono text-blue-500 font-bold tracking-tighter bg-blue-900/10 px-2 py-0.5 border border-blue-900/20">
                        {entry.caseId}
                      </span>
                      <h4 className="text-sm font-bold mt-2 uppercase">{entry.kerusakan.barangRusak}</h4>
                    </div>
                    <span className={`px-2 py-1 text-[9px] font-mono font-bold border
                      ${entry.status === 'SELESAI' ? 'bg-green-900/20 text-green-500 border-green-800' :
                        entry.status === 'PROSES' ? 'bg-blue-900/20 text-blue-500 border-blue-800' :
                          'bg-cighra-primary/20 dark:bg-cighra-gold/20 text-cighra-primary dark:text-cighra-gold border-cighra-primary dark:border-cighra-gold/50'}
                    `}>
                      {entry.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <p className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Detail Kerusakan
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        "{entry.kerusakan.deskripsi}"
                      </p>
                      <p className="text-[10px] font-mono text-slate-500 mt-2">
                        Dilaporkan oleh: {entry.kerusakan.pelapor} pada {entry.kerusakan.tanggal}
                      </p>
                    </div>
                    <div className="space-y-2 border-l border-slate-200 dark:border-slate-600/50 pl-4">
                      <p className="text-[9px] font-mono text-slate-500 uppercase flex items-center gap-1">
                        <Wrench className="w-3 h-3" /> Penanganan Teknisi
                      </p>
                      {entry.perbaikan.tindakan ? (
                        <>
                          <p className="text-xs text-slate-800 dark:text-slate-200">
                            {entry.perbaikan.tindakan}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {entry.perbaikan.metodePerbaikan && (
                              <span className="text-[8px] bg-blue-900/10 text-blue-500 border border-blue-900/20 px-1.5 py-0.5 font-mono">
                                METODE: {entry.perbaikan.metodePerbaikan}
                              </span>
                            )}
                            {entry.perbaikan.tanggalSelesai && (
                              <span className="text-[8px] bg-green-900/10 text-green-500 border border-green-900/20 px-1.5 py-0.5 font-mono">
                                SELESAI: {entry.perbaikan.tanggalSelesai}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-slate-500 italic">Belum ada catatan penanganan teknis.</p>
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
