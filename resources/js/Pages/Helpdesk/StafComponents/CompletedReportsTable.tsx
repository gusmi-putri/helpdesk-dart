import React from 'react';
import { CheckCircle } from 'lucide-react';

interface CompletedReportsTableProps {
  reports: any[];
  onSelectReport: (id: number) => void;
}

const CompletedReportsTable: React.FC<CompletedReportsTableProps> = ({
  reports,
  onSelectReport
}) => {
  return (
    <div className="animate-in fade-in space-y-6 mt-6">
      <div className="bg-white/60 dark:bg-black/60 border border-soft-gunmetal/20 dark:border-soft-sand/10 rounded-sm overflow-hidden shadow-xl">
        <div className="p-4 border-b border-soft-gunmetal/10 dark:border-soft-sand/5 bg-sand/20 dark:bg-black/40 flex items-center justify-between text-gunmetal dark:text-white">
          <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-camogreen" /> ARSIP PERBAIKAN SELESAI </h3>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left font-sans">
            <thead className="bg-gunmetal text-soft-sand/60 border-b border-soft-sand/10 font-tactical tracking-widest text-xs">
              <tr>
                <th className="p-4 w-32">ID TIKET</th>
                <th className="p-4">DETAIL KERUSAKAN</th>
                <th className="p-4">TEKNISI PELAKSANA</th>
                <th className="p-4">CATATAN PERBAIKAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-soft-gunmetal/10 dark:divide-soft-sand/5 text-gunmetal dark:text-white">
              {reports.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-soft-gunmetal/40 dark:text-soft-sand/20 font-mono uppercase tracking-widest">
                    Belum ada data arsip perbaikan.
                  </td>
                </tr>
              )}
              {reports.map((report: any) => (
                <tr key={report.db_id} className="hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <button
                      onClick={() => onSelectReport(report.db_id)}
                      className="font-mono text-soft-gunmetal/70 dark:text-soft-sand/60 text-sm bg-white dark:bg-black px-2 py-1 border border-soft-gunmetal/20 dark:border-soft-sand/10 block w-fit hover:border-olive hover:text-olive transition-colors"
                    >
                      {report.caseId}
                    </button>
                    <div className="mt-2 text-camogreen text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> TUNTAS
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm mb-1 uppercase">{report.kerusakan.barangRusak}</div>
                    <div className="text-soft-gunmetal/70 dark:text-soft-sand/60 text-xs font-mono w-full max-w-sm uppercase">
                      Masuk: {report.kerusakan.tanggal} <br />
                      Selesai: <span className="text-gunmetal dark:text-white font-bold">{report.perbaikan.tanggalSelesai || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold uppercase">
                      {report.perbaikan.teknisi}
                    </div>
                    <div className="text-soft-gunmetal/50 dark:text-soft-sand/30 text-[10px] font-mono mt-1 uppercase">
                      KODE OP: {report.db_id}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="bg-white/40 dark:bg-black/30 p-4 border-l-4 border-camogreen text-sm text-gunmetal dark:text-soft-sand relative shadow-inner">
                      <span className="absolute top-1 left-2 text-xl text-soft-gunmetal/20 dark:text-soft-sand/10 font-serif">"</span>
                      <span className="pl-4 block italic font-serif leading-relaxed uppercase mb-3">{report.perbaikan.tindakan}</span>
                      {report.perbaikan.metodePerbaikan && (
                        <div className="ml-4 text-[10px] text-camogreen bg-camogreen/10 px-2 py-1 border border-camogreen/30 inline-block font-mono uppercase">
                          METODE: {report.perbaikan.metodePerbaikan}
                        </div>
                      )}
                    </div>
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

export default CompletedReportsTable;
