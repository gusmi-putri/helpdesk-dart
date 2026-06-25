import React from 'react';
import { Radar, FileArchive, AlertTriangle, Wrench, Download } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';

interface ReportsSectionProps {
  dbCases: any[];
  reportStatusFilter: 'ALL' | 'PENDING' | 'DIVERIFIKASI' | 'DITERIMA TEKNISI' | 'DIPROSES' | 'SELESAI' | 'DITOLAK';
  setReportStatusFilter: (s: 'ALL' | 'PENDING' | 'DIVERIFIKASI' | 'DITERIMA TEKNISI' | 'DIPROSES' | 'SELESAI' | 'DITOLAK') => void;
  activeSubReport: 'KERUSAKAN' | 'PERBAIKAN';
  setActiveSubReport: (s: 'KERUSAKAN' | 'PERBAIKAN') => void;
  setIsRecapModalOpen: (open: boolean) => void;
  handlePrintCasePDF: (c: any) => void;
}

const ReportsSection: React.FC<ReportsSectionProps> = ({
  dbCases,
  reportStatusFilter,
  setReportStatusFilter,
  activeSubReport,
  setActiveSubReport,
  setIsRecapModalOpen,
  handlePrintCasePDF
}) => {
  const counts = {
    PENDING: dbCases.filter((c: any) => c.status === 'PENDING').length,
    AKTIF: dbCases.filter((c: any) => ['DIVERIFIKASI', 'DITERIMA TEKNISI', 'DIPROSES'].includes(c.status)).length,
    SELESAI: dbCases.filter((c: any) => c.status === 'SELESAI').length,
    DITOLAK: dbCases.filter((c: any) => c.status === 'DITOLAK').length,
  };

  const filtered = dbCases.filter((c: any) => {
    if (reportStatusFilter === 'ALL') return true;
    return c.status === reportStatusFilter;
  });

  const { sortedItems: filteredCases, sortConfig, handleSort } = useTableSort(filtered, { key: 'caseId', direction: 'desc' });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Summary Cards (Original Tactical Style) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`bg-white dark:bg-cighra-darkcard/80 border-l-4 ${reportStatusFilter === 'PENDING' ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-200 dark:border-slate-600'} p-4 shadow-md`}>
          <p className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-300 tracking-widest uppercase mb-1">Laporan Baru</p>
          <p className={`text-2xl font-tactical font-bold ${reportStatusFilter === 'PENDING' ? 'text-cighra-primary dark:text-cighra-gold' : 'text-slate-700 dark:text-slate-300'}`}>{counts.PENDING}</p>
        </div>
        <div className={`bg-white dark:bg-cighra-darkcard/80 border-l-4 ${['DIVERIFIKASI', 'DITERIMA TEKNISI', 'DIPROSES'].includes(reportStatusFilter) ? 'border-blue-500' : 'border-slate-200 dark:border-slate-600'} p-4 shadow-md`}>
          <p className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-300 tracking-widest uppercase mb-1">Aktif / Penanganan</p>
          <p className={`text-2xl font-tactical font-bold ${['DIVERIFIKASI', 'DITERIMA TEKNISI', 'DIPROSES'].includes(reportStatusFilter) ? 'text-blue-500' : 'text-slate-700 dark:text-slate-300'}`}>{counts.AKTIF}</p>
        </div>
        <div className={`bg-white dark:bg-cighra-darkcard/80 border-l-4 ${reportStatusFilter === 'SELESAI' ? 'border-green-500' : 'border-slate-200 dark:border-slate-600'} p-4 shadow-md`}>
          <p className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-300 tracking-widest uppercase mb-1">Telah Selesai</p>
          <p className={`text-2xl font-tactical font-bold ${reportStatusFilter === 'SELESAI' ? 'text-green-500' : 'text-slate-700 dark:text-slate-300'}`}>{counts.SELESAI}</p>
        </div>
        <div className={`bg-white dark:bg-cighra-darkcard/80 border-l-4 ${reportStatusFilter === 'DITOLAK' ? 'border-red-600' : 'border-slate-200 dark:border-slate-600'} p-4 shadow-md`}>
          <p className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-300 tracking-widest uppercase mb-1">Ditolak</p>
          <p className={`text-2xl font-tactical font-bold ${reportStatusFilter === 'DITOLAK' ? 'text-red-600' : 'text-slate-700 dark:text-slate-300'}`}>{counts.DITOLAK}</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>

        {/* 2. Header Area (Row 1) */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-600 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800">
          <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
            <Radar className="text-cighra-gold w-6 h-6" /> {activeSubReport === 'KERUSAKAN' ? 'LAPORAN KERUSAKAN' : 'LAPORAN PERBAIKAN'}
          </h3>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsRecapModalOpen(true)}
              className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-4 py-2 text-xs font-tactical font-bold tracking-widest flex items-center gap-2 transition-colors border border-cighra-primary dark:border-cighra-gold shadow-lg uppercase cursor-pointer"
            >
              <FileArchive className="w-4 h-4" /> EKSPOR DATA
            </button>
          </div>
        </div>

        {/* Filter Row: Tabs & Status */}
        <div className="p-4 bg-slate-50 dark:bg-cighra-dark/30 border-b border-slate-200 dark:border-slate-600 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">JENIS LAPORAN</label>
            <div className="flex bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 p-1 shadow-sm">
              <button
                onClick={() => setActiveSubReport('KERUSAKAN')}
                className={`py-1.5 px-4 text-[10px] font-tactical tracking-widest uppercase transition-colors ${
                  activeSubReport === 'KERUSAKAN' 
                    ? 'bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                LAPORAN KERUSAKAN
              </button>
              <button
                onClick={() => setActiveSubReport('PERBAIKAN')}
                className={`py-1.5 px-4 text-[10px] font-tactical tracking-widest uppercase transition-colors ${
                  activeSubReport === 'PERBAIKAN' 
                    ? 'bg-cighra-primary dark:bg-cighra-gold text-white dark:text-slate-900' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                RIWAYAT PERBAIKAN
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">STATUS LAPORAN</label>
            <div className="flex flex-wrap items-center gap-2">
              {(['ALL', 'PENDING', 'DIVERIFIKASI', 'DITERIMA TEKNISI', 'DIPROSES', 'SELESAI', 'DITOLAK'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setReportStatusFilter(status)}
                  className={`px-3 py-1.5 text-[9px] border font-tactical font-bold tracking-widest uppercase transition-colors ${
                    reportStatusFilter === status 
                      ? 'bg-slate-800 dark:bg-slate-700 text-white dark:text-white border-slate-800 dark:border-slate-600 shadow-sm' 
                      : 'bg-white dark:bg-cighra-darkcard text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {status === 'ALL' ? 'SEMUA STATUS' : status}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* 5. Main Table (Row 4) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm break-words">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <SortableHeader label="KODE KASUS" sortKey="caseId" currentSort={sortConfig} onSort={handleSort} className="w-40" />
                {activeSubReport === 'KERUSAKAN' ? (
                  <>
                    <SortableHeader label="PELAPOR & WAKTU" />
                    <SortableHeader label="DETAIL KERUSAKAN" className="w-1/3" />
                  </>
                ) : (
                  <>
                    <SortableHeader label="TEKNISI & PENANGANAN" />
                    <SortableHeader label="TINDAKAN & WAKTU" className="w-1/3" />
                  </>
                )}
                <SortableHeader label="STATUS KASUS" sortKey="status" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="UNDUH BERKAS" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800 bg-white dark:bg-transparent">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 italic font-mono tracking-widest uppercase">
                    Tidak ada laporan dengan status {reportStatusFilter === 'ALL' ? 'apapun' : reportStatusFilter}.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c: any) => (
                  <tr key={c.caseId} className="hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors group text-slate-800 dark:text-slate-200">
                    <td className="p-4 font-mono text-slate-800 dark:text-white font-bold text-center">
                      {c.caseId}
                    </td>

                    {activeSubReport === 'KERUSAKAN' ? (
                      <>
                        <td className="p-4">
                          <div className="font-bold">{c.kerusakan.pelapor}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">{c.kerusakan.tanggal}</div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-500 mt-2 flex items-center gap-1 font-bold">
                            <AlertTriangle className="w-3 h-3" /> {c.kerusakan.lokasi}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold mb-1">{c.kerusakan.barangRusak}</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{c.kerusakan.deskripsi}</div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4">
                          {c.perbaikan.teknisi ? (
                            <>
                              <div className="font-bold flex items-center gap-2">
                                <Wrench className="w-4 h-4 text-cighra-primary dark:text-cighra-gold" /> {c.perbaikan.teknisi}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">{c.perbaikan.tanggalPenanganan || '-'}</div>
                            </>
                          ) : (
                            <span className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-700/50 text-[10px] font-tactical tracking-widest inline-block">
                              TEKNISI BELUM DITUGASKAN
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                            {c.perbaikan.tindakan || 'Belum ada tindakan.'}
                          </div>
                          <div className="flex flex-col gap-2">
                            {c.perbaikan.metodePerbaikan && (
                              <div className="text-[10px] text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-900/10 px-2 py-1 border border-green-200 dark:border-green-900/50 inline-block font-mono w-fit">
                                METODE: {c.perbaikan.metodePerbaikan}
                              </div>
                            )}
                            {c.status === 'SELESAI' && c.perbaikan.tanggalSelesai && (
                              <div className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 px-2 py-1 border border-blue-200 dark:border-blue-900/50 inline-block font-mono w-fit">
                                TUNTAS PADA: {c.perbaikan.tanggalSelesai}
                              </div>
                            )}
                          </div>
                        </td>
                      </>
                    )}

                    <td className="p-4 text-center">
                      <span className={`px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest border shadow-sm uppercase
                    ${c.status === 'SELESAI' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/40' :
                      c.status === 'DITOLAK' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/40' :
                      c.status === 'PENDING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/40 animate-pulse' :
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/40'}
                  `}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handlePrintCasePDF(c)}
                        className="bg-slate-50 dark:bg-slate-700 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:hover:text-cighra-gold border border-slate-200 dark:border-slate-600 hover:border-cighra-primary dark:border-cighra-gold p-2.5 transition-all flex items-center justify-center mx-auto group-hover:shadow-[0_0_15px_rgba(75,83,32,0.4)] relative overflow-hidden group/btn rounded-sm"
                        title="Unduh PDF Berkas Kasus (2 Halaman)"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-olive/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                        <Download className="w-5 h-5 relative z-10" />
                      </button>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;

