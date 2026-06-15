import React from 'react';
import { Radar, FileArchive, AlertTriangle, Wrench, Download } from 'lucide-react';

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

  const filteredCases = dbCases.filter((c: any) => {
    if (reportStatusFilter === 'ALL') return true;
    return c.status === reportStatusFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Summary Cards (Original Tactical Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className={`p-4 border-l-4 bg-white dark:bg-cighra-darkcard/80 shadow-md ${reportStatusFilter === 'PENDING' ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-200 dark:border-slate-600'}`}>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest">Laporan Baru</div>
          <div className="text-2xl font-tactical font-bold text-cighra-primary dark:text-cighra-gold">{counts.PENDING}</div>
        </div>
        <div className={`p-4 border-l-4 bg-white dark:bg-cighra-darkcard/80 shadow-md ${['DIVERIFIKASI', 'DITERIMA TEKNISI', 'DIPROSES'].includes(reportStatusFilter) ? 'border-blue-500' : 'border-slate-200 dark:border-slate-600'}`}>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest">Aktif / Penanganan</div>
          <div className="text-2xl font-tactical font-bold text-blue-500">{counts.AKTIF}</div>
        </div>
        <div className={`p-4 border-l-4 bg-white dark:bg-cighra-darkcard/80 shadow-md ${reportStatusFilter === 'SELESAI' ? 'border-camogreen' : 'border-slate-200 dark:border-slate-600'}`}>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest">Telah Selesai</div>
          <div className="text-2xl font-tactical font-bold text-camogreen">{counts.SELESAI}</div>
        </div>
        <div className={`p-4 border-l-4 bg-white dark:bg-cighra-darkcard/80 shadow-md ${reportStatusFilter === 'DITOLAK' ? 'border-red-600' : 'border-slate-200 dark:border-slate-600'}`}>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest">Ditolak</div>
          <div className="text-2xl font-tactical font-bold text-red-600">{counts.DITOLAK}</div>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-cighra-darkcard/70 border border-slate-200 dark:border-slate-600 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-olive via-camogreen to-transparent"></div>

        {/* 2. Header Area (Row 1) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-800 border-b border-slate-700 p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-tactical font-bold text-white tracking-widest flex items-center gap-3">
              <Radar className="text-cighra-gold w-8 h-8 animate-spin-slow" />
              {activeSubReport === 'KERUSAKAN' ? 'LAPORAN KERUSAKAN' : 'LAPORAN PERBAIKAN'}
            </h2>
            <p className="text-slate-300 font-mono text-xs mt-2 tracking-widest uppercase">
              {activeSubReport === 'KERUSAKAN'
                ? 'Daftar pelaporan kerusakan perangkat yang diajukan oleh pengguna.'
                : 'Progres penanganan dan status teknisi pada setiap laporan.'}
            </p>
          </div>
          <div className="relative z-10 mt-4 md:mt-0">
            <button
              onClick={() => setIsRecapModalOpen(true)}
              className="bg-cighra-gold text-slate-900 px-5 py-2 font-tactical font-bold text-xs tracking-widest hover:bg-cighra-gold/90 transition-all flex items-center gap-2 shadow-lg uppercase"
            >
              <FileArchive className="w-4 h-4" /> EKSPOR DATA
            </button>
          </div>
        </div>

        {/* 3. Sub-Report Tabs (Row 2) */}
        <div className="px-6 pt-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-cighra-darkcard flex gap-6">
          <button
            onClick={() => setActiveSubReport('KERUSAKAN')}
            className={`py-3 px-2 text-xs font-tactical tracking-widest uppercase transition-all border-b-2 ${
              activeSubReport === 'KERUSAKAN' 
                ? 'text-cighra-primary dark:text-cighra-gold border-cighra-primary dark:border-cighra-gold font-bold' 
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Laporan Kerusakan
          </button>
          <button
            onClick={() => setActiveSubReport('PERBAIKAN')}
            className={`py-3 px-2 text-xs font-tactical tracking-widest uppercase transition-all border-b-2 ${
              activeSubReport === 'PERBAIKAN' 
                ? 'text-cighra-primary dark:text-cighra-gold border-cighra-primary dark:border-cighra-gold font-bold' 
                : 'text-slate-500 border-transparent hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Riwayat Perbaikan
          </button>
        </div>

        {/* 4. Status Filters (Row 3) */}
        <div className="p-4 px-6 bg-white dark:bg-transparent border-b border-slate-200 dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'PENDING', 'DIVERIFIKASI', 'DITERIMA TEKNISI', 'DIPROSES', 'SELESAI', 'DITOLAK'] as const).map(status => (
              <button
                key={status}
                onClick={() => setReportStatusFilter(status)}
                className={`px-4 py-2 rounded border text-[10px] font-tactical font-bold tracking-widest uppercase transition-all ${
                  reportStatusFilter === status 
                    ? 'bg-slate-800 dark:bg-cighra-gold text-white dark:text-slate-900 shadow-md border-slate-800 dark:border-cighra-gold' 
                    : 'bg-transparent text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                {status === 'ALL' ? 'SEMUA' : status}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Main Table (Row 4) */}
        <div className="overflow-x-auto p-4">
          <table className="w-full text-left font-sans text-sm break-words">
            <thead className="bg-slate-800 text-slate-100 font-tactical tracking-widest border-b border-slate-700">
              <tr>
                <th className="p-4 w-40">KODE KASUS</th>
                {activeSubReport === 'KERUSAKAN' ? (
                  <>
                    <th className="p-4">PELAPOR & WAKTU LAPOR</th>
                    <th className="p-4 w-1/3">DETAIL KERUSAKAN</th>
                  </>
                ) : (
                  <>
                    <th className="p-4">TEKNISI & WAKTU PENANGANAN</th>
                    <th className="p-4 w-1/3">TINDAKAN & WAKTU SELESAI</th>
                  </>
                )}
                <th className="p-4">STATUS KASUS</th>
                <th className="p-4 text-center">PDF</th>
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
                    <td className="p-4 font-mono text-cighra-primary dark:text-cighra-gold font-bold border-l-2 border-transparent group-hover:border-cighra-primary dark:border-cighra-gold">
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

                    <td className="p-4">
                      <span className={`px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest border shadow-sm uppercase
                    ${c.status === 'SELESAI' ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-500 border-green-200 dark:border-green-800' :
                      c.status === 'DITOLAK' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-500 border-red-200 dark:border-red-800' :
                      c.status === 'PENDING' ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border-yellow-200 dark:border-yellow-800 animate-pulse' :
                        'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 border-blue-200 dark:border-blue-800'}
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
