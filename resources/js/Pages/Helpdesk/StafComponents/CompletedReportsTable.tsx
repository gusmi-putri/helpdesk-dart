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
                <tr 
                  key={report.db_id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                  onClick={() => onSelectReport(report.db_id)}
                >
                  <td className="p-4 text-center">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {report.caseId}
                    </div>
                    {report.status === 'SELESAI' ? (
                      <div className="mt-1.5 text-[10px] font-medium text-camogreen dark:text-green-400 flex justify-center items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Tuntas
                      </div>
                    ) : (
                      <div className="mt-1.5 text-[10px] font-medium text-red-600 dark:text-red-400 flex justify-center items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Ditolak
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="font-medium text-sm text-slate-900 dark:text-white mb-1">{report.kerusakan.barangRusak}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs flex flex-col gap-0.5">
                      <span>Masuk: {report.kerusakan.tanggal}</span>
                      <span>Selesai: {report.perbaikan.tanggalSelesai || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="font-medium text-sm text-slate-900 dark:text-white">
                      {report.perbaikan.teknisi}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                      Kode OP: {report.db_id}
                    </div>
                  </td>
                  <td className="p-4 text-center max-w-sm">
                    {report.status === 'DITOLAK' ? (
                      <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-md p-3 text-left">
                        <span className="font-medium block mb-1">Alasan Penolakan:</span>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{report.perbaikan.alasanPenolakan || 'Tidak ada alasan penolakan.'}</p>
                      </div>
                    ) : (
                      <div className="text-sm text-left">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                          {report.perbaikan.tindakan || 'Tidak ada catatan.'}
                        </p>
                        {report.perbaikan.metodePerbaikan && (
                          <span className="text-[10px] font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                            Metode: {report.perbaikan.metodePerbaikan}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col gap-2 items-center justify-center">
                      {report.kerusakan.fileBukti && report.kerusakan.fileBukti.length > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onViewProof(report.kerusakan.fileBukti); }}
                          className="w-full max-w-[140px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                        >
                          <Image className="w-3.5 h-3.5 text-slate-500" /> Bukti Rusak
                        </button>
                      )}
                      {report.perbaikan.foto_bukti_selesai && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onViewProof([report.perbaikan.foto_bukti_selesai]); }}
                          className="w-full max-w-[140px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-camogreen" /> Foto Selesai
                        </button>
                      )}
                      {report.perbaikan.video_bukti_selesai && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onViewProof([report.perbaikan.video_bukti_selesai]); }}
                          className="w-full max-w-[140px] px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> Video Selesai
                        </button>
                      )}
                      {(!report.kerusakan.fileBukti || report.kerusakan.fileBukti.length === 0) && !report.perbaikan.foto_bukti_selesai && !report.perbaikan.video_bukti_selesai && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">Tidak ada media</span>
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

