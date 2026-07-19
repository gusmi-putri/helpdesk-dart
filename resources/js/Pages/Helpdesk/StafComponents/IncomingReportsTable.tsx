import React from 'react';
import { AlertTriangle, Clock, Activity, ShieldAlert, Eye, XCircle, CheckCircle, Wallet, Inbox } from 'lucide-react';
import { EmptyState } from '@/Components/ui/EmptyState';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';

interface IncomingReportsTableProps {
  reports: any[];
  onSelectReport: (id: number) => void;
  onAssignTechnician: (id: number) => void;
  onViewProof: (proofData: { report: any; type: 'rusak' | 'selesai' }) => void;
  onVerify: (id: number) => void;
  onReject: (id: number) => void;
}

const IncomingReportsTable: React.FC<IncomingReportsTableProps> = ({
  reports,
  onSelectReport,
  onAssignTechnician,
  onViewProof,
  onVerify,
  onReject
}) => {
  const pendingCount = reports.filter((r: any) => r.status === 'PENDING').length;
  const activeCount = reports.filter((r: any) => r.status !== 'PENDING').length;

  const { sortedItems: sortedReports, sortConfig, handleSort } = useTableSort(reports, { key: 'caseId', direction: 'desc' });

  return (
    <div className="animate-in fade-in space-y-6 mt-6">
      <div className="flex gap-4">
        <div className="bg-white dark:bg-cighra-darkcard/80 border border-cighra-primary dark:border-cighra-gold p-4 flex-1 shadow-md">
          <span className="text-slate-500 dark:text-slate-300 font-tactical text-xs tracking-wider block mb-1 uppercase">Menunggu Verifikasi</span>
          <span className="text-cighra-primary dark:text-cighra-gold font-mono text-3xl font-bold">{pendingCount}</span>
        </div>
        <div className="bg-white dark:bg-cighra-darkcard/80 border border-blue-600 p-4 flex-1 shadow-md">
          <span className="text-slate-500 dark:text-slate-300 font-tactical text-xs tracking-wider block mb-1 uppercase">Aktif / Penanganan</span>
          <span className="text-blue-500 font-mono text-3xl font-bold">{activeCount}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-cighra-darkcard/70 border border-slate-200 dark:border-slate-600 rounded-sm overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 bg-cighra-primary dark:bg-slate-800 flex items-center justify-between text-white">
          <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" /> Daftar Penanganan Kerusakan</h3>
        </div>
        <div className="overflow-x-auto p-2 custom-scrollbar pb-4">
          <table className="w-full text-left font-sans">
            <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white">
              <tr>
                <SortableHeader label="ID TIKET" sortKey="caseId" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="PELAPOR & WAKTU" />
                <SortableHeader label="PRIORITAS & JENIS" />
                <SortableHeader label="STATUS" sortKey="status" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="KETERANGAN & LOKASI" />
                <SortableHeader label="TINDAKAN" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent">
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8">
                    <EmptyState 
                      icon={<Inbox className="w-16 h-16 opacity-50" />}
                      title="Tidak Ada Antrean Laporan"
                      description="Saat ini tidak ada laporan kerusakan baru yang perlu diverifikasi atau ditangani."
                    />
                  </td>
                </tr>
              )}
              {sortedReports.map((report: any) => {
                return (
                  <tr key={report.db_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-slate-800 dark:text-white">
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onSelectReport(report.db_id)}
                        className="font-mono font-bold text-sm bg-white dark:bg-cighra-darkcard px-2 py-1 border border-slate-300 dark:border-slate-600 block text-center w-fit hover:border-cighra-primary dark:border-cighra-gold hover:text-cighra-primary dark:text-cighra-gold transition-colors group/tid"
                      >
                        {report.caseId}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <div className="font-bold text-sm text-slate-800 dark:text-white">{report.kerusakan.pelapor}</div>
                      <div className="text-slate-500 dark:text-slate-300 text-xs font-mono mt-1 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" /> {report.kerusakan.tanggal}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 w-fit border shadow-sm uppercase ${
                          report.kerusakan.urgensi === 'Sangat Mendesak'
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 border-red-200 dark:border-red-800'
                            : report.kerusakan.urgensi === 'Bisa Menunggu'
                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-800'
                            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 border-green-200 dark:border-green-800'
                        }`}>
                          {report.kerusakan.urgensi?.toUpperCase() || 'NORMAL'}
                        </span>
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 w-fit border shadow-sm uppercase ${
                          ['PARAH', 'BERAT'].includes(report.kerusakan.tingkatKerusakan?.toUpperCase() || '')
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 border-red-200 dark:border-red-800'
                            : report.kerusakan.tingkatKerusakan?.toUpperCase() === 'SEDANG'
                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500 border-amber-200 dark:border-amber-800'
                            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 border-green-200 dark:border-green-800'
                        }`}>
                          LEVEL: {report.kerusakan.tingkatKerusakan?.toUpperCase() || 'UMUM'}
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {report.kerusakan.barangRusak}
                        </span>
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 w-fit border shadow-sm uppercase ${
                          report.kerusakan.jenisPerbaikan === 'Non-Swadaya'
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                        }`}>
                          <Wallet className="inline w-3 h-3 mr-1" /> {report.kerusakan.jenisPerbaikan || 'Swadaya'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {report.status === 'PENDING' && (
                        <span className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-800/30 text-xs font-bold px-2 py-1 font-mono tracking-widest w-fit flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse block"></span> PENDING (VERIFIKASI)
                        </span>
                      )}
                      {report.status === 'DIVERIFIKASI' && (
                        <span className="bg-yellow-50 dark:bg-yellow-900/10 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-800/30 text-xs font-bold px-2 py-1 font-mono tracking-widest w-fit flex items-center gap-1 shadow-sm">
                          <Clock className="w-3 h-3 text-yellow-500" /> {report.perbaikan.teknisi ? 'MENUNGGU TEKNISI' : 'DIVERIFIKASI'}
                        </span>
                      )}
                      {report.status === 'DITERIMA TEKNISI' && (
                        <span className="bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-500 border border-purple-200 dark:border-purple-800/30 text-xs font-bold px-2 py-1 font-mono tracking-widest w-fit flex items-center gap-1 shadow-sm">
                          <Activity className="w-3 h-3 text-purple-500" /> TUGAS DITERIMA
                        </span>
                      )}
                      {report.status === 'DIPROSES' && (
                        <span className="bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-500 border border-blue-200 dark:border-blue-800/30 text-xs font-bold px-2 py-1 font-mono tracking-widest w-fit flex items-center gap-1 shadow-sm">
                          <Activity className="w-3 h-3" /> SEDANG DIPROSES
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <div className="font-bold mb-1 text-slate-800 dark:text-white flex items-center justify-center gap-2">
                        {report.unit?.nomor_seri || report.kerusakan.barangRusak || 'Unit Tidak Dikenal'}
                        {report.kerusakan.pelapor_satuan_id && report.kerusakan.unit_satuan_id && report.kerusakan.pelapor_satuan_id !== report.kerusakan.unit_satuan_id && (
                          <span className="bg-orange-500/10 text-orange-500 border border-orange-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">LINTAS SATUAN</span>
                        )}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-xs font-mono uppercase">LOK: {report.kerusakan.lokasi}</div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex flex-col gap-2 max-w-[200px] mx-auto">
                        {report.status === 'PENDING' && (
                          <>
                            <div className="flex gap-2">
                              <button
                                onClick={() => onVerify(report.db_id)}
                                className="flex-1 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-2.5 py-1.5 text-[11px] font-tactical font-bold tracking-wider transition-colors flex items-center justify-center gap-1 border border-cighra-primary dark:border-cighra-gold"
                              >
                                <CheckCircle className="w-3 h-3" /> Setujui
                              </button>
                              <button
                                onClick={() => onReject(report.db_id)}
                                className="flex-1 bg-red-600 hover:bg-red-500 text-white px-2.5 py-1.5 text-[11px] font-tactical font-bold tracking-wider transition-colors flex items-center justify-center gap-1 border border-red-600"
                              >
                                <XCircle className="w-3 h-3" /> Tolak
                              </button>
                            </div>
                            {(report.kerusakan.foto_bukti || (report.kerusakan.fileBukti && report.kerusakan.fileBukti.length > 0) || report.kerusakan.tautan_video) && (
                              <button
                                onClick={() => onViewProof({ report, type: 'rusak' })}
                                className="w-full bg-white dark:bg-cighra-darkcard/80 hover:bg-slate-50 dark:hover:bg-black text-slate-600 dark:text-slate-300 px-3 py-1.5 text-xs font-mono font-bold tracking-widest transition-colors flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600"
                              >
                                <Eye className="w-3 h-3 text-cighra-primary dark:text-cighra-gold" /> Lihat Bukti
                              </button>
                            )}
                          </>
                        )}

                        {report.status === 'DIVERIFIKASI' && (
                          <>
                            <button
                              onClick={() => onAssignTechnician(report.db_id)}
                              className="w-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-3 py-2 text-xs font-tactical font-bold tracking-[0.15em] transition-all flex items-center justify-center gap-2 border border-cighra-primary dark:border-cighra-gold shadow-lg"
                            >
                              <ShieldAlert className="w-3.5 h-3.5" /> {report.perbaikan?.teknisi ? 'Ganti Teknisi' : 'Tugaskan Teknisi'}
                            </button>
                            <button
                              onClick={() => onReject(report.db_id)}
                              className="w-full bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 text-xs font-tactical font-bold tracking-widest transition-colors flex items-center justify-center gap-2 border border-red-600"
                            >
                              <XCircle className="w-3 h-3" /> Tolak Laporan
                            </button>
                          </>
                        )}

                        {(report.status === 'DITERIMA TEKNISI' || report.status === 'DIPROSES') && (
                          <div className="text-slate-500 dark:text-slate-300 text-xs font-mono border border-slate-200 dark:border-slate-600 p-2 bg-slate-50 dark:bg-cighra-darkcard/80 rounded-sm">
                            <span className="text-[11px] text-slate-400 dark:text-slate-300 block mb-1">Teknisi Ditugaskan:</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold block text-xs">
                              {report.perbaikan.teknisi || 'Unknown'}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IncomingReportsTable;

