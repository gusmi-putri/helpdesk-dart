import React from 'react';
import { Radar, FileArchive, AlertTriangle, Wrench, Download } from 'lucide-react';

interface ReportsSectionProps {
  dbCases: any[];
  reportStatusFilter: 'ALL' | 'PENDING' | 'PROSES' | 'SELESAI';
  setReportStatusFilter: (s: 'ALL' | 'PENDING' | 'PROSES' | 'SELESAI') => void;
  activeSubReport: 'KERUSAKAN' | 'PERBAIKAN';
  setIsRecapModalOpen: (open: boolean) => void;
  handlePrintCasePDF: (c: any) => void;
}

const ReportsSection: React.FC<ReportsSectionProps> = ({
  dbCases,
  reportStatusFilter,
  setReportStatusFilter,
  activeSubReport,
  setIsRecapModalOpen,
  handlePrintCasePDF
}) => {
  const counts = {
    PENDING: dbCases.filter((c: any) => c.status === 'PENDING').length,
    PROSES: dbCases.filter((c: any) => c.status === 'PROSES').length,
    SELESAI: dbCases.filter((c: any) => c.status === 'SELESAI').length,
  };

  const filteredCases = dbCases.filter((c: any) => {
    if (reportStatusFilter === 'ALL') return true;
    return c.status === reportStatusFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 border-l-4 bg-white dark:bg-cighra-darkcard/80 shadow-md ${reportStatusFilter === 'PENDING' ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-200 dark:border-slate-600'}`}>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest">Laporan Baru</div>
          <div className="text-2xl font-tactical font-bold text-cighra-primary dark:text-cighra-gold">{counts.PENDING}</div>
        </div>
        <div className={`p-4 border-l-4 bg-white dark:bg-cighra-darkcard/80 shadow-md ${reportStatusFilter === 'PROSES' ? 'border-blue-500' : 'border-slate-200 dark:border-slate-600'}`}>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest">Sedang Diproses</div>
          <div className="text-2xl font-tactical font-bold text-blue-500">{counts.PROSES}</div>
        </div>
        <div className={`p-4 border-l-4 bg-white dark:bg-cighra-darkcard/80 shadow-md ${reportStatusFilter === 'SELESAI' ? 'border-camogreen' : 'border-slate-200 dark:border-slate-600'}`}>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-300 uppercase tracking-widest">Telah Selesai</div>
          <div className="text-2xl font-tactical font-bold text-camogreen">{counts.SELESAI}</div>
        </div>
      </div>

      {/* Header Laporan */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-sand/50 dark:from-gunmetal to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-tactical font-bold text-slate-800 dark:text-white tracking-widest flex items-center gap-3">
            <Radar className="text-cighra-primary dark:text-cighra-gold w-8 h-8 animate-spin-slow" />
            {activeSubReport === 'KERUSAKAN' ? 'LAPORAN KERUSAKAN' : 'LAPORAN PERBAIKAN'}
          </h2>
          <p className="text-slate-500 dark:text-slate-300 font-mono text-xs mt-2 tracking-widest uppercase">
            {activeSubReport === 'KERUSAKAN'
              ? 'Daftar pelaporan kerusakan perangkat yang diajukan oleh pengguna.'
              : 'Progres penanganan dan status teknisi pada setiap laporan.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            onClick={() => setIsRecapModalOpen(true)}
            className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white px-5 py-2 font-tactical font-bold text-xs tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-all flex items-center gap-2 shadow-lg uppercase"
          >
            <FileArchive className="w-4 h-4" /> EKSPOR DATA
          </button>
          <div className="flex items-center gap-2 bg-cighra-light dark:bg-cighra-darkcard p-1 border border-slate-200 dark:border-slate-600">
            {(['ALL', 'PENDING', 'PROSES', 'SELESAI'] as const).map(status => (
              <button
                key={status}
                onClick={() => setReportStatusFilter(status)}
                className={`px-3 py-1.5 text-[9px] font-tactical font-bold transition-all ${reportStatusFilter === status ? 'bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white shadow-lg' : 'text-slate-500 dark:text-slate-300 hover:text-gunmetal dark:hover:text-slate-300 hover:bg-white dark:hover:bg-cighra-darkcard/50'}`}
              >
                {status === 'ALL' ? 'SEMUA' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Relational Table */}
      <div className="bg-white/60 dark:bg-cighra-darkcard/70 border border-slate-200 dark:border-slate-600 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-olive via-camogreen to-transparent"></div>

        <div className="overflow-x-auto p-2">
          <table className="w-full text-left font-sans text-sm break-words">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-tactical tracking-widest border-b border-slate-200 dark:border-slate-600/50">
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
            <tbody className="divide-y divide-gray-300 dark:divide-gray-800">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 italic font-mono tracking-widest uppercase">
                    Tidak ada laporan dengan status {reportStatusFilter === 'ALL' ? 'apapun' : reportStatusFilter}.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c: any) => (
                  <tr key={c.caseId} className="hover:bg-gray-200 dark:hover:bg-slate-700/60 transition-colors group text-slate-800 dark:text-slate-200">
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
                          <div className="text-xs text-gray-700 dark:text-slate-400 leading-relaxed">{c.kerusakan.deskripsi}</div>
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
                            <span className="px-3 py-1 bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 border border-yellow-700/50 text-[10px] font-tactical tracking-widest inline-block">
                              TEKNISI BELUM DITUGASKAN
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="text-xs leading-relaxed mb-3">
                            {c.perbaikan.tindakan || 'Belum ada tindakan.'}
                          </div>
                          <div className="flex flex-col gap-2">
                            {c.perbaikan.metodePerbaikan && (
                              <div className="text-[10px] text-green-600 dark:text-green-500 bg-green-900/10 px-2 py-1 border border-green-900/50 inline-block font-mono w-fit">
                                METODE: {c.perbaikan.metodePerbaikan}
                              </div>
                            )}
                            {c.status === 'SELESAI' && c.perbaikan.tanggalSelesai && (
                              <div className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-900/10 px-2 py-1 border border-blue-900/50 inline-block font-mono w-fit">
                                TUNTAS PADA: {c.perbaikan.tanggalSelesai}
                              </div>
                            )}
                          </div>
                        </td>
                      </>
                    )}

                    <td className="p-4">
                      <span className={`px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest border shadow-inner
                    ${c.status === 'SELESAI' ? 'bg-green-900/30 text-green-500 border-green-800' :
                          c.status === 'PROSES' ? 'bg-blue-900/30 text-blue-500 border-blue-800' :
                            'bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white border-cighra-primary dark:border-cighra-gold animate-pulse'}
                  `}>
                        {c.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handlePrintCasePDF(c)}
                        className="bg-slate-100 dark:bg-slate-700 hover:bg-cighra-primary/10 dark:hover:bg-cighra-gold/10 dark:text-slate-900 text-slate-500 dark:text-slate-400 hover:text-gunmetal dark:hover:text-white border border-slate-300 dark:border-slate-600 hover:border-cighra-primary dark:border-cighra-gold p-2.5 transition-all flex items-center justify-center mx-auto group-hover:shadow-[0_0_15px_rgba(75,83,32,0.4)] relative overflow-hidden group/btn"
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
