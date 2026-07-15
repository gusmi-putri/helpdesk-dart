import React from 'react';
import { Wrench, AlertCircle, MapPin, Wallet, FileText } from 'lucide-react';

interface TaskDetailPanelProps {
  selectedTask: any | null;
  activeTab: 'ACTIVE' | 'HISTORY';
  children: React.ReactNode;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ selectedTask, activeTab, children }) => {
  if (!selectedTask) {
    return (
      <div className="flex-1 w-full">
        <div className="h-full min-h-[500px] border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/40 dark:bg-cighra-darkcard/10 flex flex-col items-center justify-center rounded-sm text-center p-8">
          <Wrench className="w-20 h-20 text-slate-600/20 dark:text-slate-300/10 mb-6" />
          <h3 className="text-slate-500 dark:text-slate-300 font-tactical text-2xl tracking-widest mb-2 uppercase">Menunggu Pilihan Tugas</h3>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-sm max-w-md uppercase tracking-tighter">
            Silakan pilih salah satu laporan kerusakan di sebelah kiri untuk melihat detail instruksi dan mengirimkan laporan perbaikan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden">
      <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-600 shadow-2xl rounded-sm relative overflow-hidden flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
        <div className="absolute top-0 left-0 w-1 h-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900"></div>

        {/* SECTION 1: Informasi Tiket */}
        <div className="p-6 bg-cighra-light dark:bg-cighra-darkcard/80 border-b border-slate-200 dark:border-slate-600 relative flex flex-col justify-center min-h-[125px] md:min-h-[145px] gap-2.5 shrink-0">
          {activeTab === 'HISTORY' && (
            <div className="absolute top-0 right-0 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-4 py-1 font-tactical font-bold text-xs tracking-widest uppercase">
              ARSIP LAPORAN SELESAI
            </div>
          )}
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-2">
            <h2 className="text-2xl md:text-3xl font-tactical font-bold text-slate-800 dark:text-white leading-tight uppercase">
              {selectedTask.kerusakan.barangRusak}
            </h2>
            <div className="bg-white dark:bg-cighra-darkcard/70 px-3 py-1 border border-slate-300 dark:border-slate-600 inline-block w-fit">
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-wider mr-2 uppercase">REF:</span>
              <span className="font-mono text-sm font-bold text-slate-800 dark:text-white">{selectedTask.caseId}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] font-mono font-bold mt-1">
            <span className={`flex items-center gap-1.5 px-2 py-0.5 uppercase ${
              selectedTask.kerusakan.urgensi?.toUpperCase() === 'SANGAT MENDESAK'
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30'
                : selectedTask.kerusakan.urgensi?.toUpperCase() === 'BISA MENUNGGU'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                : 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-300 dark:border-green-500/30'
            }`}><AlertCircle className="w-3.5 h-3.5" /> PRIORITAS: {selectedTask.kerusakan.urgensi?.toUpperCase() || 'NORMAL'}</span>
            
            <span className={`flex items-center gap-1.5 px-2 py-0.5 uppercase ${
              ['PARAH', 'BERAT'].includes(selectedTask.kerusakan.tingkatKerusakan?.toUpperCase() || '')
                ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-500/30'
                : selectedTask.kerusakan.tingkatKerusakan?.toUpperCase() === 'SEDANG'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                : 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-300 dark:border-green-500/30'
            }`}><Wrench className="w-3.5 h-3.5" /> LEVEL: {selectedTask.kerusakan.tingkatKerusakan?.toUpperCase() || 'UMUM'}</span>
            
            <span className={`flex items-center gap-1.5 px-2 py-0.5 uppercase ${
              selectedTask.kerusakan.jenisPerbaikan === 'Non-Swadaya'
                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30'
                : 'bg-slate-100 dark:bg-soft-gunmetal/40 border border-slate-200 dark:border-slate-600 text-gunmetal dark:text-slate-300'
            }`}><Wallet className="w-3.5 h-3.5" /> {selectedTask.kerusakan.jenisPerbaikan || 'Swadaya'}</span>
            
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-sand/40 dark:bg-soft-gunmetal/40 border border-slate-200 dark:border-slate-600 text-gunmetal dark:text-slate-300 uppercase"><MapPin className="w-3.5 h-3.5 text-cighra-primary dark:text-cighra-gold" /> LOKASI: {selectedTask.kerusakan.lokasi}</span>
            
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-sand/40 dark:bg-soft-gunmetal/40 border border-slate-200 dark:border-slate-600 text-gunmetal dark:text-slate-300 uppercase">PELAPOR: {selectedTask.kerusakan.pelapor}</span>
          </div>
        </div>

        {/* SCROLLABLE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* SECTION 2: Deskripsi Kerusakan */}
          <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-600 space-y-6">
            <div className="space-y-2">
              <h3 className="text-slate-800 dark:text-white font-tactical font-bold text-lg tracking-widest uppercase">
                DESKRIPSI KERUSAKAN / KENDALA
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/40 p-5 border border-slate-200 dark:border-slate-700/80 rounded-sm relative shadow-sm">
                <p className="text-sm text-gunmetal dark:text-slate-200 font-sans leading-relaxed italic border-l-2 border-cighra-primary dark:border-cighra-gold/50 pl-4">
                  {selectedTask.kerusakan.deskripsi}
                </p>
              </div>
            </div>

            {/* Dukungan Anggaran (If Non-Swadaya) */}
            {selectedTask.kerusakan.jenisPerbaikan === 'Non-Swadaya' && (
              <div className="space-y-2 pt-2">
                <h4 className="text-slate-800 dark:text-white font-tactical font-bold text-xs tracking-wider uppercase">
                  DUKUNGAN ANGGARAN
                </h4>
                <div className="bg-blue-50 dark:bg-blue-900/10 p-5 border border-blue-200 dark:border-blue-800/40 rounded-sm relative shadow-sm">
                  <p className="text-sm text-gunmetal dark:text-slate-200 font-sans leading-relaxed italic border-l-2 border-blue-500 pl-4">
                    {selectedTask.kerusakan.keteranganAnggaran || 'Tidak ada keterangan anggaran.'}
                  </p>
                  {selectedTask.kerusakan.dokumenAnggaran?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedTask.kerusakan.dokumenAnggaran.map((doc: string, index: number) => (
                        <a
                          key={doc}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold tracking-widest rounded-sm transition-colors uppercase border border-blue-700 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" /> Dokumen {index + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preview Foto Dokumentasi Kerusakan */}
            <div className="space-y-3 pt-2">
              <h4 className="text-slate-800 dark:text-white font-tactical font-bold text-xs tracking-wider uppercase">
                DOKUMENTASI FOTO KERUSAKAN
              </h4>
              {selectedTask.kerusakan.fileBukti && selectedTask.kerusakan.fileBukti.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedTask.kerusakan.fileBukti.map((file: string, i: number) => (
                    <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-sm overflow-hidden bg-black flex items-center justify-center group relative h-28 shadow-sm">
                      <img src={file} alt={`Bukti ${i}`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border border-dashed border-slate-300 dark:border-slate-600 text-center font-mono text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/10">
                  BELUM ADA DOKUMENTASI
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Form Penyelesaian */}
          <div className="p-6 md:p-8 bg-white/40 dark:bg-transparent">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPanel;

