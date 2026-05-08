import React from 'react';
import { FileArchive, Download } from 'lucide-react';

interface StafRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  recapPeriod: 'weekly' | 'monthly' | 'yearly' | 'custom' | 'year_specific';
  setRecapPeriod: (p: 'weekly' | 'monthly' | 'yearly' | 'custom' | 'year_specific') => void;
  recapStartDate: string;
  setRecapStartDate: (s: string) => void;
  recapEndDate: string;
  setRecapEndDate: (s: string) => void;
  recapYear: string;
  setRecapYear: (s: string) => void;
  onExport: () => void;
}

const StafRecapModal: React.FC<StafRecapModalProps> = ({
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
      <div className="bg-sand dark:bg-gunmetal border-2 border-targetred w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-targetred bg-targetred/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-targetred tracking-widest uppercase flex items-center gap-2">
            <FileArchive className="w-5 h-5" /> CETAK REKAPITULASI
          </h3>
          <button onClick={onClose} className="text-soft-gunmetal hover:text-targetred text-xl">✕</button>
        </div>
        
        <div className="p-6">
          <p className="text-xs font-mono text-soft-gunmetal/60 dark:text-soft-sand/40 mb-6 uppercase tracking-tight">
            Pilih periode laporan untuk dicetak ke format PDF (Landscape). Laporan ini mencakup seluruh data unit, teknisi, dan status penyelesaian.
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
                      : 'border-soft-gunmetal/20 dark:border-soft-sand/10 text-soft-gunmetal/40 dark:text-soft-sand/30 hover:border-targetred/30'}
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
                    : 'border-soft-gunmetal/20 dark:border-soft-sand/10 text-soft-gunmetal/40 dark:text-soft-sand/30 hover:border-targetred/30'}
                `}
              >
                <p className="text-[10px] font-tactical font-bold uppercase tracking-widest">Rentang Khusus</p>
                <p className="text-[8px] font-mono italic">Mulai - Selesai</p>
              </button>
              <button
                onClick={() => setRecapPeriod('year_specific')}
                className={`flex-1 p-3 border-2 transition-all flex flex-col items-center justify-center gap-1
                  ${recapPeriod === 'year_specific' 
                    ? 'border-targetred bg-targetred/10 text-targetred shadow-[0_0_10_rgba(200,30,30,0.2)]' 
                    : 'border-soft-gunmetal/20 dark:border-soft-sand/10 text-soft-gunmetal/40 dark:text-soft-sand/30 hover:border-targetred/30'}
                `}
              >
                <p className="text-[10px] font-tactical font-bold uppercase tracking-widest">Tahun Tertentu</p>
                <p className="text-[8px] font-mono italic">Pilih Tahun</p>
              </button>
            </div>

            {/* Conditional Input for Custom Range */}
            {recapPeriod === 'custom' && (
              <div className="grid grid-cols-2 gap-3 p-4 bg-sand/20 dark:bg-black/30 border border-targetred/30 animate-in slide-in-from-top-2">
                <div>
                  <label className="block text-[9px] font-mono text-soft-gunmetal/50 dark:text-soft-sand/30 uppercase mb-1">Mulai Tanggal</label>
                  <input 
                    type="date" 
                    value={recapStartDate}
                    onChange={(e) => setRecapStartDate(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-soft-gunmetal/20 dark:border-soft-sand/10 p-2 text-xs font-mono outline-none focus:border-targetred text-gunmetal dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-soft-gunmetal/50 dark:text-soft-sand/30 uppercase mb-1">Sampai Tanggal</label>
                  <input 
                    type="date" 
                    value={recapEndDate}
                    onChange={(e) => setRecapEndDate(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-soft-gunmetal/20 dark:border-soft-sand/10 p-2 text-xs font-mono outline-none focus:border-targetred text-gunmetal dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Conditional Input for Year Specific */}
            {recapPeriod === 'year_specific' && (
              <div className="p-4 bg-sand/20 dark:bg-black/30 border border-targetred/30 animate-in slide-in-from-top-2">
                <label className="block text-[9px] font-mono text-soft-gunmetal/50 dark:text-soft-sand/30 uppercase mb-1">Pilih Tahun</label>
                <select 
                  value={recapYear}
                  onChange={(e) => setRecapYear(e.target.value)}
                  className="w-full bg-white dark:bg-black border border-soft-gunmetal/20 dark:border-soft-sand/10 p-2 text-xs font-mono outline-none focus:border-targetred text-gunmetal dark:text-white"
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
              className="bg-targetred text-sand py-3 font-tactical font-bold tracking-widest hover:bg-[#8B152A] transition-all flex items-center justify-center gap-2 shadow-lg uppercase"
            >
              <Download className="w-4 h-4" /> Cetak Laporan
            </button>
            <button
              onClick={onClose}
              className="bg-transparent border border-soft-gunmetal/20 text-soft-gunmetal/60 py-3 font-tactical font-bold tracking-widest hover:bg-soft-gunmetal/10 transition-all uppercase"
            >
              Batalkan
            </button>
          </div>
        </div>
        
        <div className="p-3 bg-black/20 text-center">
          <p className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
            Generated by Command Center Security Module
          </p>
        </div>
      </div>
    </div>
  );
};

export default StafRecapModal;
