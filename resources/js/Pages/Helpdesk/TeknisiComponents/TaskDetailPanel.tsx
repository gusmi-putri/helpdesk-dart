import React from 'react';
import { Wrench, AlertCircle, MapPin } from 'lucide-react';

interface TaskDetailPanelProps {
  selectedTask: any | null;
  activeTab: 'ACTIVE' | 'HISTORY';
  children: React.ReactNode;
}

const TaskDetailPanel: React.FC<TaskDetailPanelProps> = ({ selectedTask, activeTab, children }) => {
  if (!selectedTask) {
    return (
      <div className="xl:col-span-8">
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
    <div className="xl:col-span-8">
      <div className="bg-white/80 dark:bg-cighra-darkcard/70 border border-slate-200 dark:border-slate-600 shadow-2xl rounded-sm relative overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-300">
        <div className="absolute top-0 left-0 w-1 h-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900"></div>

        {/* DETAIL TUGAS PANEL */}
        <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-600 bg-cighra-light dark:bg-cighra-darkcard/80 relative">
          {activeTab === 'HISTORY' && (
            <div className="absolute top-0 right-0 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-4 py-1 font-tactical font-bold text-[10px] tracking-widest uppercase">
              ARSIP LAPORAN SELESAI
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-tactical font-bold text-slate-800 dark:text-white mb-2 leading-none uppercase">
                {selectedTask.kerusakan.barangRusak}
              </h2>
              <div className="flex flex-wrap gap-4 text-[11px] font-mono font-bold text-slate-600 dark:text-slate-300 mt-3">
                <span className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-cighra-gold/15 border border-cighra-primary/50 dark:border-cighra-gold/40 text-cighra-primary dark:text-cighra-gold uppercase shadow-sm"><AlertCircle className="w-3.5 h-3.5" /> PRIORITAS: {selectedTask.kerusakan.urgensi?.toUpperCase() || 'NORMAL'}</span>
                <span className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-cighra-gold/15 border border-cighra-primary/50 dark:border-cighra-gold/40 text-cighra-primary dark:text-cighra-gold uppercase shadow-sm"><Wrench className="w-3.5 h-3.5" /> LEVEL: {selectedTask.kerusakan.tingkatKerusakan?.toUpperCase() || 'UMUM'}</span>
                <span className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-700/60 border border-slate-300 dark:border-slate-500 text-gunmetal dark:text-slate-200 uppercase shadow-sm"><MapPin className="w-3.5 h-3.5 text-cighra-primary dark:text-cighra-gold" /> LOKASI: {selectedTask.kerusakan.lokasi}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-cighra-darkcard/70 px-4 py-2 text-center border shadow-sm border-slate-300 dark:border-slate-600">
              <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400 tracking-widest mb-1 uppercase">KODE REFERENSI</div>
              <div className="font-mono text-lg font-bold text-slate-800 dark:text-white">{selectedTask.caseId}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white dark:bg-slate-800/60 p-5 border border-slate-300 dark:border-slate-500 rounded-sm relative shadow-sm">
              <span className="absolute -top-3 left-4 bg-white dark:bg-cighra-darkcard px-3 py-0.5 text-[10px] font-mono font-bold text-cighra-primary dark:text-cighra-gold border border-slate-300 dark:border-slate-600 border-b-transparent dark:border-b-transparent uppercase">Deskripsi Kendala</span>
              <p className="text-sm text-gunmetal dark:text-slate-200 font-sans leading-relaxed italic border-l-2 border-cighra-primary dark:border-cighra-gold/50 pl-4 mt-2">
                {selectedTask.kerusakan.deskripsi}
              </p>
              <div className="flex justify-end mt-2">
                <span className="text-[10px] bg-sand/60 dark:bg-soft-gunmetal/40 px-2 py-1 font-mono text-slate-600 dark:text-slate-300 font-bold uppercase">
                  PELAPOR: {selectedTask.kerusakan.pelapor}
                </span>
              </div>
            </div>

            {selectedTask.kerusakan.fileBukti && selectedTask.kerusakan.fileBukti.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {selectedTask.kerusakan.fileBukti.map((file: string, i: number) => (
                  <div key={i} className="border border-slate-200 dark:border-slate-600 rounded-sm overflow-hidden bg-black flex items-center justify-center group relative h-24">
                    <img src={file} alt={`Bukti ${i}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* AREA FORM / HISTORY VIEW */}
        <div className="p-6 md:p-8 bg-white/40 dark:bg-transparent flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPanel;
