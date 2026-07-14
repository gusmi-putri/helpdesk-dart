import React from 'react';
import { CheckCircle, Image, CheckSquare, XCircle } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';
import { EmptyState } from '@/Components/ui/EmptyState';
import { Button } from '@/Components/ui/Button';

interface CompletedReportsTableProps {
  reports: any[];
  onSelectReport: (id: number) => void;
  onViewProof: (proofData: { report: any; type: 'rusak' | 'selesai' }) => void;
}

const CompletedReportsTable: React.FC<CompletedReportsTableProps> = ({
  reports,
  onSelectReport,
  onViewProof
}) => {
  const { sortedItems: sortedReports, sortConfig, handleSort } = useTableSort(reports, { key: 'caseId', direction: 'desc' });

  return (
    <div className="animate-in fade-in space-y-6 mt-6">
      <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>
        <div className="p-5 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-cighra-primary dark:bg-slate-800">
          <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
            <CheckCircle className="text-cighra-gold w-6 h-6" /> ARSIP PERBAIKAN SELESAI
          </h3>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left font-sans">
            <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white">
              <tr>
                <SortableHeader label="ID TIKET" sortKey="caseId" currentSort={sortConfig} onSort={handleSort} className="w-32" />
                <SortableHeader label="DETAIL KERUSAKAN" />
                <SortableHeader label="TEKNISI PELAKSANA" />
                <SortableHeader label="CATATAN PERBAIKAN" />
                <SortableHeader label="DOKUMENTASI" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent text-slate-800 dark:text-white">
              {reports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-0 text-center">
                    <EmptyState title="TIDAK ADA ARSIP" description="Belum ada data arsip perbaikan yang selesai atau ditolak." />
                  </td>
                </tr>
              )}
              {sortedReports.map((report: any) => (
                <tr
                  key={report.db_id}
                  className="hover:bg-blue-100/50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                  onClick={() => onSelectReport(report.db_id)}
                >
                  <td className="p-4 text-center">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {report.caseId}
                    </div>
                    {report.status === 'SELESAI' ? (
                      <div className="mt-1.5 text-xs font-medium text-camogreen dark:text-green-400 flex justify-center items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Tuntas
                      </div>
                    ) : (
                      <div className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400 flex justify-center items-center gap-1">
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
                      <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-none p-3 text-left">
                        <span className="font-medium block mb-1">Alasan Penolakan:</span>
                        <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">{report.perbaikan.alasanPenolakan || 'Tidak ada alasan penolakan.'}</p>
                      </div>
                    ) : (
                      <div className="text-sm text-left">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2">
                          {report.perbaikan.tindakan || 'Tidak ada catatan.'}
                        </p>
                        {report.perbaikan.metodePerbaikan && (
                          <span className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md">
                            Metode: {report.perbaikan.metodePerbaikan}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col gap-2 items-center justify-center">
                      {(report.kerusakan.foto_bukti || (report.kerusakan.fileBukti && report.kerusakan.fileBukti.length > 0) || report.kerusakan.tautan_video) && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); onViewProof({ report, type: 'rusak' }); }}
                          className="w-full max-w-[140px] text-xs"
                        >
                          <Image className="w-3.5 h-3.5 text-slate-500" /> Bukti Rusak
                        </Button>
                      )}
                      {(report.perbaikan.foto_bukti_selesai || report.perbaikan.video_bukti_selesai) && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); onViewProof({ report, type: 'selesai' }); }}
                          className="w-full max-w-[140px] text-xs"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-camogreen" /> Bukti Selesai
                        </Button>
                      )}
                      {!(report.kerusakan.foto_bukti || (report.kerusakan.fileBukti && report.kerusakan.fileBukti.length > 0) || report.kerusakan.tautan_video) && !report.perbaikan.foto_bukti_selesai && !report.perbaikan.video_bukti_selesai && (
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

