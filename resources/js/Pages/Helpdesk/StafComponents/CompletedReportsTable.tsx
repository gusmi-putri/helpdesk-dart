import React, { useState, useMemo } from 'react';
import {
  CheckCircle, Image, CheckSquare, XCircle, Search, Filter,
  RotateCcw, Printer, ChevronLeft, ChevronRight, Calendar,
  FileText, Check, X,
  FileArchive
} from 'lucide-react';
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
  // Local States for Filtering and Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [technicianFilter, setTechnicianFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Derive Summary Statistics
  const stats = useMemo(() => {
    let tuntas = 0;
    let ditolak = 0;
    let mingguIni = 0;
    const now = new Date();

    reports.forEach(r => {
      if (r.status === 'SELESAI') tuntas++;
      if (r.status === 'DITOLAK') ditolak++;

      if (r.perbaikan?.tanggalSelesai) {
        const selesaiDate = new Date(r.perbaikan.tanggalSelesai);
        if (!isNaN(selesaiDate.getTime())) {
          const diffTime = Math.abs(now.getTime() - selesaiDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays <= 7) mingguIni++;
        }
      }
    });

    return {
      total: reports.length,
      tuntas,
      ditolak,
      mingguIni
    };
  }, [reports]);

  const uniqueTechnicians = useMemo(() => {
    const tech = new Set<string>();
    reports.forEach(r => {
      if (r.perbaikan?.teknisi) tech.add(r.perbaikan.teknisi);
    });
    return Array.from(tech);
  }, [reports]);

  const uniqueMethods = useMemo(() => {
    const methods = new Set<string>();
    reports.forEach(r => {
      if (r.perbaikan?.metodePerbaikan) methods.add(r.perbaikan.metodePerbaikan);
    });
    return Array.from(methods);
  }, [reports]);

  // Filter Logic
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchSearch =
        searchQuery === '' ||
        r.caseId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.kerusakan?.barangRusak?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.perbaikan?.teknisi?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === '' || r.status === statusFilter;
      const matchMethod = methodFilter === '' || r.perbaikan?.metodePerbaikan === methodFilter;
      const matchTech = technicianFilter === '' || r.perbaikan?.teknisi === technicianFilter;

      return matchSearch && matchStatus && matchMethod && matchTech;
    });
  }, [reports, searchQuery, statusFilter, methodFilter, technicianFilter]);

  // Sorting
  const { sortedItems, sortConfig, handleSort } = useTableSort(filteredReports, { key: 'caseId', direction: 'desc' });

  // Pagination Logic
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedReports = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setMethodFilter('');
    setTechnicianFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="animate-in fade-in space-y-6">

      {/* 1. SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Total Arsip */}
        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50 p-3 rounded-none flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-500"></div>
          <div className="p-2.5 rounded-none bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ml-1">
            <FileArchive className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Total Arsip</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-bold font-mono text-slate-800 dark:text-white">{stats.total}</h4>
            </div>
          </div>
        </div>

        {/* Tuntas */}
        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50 p-3 rounded-none flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-500"></div>
          <div className="p-2.5 rounded-none bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 ml-1">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Tuntas</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-bold font-mono text-slate-800 dark:text-white">{stats.tuntas}</h4>
            </div>
          </div>
        </div>

        {/* Ditolak */}
        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50 p-3 rounded-none flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
          <div className="p-2.5 rounded-none bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-500 ml-1">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Ditolak</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-bold font-mono text-slate-800 dark:text-white">{stats.ditolak}</h4>
            </div>
          </div>
        </div>

        {/* Minggu Ini */}
        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50 p-3 rounded-none flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
          <div className="p-2.5 rounded-none bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500 ml-1">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Minggu Ini</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-xl font-bold font-mono text-slate-800 dark:text-white">{stats.mingguIni}</h4>
            </div>
          </div>
        </div>

      </div>

      {/* 2. FILTER TOOLBAR */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end">
        <div className="w-full md:flex-1">
          <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Cari Arsip</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="ID TIKET, UNIT, TEKNISI..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 pl-10 pr-4 py-2.5 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold focus:ring-1 focus:ring-cighra-primary/30 transition-all uppercase rounded-none"
            />
          </div>
        </div>

        <div className="w-full md:w-44">
          <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold focus:ring-1 focus:ring-cighra-primary/30 transition-all uppercase rounded-none"
          >
            <option value="">SEMUA STATUS</option>
            <option value="SELESAI">TUNTAS</option>
            <option value="DITOLAK">DITOLAK</option>
          </select>
        </div>

        <div className="w-full md:w-44">
          <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Metode</label>
          <select
            value={methodFilter}
            onChange={(e) => { setMethodFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold focus:ring-1 focus:ring-cighra-primary/30 transition-all uppercase rounded-none"
          >
            <option value="">SEMUA METODE</option>
            {uniqueMethods.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-44">
          <label className="block text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">Teknisi</label>
          <select
            value={technicianFilter}
            onChange={(e) => { setTechnicianFilter(e.target.value); setCurrentPage(1); }}
            className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-xs font-mono font-medium text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold focus:ring-1 focus:ring-cighra-primary/30 transition-all uppercase rounded-none"
          >
            <option value="">SEMUA TEKNISI</option>
            {uniqueTechnicians.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-auto">
          <button
            onClick={resetFilters}
            className="w-full md:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-bold font-mono uppercase tracking-wider rounded-none transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
      </div>

      {/* 3. TABLE SECTION */}
      <div className="bg-white dark:bg-cighra-darkcard/70 border border-slate-200 dark:border-slate-600 overflow-hidden shadow-xl mt-4">

        {/* Card Header (Navy) */}
        <div className="p-4 border-b border-white/10 bg-cighra-primary dark:bg-slate-800 flex items-center justify-between text-white">
          <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-cighra-gold" /> Daftar Arsip
          </h3>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <table className="w-full text-center font-sans">

            {/* Table Header */}
            <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white">
              <tr>
                <SortableHeader label="ID TIKET" sortKey="caseId" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="DETAIL KERUSAKAN" />
                <SortableHeader label="TEKNISI PELAKSANA" />
                <SortableHeader label="CATATAN PERBAIKAN" />
                <SortableHeader label="DOKUMENTASI" />
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-200/60 dark:divide-slate-700/50 bg-blue-50/40 dark:bg-transparent">
              {paginatedReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8">
                    <EmptyState
                      icon={<FileArchive className="w-16 h-16 opacity-50" />}
                      title="Tidak Ada Data"
                      description="Tidak ditemukan arsip perbaikan yang cocok dengan filter."
                    />
                  </td>
                </tr>
              ) : (
                paginatedReports.map((report: any) => (
                  <tr
                    key={report.db_id}
                    className="hover:bg-blue-100/50 dark:hover:bg-slate-700/30 transition-colors text-slate-800 dark:text-white"
                  >
                    {/* TIKET & STATUS */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onSelectReport(report.db_id)}
                        className="font-mono font-bold text-sm bg-white dark:bg-cighra-darkcard px-2 py-1 border border-slate-300 dark:border-slate-600 block text-center w-fit mx-auto hover:border-cighra-primary dark:border-cighra-gold hover:text-cighra-primary dark:text-cighra-gold transition-colors group/tid rounded-none"
                      >
                        {report.caseId}
                      </button>
                      {report.status === 'SELESAI' ? (
                        <div className="mt-2 text-[11px] font-mono font-bold text-green-600 dark:text-green-500 flex justify-center items-center gap-1 uppercase tracking-widest border border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/10 px-2 py-1 w-fit mx-auto shadow-sm rounded-none">
                          <CheckCircle className="w-3 h-3" /> TUNTAS
                        </div>
                      ) : (
                        <div className="mt-2 text-[11px] font-mono font-bold text-red-600 dark:text-red-500 flex justify-center items-center gap-1 uppercase tracking-widest border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/10 px-2 py-1 w-fit mx-auto shadow-sm rounded-none">
                          <XCircle className="w-3 h-3" /> DITOLAK
                        </div>
                      )}
                    </td>

                    {/* DETAIL KERUSAKAN */}
                    <td className="p-4 text-center">
                      <div className="font-bold text-sm text-slate-800 dark:text-white mb-1 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span>{report.kerusakan.barangRusak}</span>
                          {report.kerusakan.pelapor_satuan_id && report.kerusakan.unit_satuan_id && report.kerusakan.pelapor_satuan_id !== report.kerusakan.unit_satuan_id && (
                            <span className="bg-orange-500/10 text-orange-500 border border-orange-500/30 text-[9px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap">LINTAS SATUAN</span>
                          )}
                        </div>
                      </div>
                      <div className="text-slate-500 dark:text-slate-300 text-[11px] font-mono flex flex-col gap-0.5">
                        <span>MSK: {report.kerusakan.tanggal}</span>
                        <span>SLS: {report.perbaikan.tanggalSelesai || '-'}</span>
                      </div>
                    </td>

                    {/* TEKNISI */}
                    <td className="p-4 text-center">
                      <div className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">
                        {report.perbaikan.teknisi}
                      </div>
                      <div className="text-slate-500 dark:text-slate-300 text-xs font-mono mt-1 uppercase">
                        KODE OP: {report.db_id}
                      </div>
                    </td>

                    {/* CATATAN */}
                    <td className="p-4 text-center max-w-sm">
                      {report.status === 'DITOLAK' ? (
                        <div className="text-[11px] text-red-600 dark:text-red-500 border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/10 p-2 text-left font-mono rounded-none">
                          <span className="font-bold block mb-1 tracking-wider uppercase">ALASAN PENOLAKAN:</span>
                          <p className="leading-relaxed">{report.perbaikan.alasanPenolakan || 'TIDAK ADA ALASAN PENOLAKAN.'}</p>
                        </div>
                      ) : (
                        <div className="text-xs text-left font-mono flex flex-col items-center">
                          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2 text-center max-w-xs mx-auto">
                            {report.perbaikan.tindakan || 'TIDAK ADA CATATAN KHUSUS.'}
                          </p>
                          {report.perbaikan.metodePerbaikan && (
                            <span className="text-[11px] font-bold px-2 py-0.5 border shadow-sm uppercase bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 block w-fit rounded-none">
                              METODE: {report.perbaikan.metodePerbaikan}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* DOKUMENTASI */}
                    <td className="p-4 text-center">
                      <div className="flex flex-col gap-2 max-w-[200px] mx-auto">
                        {(report.kerusakan.foto_bukti || (report.kerusakan.fileBukti && report.kerusakan.fileBukti.length > 0) || report.kerusakan.tautan_video) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onViewProof({ report, type: 'rusak' }); }}
                            className="w-full bg-white dark:bg-cighra-darkcard/80 hover:bg-slate-50 dark:hover:bg-black text-slate-600 dark:text-slate-300 px-3 py-1.5 text-xs font-mono font-bold tracking-widest transition-colors flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600"
                          >
                            <Image className="w-3 h-3 text-cighra-primary dark:text-cighra-gold" /> RUSAK
                          </button>
                        )}
                        {(report.perbaikan.foto_bukti_selesai || report.perbaikan.video_bukti_selesai) && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onViewProof({ report, type: 'selesai' }); }}
                            className="w-full bg-white dark:bg-cighra-darkcard/80 hover:bg-slate-50 dark:hover:bg-black text-slate-600 dark:text-slate-300 px-3 py-1.5 text-xs font-mono font-bold tracking-widest transition-colors flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600"
                          >
                            <CheckSquare className="w-3 h-3 text-green-600 dark:text-green-500" /> SELESAI
                          </button>
                        )}
                        {!(report.kerusakan.foto_bukti || (report.kerusakan.fileBukti && report.kerusakan.fileBukti.length > 0) || report.kerusakan.tautan_video) && !report.perbaikan.foto_bukti_selesai && !report.perbaikan.video_bukti_selesai && (
                          <span className="text-xs font-mono text-slate-400 dark:text-slate-500 tracking-wider">TIDAK ADA MEDIA</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION */}
        <div className="border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-none text-xs h-8 px-2 outline-none focus:ring-1 focus:ring-cighra-primary/30 font-mono text-slate-700 dark:text-slate-300"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-none disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs uppercase tracking-wider font-bold"
            >
              SEBELUMNYA
            </button>
            <div className="px-3 text-xs font-bold text-slate-700 dark:text-slate-300">
              HALAMAN {currentPage} DARI {Math.max(1, totalPages)}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-none disabled:opacity-50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-xs uppercase tracking-wider font-bold"
            >
              SELANJUTNYA
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompletedReportsTable;
