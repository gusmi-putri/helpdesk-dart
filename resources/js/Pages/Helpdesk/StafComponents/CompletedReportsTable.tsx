import React from 'react';
import { CheckCircle, Image, CheckSquare, XCircle } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';

interface CompletedReportsTableProps {
  reports: any[];
  onSelectReport: (id: number) => void;
  onViewProof: (proof: any[]) => void;
}

const CompletedReportsTable: React.FC<CompletedReportsTableProps> = ({
  reports,
  onSelectReport,
  onViewProof
}) => {
  const { sortedItems: sortedReports, sortConfig, handleSort } = useTableSort(reports, { key: 'caseId', direction: 'desc' });

  return (
    <div className="animate-in fade-in space-y-6 mt-6">
      <div className="bg-white/60 dark:bg-cighra-darkcard/70 border border-slate-300 dark:border-slate-600 rounded-sm overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-200 dark:border-slate-600 bg-cighra-light dark:bg-cighra-darkcard/80 flex items-center justify-between text-slate-800 dark:text-white">
          <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-camogreen" /> ARSIP PERBAIKAN SELESAI </h3>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left font-sans">
            <thead className="bg-slate-800 border-b border-slate-600">
              <tr>
                <SortableHeader label="ID TIKET" sortKey="caseId" currentSort={sortConfig} onSort={handleSort} className="w-32" />
                <SortableHeader label="DETAIL KERUSAKAN" />
                <SortableHeader label="TEKNISI PELAKSANA" />
                <SortableHeader label="CATATAN PERBAIKAN" />
                <SortableHeader label="DOKUMENTASI" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-soft-sand/5 bg-white dark:bg-transparent text-slate-800 dark:text-white">
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">
                    Belum ada data arsip perbaikan.
                  </td>
                </tr>
              )}
              {sortedReports.map((report: any) => (
                <tr key={report.db_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 text-center">
                    <button
                      onClick={() => onSelectReport(report.db_id)}
                      className="font-mono text-slate-800 dark:text-slate-300 text-sm bg-white dark:bg-cighra-darkcard px-2 py-1 border border-slate-300 dark:border-slate-600 block w-fit mx-auto hover:border-cighra-primary dark:hover:border-cighra-gold hover:text-cighra-primary dark:hover:text-cighra-gold transition-colors font-bold"
                    >
                      {report.caseId}
                    </button>
                    {report.status === 'SELESAI' ? (
                      <div className="mt-2 text-white dark:text-green-400 text-[10px] font-mono font-bold flex justify-center items-center gap-1 bg-camogreen dark:bg-camogreen/20 px-1.5 py-0.5 border border-camogreen dark:border-camogreen/30 w-fit mx-auto">
                        <CheckCircle className="w-3 h-3" /> TUNTAS
                      </div>
                    ) : (
                      <div className="mt-2 text-red-600 text-[10px] font-mono font-bold flex justify-center items-center gap-1 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 border border-red-200 dark:border-red-900/30 w-fit mx-auto">
                        <XCircle className="w-3 h-3" /> DITOLAK
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="font-bold text-sm mb-1 uppercase text-slate-800 dark:text-white">{report.kerusakan.barangRusak}</div>
                    <div className="text-slate-500 dark:text-slate-300 text-xs font-mono w-full max-w-sm uppercase mx-auto">
                      Masuk: {report.kerusakan.tanggal} <br />
                      Selesai: <span className="text-slate-800 dark:text-white font-bold">{report.perbaikan.tanggalSelesai || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-sm font-bold uppercase text-slate-800 dark:text-white">
                      {report.perbaikan.teknisi}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] font-mono mt-1 uppercase">
                      KODE OP: {report.db_id}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {report.status === 'DITOLAK' ? (
                      <div className="bg-red-50 dark:bg-red-950/20 p-4 border-l-4 border-red-600 text-sm text-slate-600 dark:text-slate-300 shadow-sm">
                        <span className="font-bold text-red-600 dark:text-red-500 block mb-1 uppercase text-xs">Alasan Penolakan:</span>
                        <p className="font-mono text-xs uppercase italic">"{report.perbaikan.alasanPenolakan || 'Tidak ada alasan penolakan yang ditulis.'}"</p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 dark:bg-cighra-darkcard/30 p-4 border-l-4 border-camogreen text-sm text-slate-600 dark:text-slate-300 relative shadow-sm">
                        <span className="absolute top-1 left-2 text-xl text-slate-300/50 dark:text-slate-300/10 font-serif">"</span>
                        <span className="pl-4 block italic font-serif leading-relaxed uppercase mb-3">{report.perbaikan.tindakan || 'Tidak ada catatan.'}</span>
                        {report.perbaikan.metodePerbaikan && (
                          <div className="ml-4 text-[10px] text-white dark:text-green-400 bg-camogreen dark:bg-camogreen/20 px-2 py-1 border border-camogreen dark:border-camogreen/30 inline-block font-mono uppercase">
                            METODE: {report.perbaikan.metodePerbaikan}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col gap-2 items-center justify-center">
                      {report.kerusakan.fileBukti && report.kerusakan.fileBukti.length > 0 && (
                        <button
                          onClick={() => onViewProof(report.kerusakan.fileBukti)}
                          className="w-full max-w-[140px] bg-white dark:bg-cighra-darkcard/80 hover:bg-slate-50 dark:hover:bg-black text-slate-600 dark:text-slate-300 px-2 py-1.5 text-[10px] font-mono font-bold tracking-widest transition-colors flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-600 shadow-sm"
                        >
                          <Image className="w-3 h-3 text-red-500" /> BUKTI RUSAK
                        </button>
                      )}
                      {report.perbaikan.foto_bukti_selesai && (
                        <button
                          onClick={() => onViewProof([report.perbaikan.foto_bukti_selesai])}
                          className="w-full max-w-[140px] bg-white dark:bg-cighra-darkcard/80 hover:bg-slate-50 dark:hover:bg-black text-slate-600 dark:text-slate-300 px-2 py-1.5 text-[10px] font-mono font-bold tracking-widest transition-colors flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-600 shadow-sm"
                        >
                          <CheckSquare className="w-3 h-3 text-camogreen" /> FOTO SELESAI
                        </button>
                      )}
                      {report.perbaikan.video_bukti_selesai && (
                        <button
                          onClick={() => onViewProof([report.perbaikan.video_bukti_selesai])}
                          className="w-full max-w-[140px] bg-white dark:bg-cighra-darkcard/80 hover:bg-slate-50 dark:hover:bg-black text-slate-600 dark:text-slate-300 px-2 py-1.5 text-[10px] font-mono font-bold tracking-widest transition-colors flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-600 shadow-sm"
                        >
                          <CheckSquare className="w-3 h-3 text-blue-500" /> VIDEO SELESAI
                        </button>
                      )}
                      {(!report.kerusakan.fileBukti || report.kerusakan.fileBukti.length === 0) && !report.perbaikan.foto_bukti_selesai && !report.perbaikan.video_bukti_selesai && (
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-400">TIDAK ADA FOTO/VIDEO</span>
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
