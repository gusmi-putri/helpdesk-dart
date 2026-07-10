import React from 'react';
import { FileArchive, Download } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="EKSPOR REKAPITULASI DATA"
      icon={<FileArchive />}
      maxWidth="2xl"
      headerColor="primary"
      footer={
        <div className="w-full flex gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Button
            onClick={onExport}
            className="flex-[2] uppercase"
            size="lg"
            icon={<Download className="w-5 h-5" />}
          >
            GENERATE LAPORAN PDF
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 uppercase"
            size="lg"
          >
            BATAL
          </Button>
        </div>
      }
    >
      <div className="p-2 space-y-8">
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
      </div>
    </BaseModal>
  );
};

export default RecapModal;

