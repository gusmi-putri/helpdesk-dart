import React from 'react';
import { AlertTriangle, Clock, Activity, ShieldAlert, Eye } from 'lucide-react';

interface IncomingReportsTableProps {
  reports: any[];
  onSelectReport: (id: number) => void;
  onAssignTechnician: (id: number) => void;
  onViewProof: (proof: any[]) => void;
}

const IncomingReportsTable: React.FC<IncomingReportsTableProps> = ({
  reports,
  onSelectReport,
  onAssignTechnician,
  onViewProof
}) => {
  return (
    <div className="animate-in fade-in space-y-6 mt-6">
      <div className="flex gap-4">
        <div className="bg-white dark:bg-cighra-darkcard/80 border border-cighra-primary dark:border-cighra-gold p-4 flex-1 shadow-md">
          <span className="text-slate-500 dark:text-slate-300 font-tactical text-xs tracking-wider block mb-1 uppercase">Antrean Laporan</span>
          <span className="text-cighra-primary dark:text-cighra-gold font-mono text-3xl font-bold">{reports.filter((r: any) => r.status === 'PENDING').length}</span>
        </div>
        <div className="bg-white dark:bg-cighra-darkcard/80 border border-blue-600 p-4 flex-1 shadow-md">
          <span className="text-slate-500 dark:text-slate-300 font-tactical text-xs tracking-wider block mb-1 uppercase">Sedang Diproses</span>
          <span className="text-blue-500 font-mono text-3xl font-bold">{reports.filter((r: any) => r.status === 'PROSES').length}</span>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-cighra-darkcard/70 border border-slate-300 dark:border-slate-600 rounded-sm overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-600 bg-gunmetal flex items-center justify-between text-white">
          <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" /> DAFTAR PENANGANAN KERUSAKAN</h3>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left font-sans">
            <thead className="bg-gunmetal text-slate-300/60 border-b border-slate-600 font-tactical tracking-widest text-xs">
              <tr>
                <th className="p-4">ID TIKET</th>
                <th className="p-4">PELAPOR & WAKTU</th>
                <th className="p-4">UNIT & LOKASI</th>
                <th className="p-4">PRIORITAS & JENIS</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-center">TINDAKAN</th>
              </tr>
            </thead>
            <tbody className="divide-y border-slate-200 dark:border-slate-600">
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">
                    Tidak ada antrean laporan saat ini.
                  </td>
                </tr>
              )}
              {reports.map((report: any) => (
                <tr key={report.db_id} className="hover:bg-gray-200 dark:hover:bg-slate-700/30 transition-colors text-slate-800 dark:text-white">
                  <td className="p-4">
                    <button
                      onClick={() => onSelectReport(report.db_id)}
                      className="font-mono font-bold text-sm bg-white dark:bg-cighra-darkcard px-2 py-1 border border-slate-300 dark:border-slate-600 block text-center w-fit hover:border-cighra-primary dark:border-cighra-gold hover:text-cighra-primary dark:text-cighra-gold transition-colors group/tid"
                    >
                      {report.caseId}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm">{report.kerusakan.pelapor}</div>
                    <div className="text-slate-600 dark:text-slate-300 text-xs font-mono mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {report.kerusakan.tanggal}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold mb-1">{report.unit?.nama_dart || report.kerusakan.barangRusak || 'UNIT TIDAK DIKENAL'}</div>
                    <div className="text-slate-500 dark:text-slate-300 text-[10px] font-mono uppercase">LOK: {report.kerusakan.lokasi}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 w-fit border ${report.kerusakan.urgensi === 'Sangat Mendesak' ? 'bg-red-900/20 text-red-500 border-red-800' :
                        'bg-blue-900/20 text-blue-500 border-blue-800'
                        }`}>
                        {report.kerusakan.urgensi?.toUpperCase() || 'NORMAL'}
                      </span>
                      <span className="text-xs font-bold text-gunmetal dark:text-slate-300">
                        {report.kerusakan.tingkatKerusakan || report.kerusakan.barangRusak}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    {report.status === 'PENDING' ? (
                      <span className="bg-cighra-primary/10 dark:bg-cighra-gold/10 text-cighra-primary dark:text-cighra-gold border border-cighra-primary dark:border-cighra-gold/30 text-[10px] px-2 py-1 font-mono tracking-widest flex items-center gap-1 w-fit shadow-inner">
                        <span className="w-1.5 h-1.5 rounded-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 animate-pulse block"></span> MENUNGGU TEKNISI
                      </span>
                    ) : (
                      <span className="bg-blue-900/10 text-blue-500 border border-blue-800/30 text-[10px] font-bold px-2 py-1 font-mono tracking-widest w-fit flex items-center gap-1">
                        <Activity className="w-3 h-3" /> DALAM PERBAIKAN
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    {report.status === 'PENDING' ? (
                      <div className="relative inline-block w-full">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => onAssignTechnician(report.db_id)}
                            className="w-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-3 py-2 text-[10px] font-tactical font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-cighra-primary dark:border-cighra-gold shadow-lg"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" /> TUGASKAN TEKNISI
                          </button>
                          {report.kerusakan.fileBukti && report.kerusakan.fileBukti.length > 0 && (
                            <button
                              onClick={() => onViewProof(report.kerusakan.fileBukti)}
                              className="w-full bg-white dark:bg-cighra-darkcard/80 hover:bg-cighra-light dark:hover:bg-black text-slate-600 dark:text-slate-300 px-3 py-1.5 text-[10px] font-mono font-bold tracking-widest transition-colors flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600"
                            >
                              <Eye className="w-3 h-3 text-cighra-primary dark:text-cighra-gold" /> LIHAT BUKTI
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 dark:text-slate-300 text-[10px] font-mono border border-slate-200 dark:border-slate-600 p-2 bg-cighra-light dark:bg-cighra-darkcard/80">
                        [ TEKNISI DITUGASKAN ] <br />
                        <span className="text-blue-600 dark:text-blue-400 font-bold block mt-1 text-xs uppercase">
                          {report.perbaikan.teknisi}
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncomingReportsTable;
