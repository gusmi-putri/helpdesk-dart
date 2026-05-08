import React from 'react';
import { Activity, CheckCircle2, Clock, ChevronRight } from 'lucide-react';

interface ReportHistoryProps {
  history: any[];
  filterTime: 'ALL' | 'TODAY' | 'WEEK';
  setFilterTime: (t: 'ALL' | 'TODAY' | 'WEEK') => void;
  onSelectItem: (id: number) => void;
}

const ReportHistory: React.FC<ReportHistoryProps> = ({
  history,
  filterTime,
  setFilterTime,
  onSelectItem
}) => {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white tracking-widest uppercase">Riwayat Laporan</h2>
          <p className="text-soft-gunmetal/60 dark:text-soft-sand/40 text-xs font-mono mt-1 tracking-widest uppercase">Log Pelaporan Unit (Terbaru di Atas)</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-800 p-1 rounded-sm shadow-sm">
            {(['ALL', 'TODAY', 'WEEK'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterTime(t)}
                className={`px-3 py-1.5 text-[9px] font-tactical font-bold tracking-widest transition-all ${filterTime === t ? 'bg-olive text-white shadow-md' : 'text-gray-500 hover:text-olive'}`}
              >
                {t === 'ALL' ? 'SEMUA' : t === 'TODAY' ? 'HARI INI' : 'MINGGU INI'}
              </button>
            ))}
          </div>
          <div className="bg-olive/10 border border-olive/30 px-4 py-2 hidden sm:block">
            <span className="text-[10px] font-mono text-olive font-bold tracking-widest">TOTAL: {history.length} TIKET</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-mono bg-white/40 dark:bg-black/40 border border-gray-300 dark:border-gray-800">
            {filterTime === 'ALL' ? 'ANDA BELUM PERNAH MENGAJUKAN LAPORAN APAPUN.' : 'TIDAK ADA LAPORAN PADA PERIODE INI.'}
          </div>
        ) : (
          history.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() => onSelectItem(item.db_id)}
              className="glass-panel p-5 border-l-4 border-l-soft-gunmetal/20 dark:border-l-soft-sand/10 hover:border-l-olive transition-all cursor-pointer group hover:bg-sand/30 dark:hover:bg-black/40 bg-white/60 dark:bg-black/20 shadow-md border border-soft-gunmetal/10 dark:border-soft-sand/5"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-soft-gunmetal/50 dark:text-soft-sand/40 bg-sand/50 dark:bg-black/40 px-2 py-1 tracking-widest">{item.caseId}</span>
                  <span className="text-xs font-mono text-soft-gunmetal/40 dark:text-soft-sand/30 tracking-tighter uppercase">{item.kerusakan.tanggal}</span>
                </div>
                <div className={`px-3 py-1 text-[9px] font-tactical font-bold tracking-[0.2em] flex items-center gap-2 border uppercase
                  ${item.status === 'SELESAI' ? 'bg-green-900/20 text-green-500 border-green-800' :
                    item.status === 'PROSES' ? 'bg-blue-900/20 text-blue-500 border-blue-800' :
                      'bg-yellow-900/20 text-yellow-500 border-yellow-800'}
                `}>
                  {item.status === 'SELESAI' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                  {item.status}
                </div>
              </div>
              <h4 className="text-sm font-bold text-gunmetal dark:text-white mb-2 group-hover:text-olive transition-colors uppercase tracking-wide">
                {item.kerusakan.barangRusak}
              </h4>
              <p className="text-xs text-soft-gunmetal/70 dark:text-soft-sand/60 line-clamp-2 font-mono leading-relaxed italic">
                "{item.kerusakan.deskripsi}"
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-[10px] text-soft-gunmetal/40 dark:text-soft-sand/40 flex items-center gap-1 font-mono uppercase">
                    <Activity size={12} className="text-olive" /> {item.kerusakan.lokasi}
                  </div>
                  {item.status === 'SELESAI' && item.perbaikan.tanggalSelesai && (
                    <div className="text-[10px] text-camogreen font-bold font-mono flex items-center gap-1 uppercase">
                      <CheckCircle2 size={12} /> SELESAI: {item.perbaikan.tanggalSelesai}
                    </div>
                  )}
                  {item.perbaikan.teknisi && item.status !== 'SELESAI' && (
                    <div className="text-[10px] text-olive font-bold font-mono flex items-center gap-1 uppercase">
                      [TEKNISI: {item.perbaikan.teknisi.toUpperCase()}]
                    </div>
                  )}
                </div>
                <ChevronRight size={16} className="text-soft-gunmetal/30 dark:text-soft-sand/20 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReportHistory;
