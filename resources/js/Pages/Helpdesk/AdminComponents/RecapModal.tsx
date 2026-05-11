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
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-slate-50 dark:bg-gunmetal border-2 border-targetred w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-targetred bg-targetred/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-targetred tracking-widest uppercase flex items-center gap-2">
            <FileArchive className="w-5 h-5" /> EKSPOR REKAPITULASI
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-targetred text-xl">✕</button>
        </div>

        <div className="p-6">
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-6 uppercase tracking-tight">
            Pilih periode laporan untuk diekspor ke format PDF (Landscape). Laporan ini mencakup seluruh data unit, teknisi, dan status penyelesaian.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(['weekly', 'monthly', 'yearly'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setRecapPeriod(period)}
                  className={`p-3 border-2 transition-all flex flex-col items-center justify-center gap-1
                    ${recapPeriod === period
                      ? 'border-targetred bg-targetred/10 text-targetred shadow-[0_0_10px_rgba(200,30,30,0.2)]'
                      : 'border-slate-200 dark:border-slate-700/50 text-slate-500 hover:border-gray-400'}
                  `}
                >
                  <p className="text-[10px] font-tactical font-bold uppercase tracking-widest">
                    {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Tahunan'}
                  </p>
                  <p className="text-[8px] font-mono italic">Berdasarkan Tgl Ini</p>
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRecapPeriod('custom')}
                className={`flex-1 p-3 border-2 transition-all flex flex-col items-center justify-center gap-1
                  ${recapPeriod === 'custom'
                    ? 'border-targetred bg-targetred/10 text-targetred shadow-[0_0_10px_rgba(200,30,30,0.2)]'
                    : 'border-slate-200 dark:border-slate-700/50 text-slate-500 hover:border-gray-400'}
                `}
              >
                <p className="text-[10px] font-tactical font-bold uppercase tracking-widest">Rentang Khusus</p>
                <p className="text-[8px] font-mono italic">Mulai - Selesai</p>
              </button>
              <button
                onClick={() => setRecapPeriod('year_specific')}
                className={`flex-1 p-3 border-2 transition-all flex flex-col items-center justify-center gap-1
                  ${recapPeriod === 'year_specific'
                    ? 'border-targetred bg-targetred/10 text-targetred shadow-[0_0_10px_rgba(200,30,30,0.2)]'
                    : 'border-slate-200 dark:border-slate-700/50 text-slate-500 hover:border-gray-400'}
                `}
              >
                <p className="text-[10px] font-tactical font-bold uppercase tracking-widest">Tahun Tertentu</p>
                <p className="text-[8px] font-mono italic">Pilih Tahun</p>
              </button>
            </div>

            {/* Conditional Input for Custom Range */}
            {recapPeriod === 'custom' && (
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-100 dark:bg-navy/30 border border-targetred/30 animate-in slide-in-from-top-2">
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Mulai Tanggal</label>
                  <input
                    type="date"
                    value={recapStartDate}
                    onChange={(e) => setRecapStartDate(e.target.value)}
                    className="w-full bg-white dark:bg-gunmetal border border-slate-200 dark:border-slate-700 p-2 text-xs font-mono outline-none focus:border-targetred"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Sampai Tanggal</label>
                  <input
                    type="date"
                    value={recapEndDate}
                    onChange={(e) => setRecapEndDate(e.target.value)}
                    className="w-full bg-white dark:bg-gunmetal border border-slate-200 dark:border-slate-700 p-2 text-xs font-mono outline-none focus:border-targetred"
                  />
                </div>
              </div>
            )}

            {/* Conditional Input for Year Specific */}
            {recapPeriod === 'year_specific' && (
              <div className="p-4 bg-gray-100 dark:bg-navy/30 border border-targetred/30 animate-in slide-in-from-top-2">
                <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Pilih Tahun</label>
                <select
                  value={recapYear}
                  onChange={(e) => setRecapYear(e.target.value)}
                  className="w-full bg-white dark:bg-gunmetal border border-slate-200 dark:border-slate-700 p-2 text-xs font-mono outline-none focus:border-targetred"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              onClick={onExport}
              className="bg-targetred text-white py-3 font-tactical font-bold tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" /> EKSPOR PDF
            </button>
            <button
              onClick={onClose}
              className="bg-transparent border border-gray-500 text-slate-500 py-3 font-tactical font-bold tracking-widest hover:bg-gray-500/10 transition-all"
            >
              BATAL
            </button>
          </div>
        </div>

        <div className="p-3 bg-black/20 text-center">
          <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
            Generated by Command Center Security Module
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecapModal;
