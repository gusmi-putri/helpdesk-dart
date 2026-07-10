import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface CompletionSummaryProps {
  selectedTask: any;
  onBack: () => void;
}

const CompletionSummary: React.FC<CompletionSummaryProps> = ({ selectedTask, onBack }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-cighra-primary dark:text-cighra-gold font-tactical font-bold text-lg mb-4 flex items-center gap-2 tracking-widest uppercase border-b border-cighra-primary dark:border-cighra-gold/20 pb-2">
        <CheckCircle2 className="w-5 h-5" /> RINGKASAN PENYELESAIAN
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-mono text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1">Metode Perbaikan</p>
            <p className="text-sm font-bold text-slate-800 dark:text-white bg-cighra-light dark:bg-cighra-darkcard/30 p-3 border-l-4 border-cighra-primary dark:border-cighra-gold uppercase">
              {selectedTask.perbaikan.metode || 'LANGSUNG'}
            </p>
          </div>
          <div>
            <p className="text-xs font-mono text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1">Catatan Pelaksanaan</p>
            <div className="text-sm text-gunmetal dark:text-slate-300 bg-white/40 dark:bg-cighra-darkcard/80 p-4 border border-slate-200 dark:border-slate-600 italic uppercase">
              {selectedTask.perbaikan.tindakan || 'Tidak ada catatan tambahan.'}
            </div>
          </div>
        </div>
        <div>
           <p className="text-xs font-mono text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-1">Bukti Penyelesaian</p>
           {selectedTask.perbaikan.foto_bukti_selesai ? (
             <div className="border-4 border-white dark:border-black/40 shadow-xl overflow-hidden rounded-sm h-48">
               <img src={selectedTask.perbaikan.foto_bukti_selesai} alt="Bukti Selesai" className="w-full h-full object-cover" />
             </div>
           ) : (
             <div className="h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400 font-mono text-xs uppercase">
                FOTO TIDAK DILAMPIRKAN
             </div>
           )}
        </div>
      </div>
      <div className="pt-6 border-t border-slate-200 dark:border-slate-600 flex justify-between items-center">
        <div className="text-xs font-mono text-slate-500 dark:text-slate-300 uppercase">
          Selesai pada: {selectedTask.perbaikan.tanggalSelesai}
        </div>
        <button 
          onClick={onBack}
          className="bg-gunmetal dark:bg-soft-gunmetal text-white px-6 py-2 font-tactical font-bold text-xs tracking-widest hover:bg-black transition-colors uppercase shadow-md"
        >
          KEMBALI KE DAFTAR
        </button>
      </div>
    </div>
  );
};

export default CompletionSummary;

