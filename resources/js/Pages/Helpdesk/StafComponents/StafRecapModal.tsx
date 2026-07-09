import React from 'react';
import { FileArchive, Download, X, CalendarDays, CalendarRange } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';

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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="CETAK REKAPITULASI"
      icon={<FileArchive />}
      maxWidth="2xl"
      headerColor="primary"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs font-tactical font-bold tracking-widest border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-black/40 transition-colors uppercase rounded-sm"
          >
            Batal
          </button>
          <button
            onClick={onExport}
            className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-8 py-2.5 text-xs font-tactical font-bold tracking-widest transition-colors flex items-center gap-2 uppercase rounded-sm shadow-md"
          >
            <Download className="w-4 h-4" /> CETAK PDF
          </button>
        </div>
      }
    >
      <div className="p-6 md:p-8 space-y-6">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 border-l-4 border-olive rounded-r-sm shadow-sm">
            Pilih periode laporan untuk dicetak ke format PDF (Landscape). Laporan ini mencakup seluruh data inventaris, teknisi pelaksana, dan status penyelesaian perbaikan.
          </p>
          
          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Periode Standar</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['weekly', 'monthly', 'yearly'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setRecapPeriod(period)}
                  className={`p-4 border rounded-sm transition-all flex flex-col items-start gap-1 relative overflow-hidden group text-left
                    ${recapPeriod === period 
                      ? 'border-cighra-primary dark:border-cighra-gold bg-cighra-primary/5 dark:bg-cighra-gold/10 shadow-sm ring-1 ring-cighra-primary dark:ring-cighra-gold' 
                      : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-cighra-darkcard hover:border-cighra-primary/50 dark:hover:border-cighra-gold/50'}
                  `}
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center absolute top-4 right-4 transition-colors ${recapPeriod === period ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-300 dark:border-slate-500'}`}>
                     {recapPeriod === period && <div className="w-2 h-2 rounded-full bg-cighra-primary dark:bg-cighra-gold"></div>}
                  </div>
                  <p className={`text-sm font-bold uppercase tracking-widest ${recapPeriod === period ? 'text-cighra-primary dark:text-cighra-gold' : 'text-slate-700 dark:text-slate-300'}`}>
                    {period === 'weekly' ? 'Mingguan' : period === 'monthly' ? 'Bulanan' : 'Tahunan'}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1">S/D Hari Ini</p>
                </button>
              ))}
            </div>

            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">Kriteria Spesifik</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setRecapPeriod('custom')}
                className={`p-4 border rounded-sm transition-all flex flex-col items-start gap-1 relative overflow-hidden group text-left
                  ${recapPeriod === 'custom' 
                    ? 'border-cighra-primary dark:border-cighra-gold bg-cighra-primary/5 dark:bg-cighra-gold/10 shadow-sm ring-1 ring-cighra-primary dark:ring-cighra-gold' 
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-cighra-darkcard hover:border-cighra-primary/50 dark:hover:border-cighra-gold/50'}
                `}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center absolute top-4 right-4 transition-colors ${recapPeriod === 'custom' ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-300 dark:border-slate-500'}`}>
                   {recapPeriod === 'custom' && <div className="w-2 h-2 rounded-full bg-cighra-primary dark:bg-cighra-gold"></div>}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarRange size={16} className={recapPeriod === 'custom' ? 'text-cighra-primary dark:text-cighra-gold' : 'text-slate-400'} />
                  <p className={`text-sm font-bold uppercase tracking-widest ${recapPeriod === 'custom' ? 'text-cighra-primary dark:text-cighra-gold' : 'text-slate-700 dark:text-slate-300'}`}>Rentang Khusus</p>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Atur Tanggal Awal - Akhir</p>
              </button>

              <button
                onClick={() => setRecapPeriod('year_specific')}
                className={`p-4 border rounded-sm transition-all flex flex-col items-start gap-1 relative overflow-hidden group text-left
                  ${recapPeriod === 'year_specific' 
                    ? 'border-cighra-primary dark:border-cighra-gold bg-cighra-primary/5 dark:bg-cighra-gold/10 shadow-sm ring-1 ring-cighra-primary dark:ring-cighra-gold' 
                    : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-cighra-darkcard hover:border-cighra-primary/50 dark:hover:border-cighra-gold/50'}
                `}
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center absolute top-4 right-4 transition-colors ${recapPeriod === 'year_specific' ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-300 dark:border-slate-500'}`}>
                   {recapPeriod === 'year_specific' && <div className="w-2 h-2 rounded-full bg-cighra-primary dark:bg-cighra-gold"></div>}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays size={16} className={recapPeriod === 'year_specific' ? 'text-cighra-primary dark:text-cighra-gold' : 'text-slate-400'} />
                  <p className={`text-sm font-bold uppercase tracking-widest ${recapPeriod === 'year_specific' ? 'text-cighra-primary dark:text-cighra-gold' : 'text-slate-700 dark:text-slate-300'}`}>Tahun Tertentu</p>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pilih Satu Tahun Penuh</p>
              </button>
            </div>

            {/* Input Fields Container */}
            <div className="mt-4">
              {recapPeriod === 'custom' && (
                <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-600 rounded-sm animate-in slide-in-from-top-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Mulai Tanggal</label>
                    <input 
                      type="date" 
                      value={recapStartDate}
                      onChange={(e) => setRecapStartDate(e.target.value)}
                      className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 p-2.5 text-sm font-mono outline-none focus:border-cighra-primary dark:border-cighra-gold text-slate-800 dark:text-white rounded-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Sampai Tanggal</label>
                    <input 
                      type="date" 
                      value={recapEndDate}
                      onChange={(e) => setRecapEndDate(e.target.value)}
                      className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 p-2.5 text-sm font-mono outline-none focus:border-cighra-primary dark:border-cighra-gold text-slate-800 dark:text-white rounded-sm transition-colors"
                    />
                  </div>
                </div>
              )}

              {recapPeriod === 'year_specific' && (
                <div className="p-5 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-600 rounded-sm animate-in slide-in-from-top-2">
                  <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Pilih Tahun Evaluasi</label>
                  <select 
                    value={recapYear}
                    onChange={(e) => setRecapYear(e.target.value)}
                    className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 p-3 text-sm font-bold font-mono outline-none focus:border-cighra-primary dark:border-cighra-gold text-slate-800 dark:text-white rounded-sm transition-colors"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
    </BaseModal>
  );
};

export default StafRecapModal;

