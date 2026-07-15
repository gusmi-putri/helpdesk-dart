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
  const stats = {
    total: history.length,
    pending: history.filter((r: any) => r.status === 'PENDING').length,
    proses: history.filter((r: any) => r.status === 'DIVERIFIKASI' || r.status === 'DITERIMA TEKNISI' || r.status === 'DIPROSES').length,
    selesai: history.filter((r: any) => r.status === 'SELESAI').length,
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'TOTAL LAPORAN', value: stats.total, color: 'border-cighra-primary dark:border-cighra-gold', text: 'text-cighra-primary dark:text-cighra-gold' },
          { label: 'MENUNGGU', value: stats.pending, color: 'border-yellow-500', text: 'text-yellow-500' },
          { label: 'DALAM PROSES', value: stats.proses, color: 'border-blue-500', text: 'text-blue-500' },
          { label: 'SELESAI', value: stats.selesai, color: 'border-camogreen', text: 'text-camogreen' },
        ].map((s, i) => (
          <div key={i} className={`!bg-cighra-primary dark:!bg-cighra-darkcard/80 border-l-4 ${s.color} p-3 shadow-md`}>
            <p className="text-[11px] font-mono font-bold text-slate-300 tracking-widest uppercase mb-0.5">{s.label}</p>
            <p className={`text-xl font-tactical font-bold ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase">Riwayat Laporan</h2>
          <p className="text-slate-500 dark:text-slate-300 text-xs font-mono mt-1 tracking-widest uppercase">Log Pelaporan Unit (Terbaru di Atas)</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex bg-white dark:bg-cighra-darkcard/60 border border-slate-200 dark:border-slate-600/50 p-1 rounded-sm shadow-sm">
            {(['ALL', 'TODAY', 'WEEK'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterTime(t)}
                className={`px-3 py-1.5 text-[11px] font-tactical font-bold tracking-widest transition-all ${filterTime === t ? 'bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-cighra-primary dark:hover:text-cighra-gold'}`}
              >
                {t === 'ALL' ? 'SEMUA' : t === 'TODAY' ? 'HARI INI' : 'MINGGU INI'}
              </button>
            ))}
          </div>
          <div className="bg-cighra-primary/10 dark:bg-cighra-gold/10 border border-cighra-primary dark:border-cighra-gold/30 px-4 py-2 hidden sm:block">
            <span className="text-xs font-mono text-cighra-primary dark:text-cighra-gold font-bold tracking-widest">TOTAL: {history.length} TIKET</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono bg-white/40 dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600/50">
            {filterTime === 'ALL' ? 'ANDA BELUM PERNAH MENGAJUKAN LAPORAN APAPUN.' : 'TIDAK ADA LAPORAN PADA PERIODE INI.'}
          </div>
        ) : (
          history.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() => onSelectItem(item.db_id)}
              className="glass-panel p-5 border-l-4 border-white/20 dark:border-l-soft-sand/10 hover:border-l-cighra-gold dark:hover:border-l-cighra-gold transition-all cursor-pointer group hover:!bg-cighra-primary/95 dark:hover:!bg-black/40 !bg-cighra-primary dark:!bg-cighra-darkcard/80 shadow-md border border-white/10 dark:border-slate-600"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-white bg-white/10 dark:!bg-white/5 px-2 py-1 tracking-widest">{item.caseId}</span>
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-400 tracking-tighter uppercase">{item.kerusakan.tanggal}</span>
                </div>
                <div className={`px-3 py-1 text-[11px] font-tactical font-bold tracking-[0.2em] flex items-center gap-2 border uppercase shadow-sm
                  ${item.status === 'SELESAI' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                    item.status === 'DITOLAK' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    item.status === 'PENDING' ? 'bg-cighra-gold/20 text-cighra-gold border-cighra-gold/30' :
                      'bg-blue-500/20 text-blue-400 border-blue-500/30'}
                `}>
                  {item.status === 'SELESAI' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                  {item.status}
                </div>
              </div>
              <h4 className="text-sm font-bold text-white mb-2 group-hover:text-cighra-gold transition-colors uppercase tracking-wide">
                {item.kerusakan.barangRusak}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2 font-mono leading-relaxed italic">
                "{item.kerusakan.deskripsi}"
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-xs text-slate-300 flex items-center gap-1 font-mono uppercase">
                    <Activity size={12} className="text-cighra-gold" /> {item.kerusakan.lokasi}
                  </div>
                  {item.status === 'SELESAI' && item.perbaikan.tanggalSelesai && (
                    <div className="text-xs text-green-400 font-bold font-mono flex items-center gap-1 uppercase">
                      <CheckCircle2 size={12} /> SELESAI: {item.perbaikan.tanggalSelesai}
                    </div>
                  )}
                  {item.perbaikan.teknisi && item.status !== 'SELESAI' && (
                    <div className="text-xs text-cighra-gold font-bold font-mono flex items-center gap-1 uppercase">
                      [TEKNISI: {item.perbaikan.teknisi.toUpperCase()}]
                      {item.perbaikan.teknisi_wa && (
                        <a
                          href={`https://wa.me/${item.perbaikan.teknisi_wa}?text=${encodeURIComponent(`Halo, saya pelapor tiket ${item.caseId}. Mohon info progress perbaikan. Terima kasih.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 hover:bg-green-500 text-white rounded-sm transition-all shadow-sm"
                          title="Hubungi Teknisi via WhatsApp"
                        >
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          WA
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <ChevronRight size={16} className="text-slate-600/30 dark:text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ReportHistory;
