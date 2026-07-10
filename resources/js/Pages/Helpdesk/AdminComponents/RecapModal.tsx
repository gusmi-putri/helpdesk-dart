import React from 'react';
import { FileArchive, Download } from 'lucide-react';

interface RecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  recapPeriod: 'weekly' | 'monthly' | 'yearly' | 'custom' | 'year_specific';
  setRecapPeriod: (period: 'weekly' | 'monthly' | 'yearly' | 'custom' | 'year_specific') => void;
  recapStartDate: string;
  setRecapStartDate: (date: string) => void;
  recapEndDate: string;
  setRecapEndDate: (date: string) => void;
  recapYear: string;
  setRecapYear: (year: string) => void;
  onExport: () => void;
}

const RecapModal: React.FC<RecapModalProps> = ({
  isOpen,
  onClose,
  recapPeriod,
  setRecapPeriod,
  recapStartDate,
  setRecapStartDate,
  recapEndDate,
  setRecapEndDate,
  recapYear,
  setRecapYear,
  onExport
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 px-6 overflow-y-auto">
      <div className="bg-white dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-2xl shadow-[0_0_100px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300 rounded-sm overflow-hidden">
        <div className="p-5 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/5 flex justify-between items-center px-8">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2 text-lg">
            <FileArchive className="w-5 h-5" /> EKSPOR REKAPITULASI DATA
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors text-xl">✕</button>
        </div>

        <div className="p-8 space-y-8">
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-relaxed border-l-4 border-cighra-primary dark:border-cighra-gold pl-4 bg-slate-50 dark:bg-slate-800/20 p-4">
            KONFIGURASI PERIODE LAPORAN UNTUK EKSPOR FORMAT PDF (LANDSCAPE). DOKUMEN INI AKAN MENCAKUP DATA OPERASIONAL, STATUS UNIT, DAN REKAPITULASI PENANGANAN.
          </p>

          <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <label className="block text-xs font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">METODE FILTER PERIODE</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {(['weekly', 'monthly', 'yearly', 'custom', 'year_specific'] as const).map(period => (
                        <button
                        key={period}
                        onClick={() => setRecapPeriod(period)}
                        className={`p-3 border transition-all flex flex-col items-center justify-center gap-1.5 rounded-sm
                            ${recapPeriod === period
                            ? 'border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 text-cighra-primary dark:text-cighra-gold shadow-lg transform scale-105 z-10'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-cighra-darkcard text-slate-500 hover:border-cighra-gold/50'}
                        `}
                        >
                        <p className="text-[11px] font-tactical font-bold uppercase tracking-widest text-center leading-none">
                            {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : period === 'yearly' ? 'Tahunan' : period === 'custom' ? 'Kostum' : 'Filter Tahun'}
                        </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Conditional Input for Custom Range */}
            {recapPeriod === 'custom' && (
              <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-cighra-darkcard border border-cighra-gold/20 animate-in slide-in-from-top-4 duration-300">
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest">Mulai Tanggal</label>
                  <input
                    type="date"
                    value={recapStartDate}
                    onChange={(e) => setRecapStartDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-3 text-sm font-mono outline-none focus:ring-1 focus:ring-cighra-gold text-slate-800 dark:text-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest">Sampai Tanggal</label>
                  <input
                    type="date"
                    value={recapEndDate}
                    onChange={(e) => setRecapEndDate(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-3 text-sm font-mono outline-none focus:ring-1 focus:ring-cighra-gold text-slate-800 dark:text-white transition-all"
                  />
                </div>
              </div>
            )}

            {/* Conditional Input for Year Specific */}
            {recapPeriod === 'year_specific' && (
              <div className="p-6 bg-slate-50 dark:bg-cighra-darkcard border border-cighra-gold/20 animate-in slide-in-from-top-4 duration-300">
                <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">TARGET TAHUN OPERASIONAL</label>
                <select
                  value={recapYear}
                  onChange={(e) => setRecapYear(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-3 text-sm font-mono outline-none focus:ring-1 focus:ring-cighra-gold text-slate-800 dark:text-white transition-all"
                >
                  {Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString()).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="pt-4 flex gap-4">
            <button
              onClick={onExport}
              className="flex-[2] bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white p-4 font-tactical font-bold tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl uppercase"
            >
              <Download className="w-5 h-5" /> GENERATE LAPORAN PDF
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-transparent border border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 p-4 font-tactical font-bold tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase"
            >
              BATAL
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-100 dark:bg-black/20 text-center border-t border-slate-200 dark:border-slate-800">
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-500 uppercase tracking-widest">
            COMMAND CENTER SECURITY MODULE — DART DATA SYSTEM
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecapModal;

