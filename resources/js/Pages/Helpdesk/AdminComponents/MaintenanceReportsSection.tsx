import React, { useState } from 'react';
import { Wrench, FileArchive, Search, Building } from 'lucide-react';
import { useTableSort } from '@/hooks/useTableSort';
import SortableHeader from '@/Components/Table/SortableHeader';
import { usePagination } from '@/hooks/usePagination';
import Pagination from '@/Components/Table/Pagination';
import { useStore } from '@/store/useStore';

interface MaintenanceReportsSectionProps {
  dbMaintenanceReports: any[];
  setIsRecapModalOpen?: (open: boolean) => void;
}

const MaintenanceReportsSection: React.FC<MaintenanceReportsSectionProps> = ({ 
  dbMaintenanceReports = [], 
  setIsRecapModalOpen 
}) => {
  const globalSearch = useStore((state) => state.globalSearch);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = dbMaintenanceReports.filter((c: any) => {
    const term = (globalSearch || searchTerm).toLowerCase();
    if (!term) return true;
    
    return (
      (c.satuan?.nama_satuan || '').toLowerCase().includes(term) ||
      (c.nama_giat || '').toLowerCase().includes(term) ||
      (c.pelapor?.nama_lengkap || '').toLowerCase().includes(term) ||
      (c.periode || '').toLowerCase().includes(term)
    );
  });

  const { sortedItems, sortConfig, handleSort } = useTableSort(filtered, { key: 'created_at', direction: 'desc' });
  const { currentPage, totalPages, paginatedItems, handlePageChange, itemsPerPage, totalItems } = usePagination(sortedItems, 10);

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4 mt-2">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-sm leading-5 bg-white dark:bg-cighra-darkcard placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cighra-primary dark:focus:ring-cighra-gold focus:border-cighra-primary dark:focus:border-cighra-gold sm:text-sm text-slate-900 dark:text-white"
            placeholder="Cari Satuan, Nama Giat, Pelapor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cighra-primary dark:bg-cighra-gold"></div>

        {/* Header Area */}
        <div className="p-5 border-b border-white/10 bg-cighra-primary dark:bg-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
          <h3 className="text-white font-tactical font-bold text-lg tracking-widest flex items-center gap-3 uppercase">
            <Wrench className="text-cighra-gold w-6 h-6" /> DATA PEMELIHARAAN RUTIN
          </h3>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          </div>
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-sm break-words">
            <thead className="bg-cighra-primary dark:bg-slate-800 border-b border-white/10 text-white">
              <tr>
                <SortableHeader label="TANGGAL LAPOR" sortKey="created_at" currentSort={sortConfig} onSort={handleSort} className="w-40" />
                <SortableHeader label="ASAL SATUAN & PELAPOR" sortKey="satuan.nama_satuan" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="INFORMASI GIAT PEMELIHARAAN" />
                <SortableHeader label="KEUANGAN (ANGGARAN)" sortKey="jumlah_anggaran" currentSort={sortConfig} onSort={handleSort} />
                <SortableHeader label="DOKUMEN" className="text-center" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800 bg-white dark:bg-transparent">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 italic font-mono tracking-widest uppercase">
                    Tidak ada data pemeliharaan yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors group text-slate-800 dark:text-slate-200">
                    <td className="p-4 font-mono text-slate-800 dark:text-white font-bold text-xs">
                      {new Date(c.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}<br/>
                      <span className="text-slate-500">{new Date(c.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>

                    <td className="p-4 align-top">
                      <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Building className="w-4 h-4 text-cighra-primary dark:text-cighra-gold"/> {c.satuan?.nama_satuan || '-'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1">Pelapor: {c.pelapor?.nama_lengkap || '-'}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">NRP/NIP: {c.pelapor?.nrp_nip || '-'}</div>
                    </td>
                    
                    <td className="p-4 align-top">
                      <div className="font-semibold text-slate-800 dark:text-white mb-1 uppercase text-xs">{c.nama_giat}</div>
                      <div className="inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-sm uppercase tracking-widest">
                        {c.periode} - {c.tahun}
                      </div>
                    </td>

                    <td className="p-4 align-top">
                      <div className="font-mono text-xs text-green-700 dark:text-green-500 font-bold mb-1">
                        {formatRupiah(c.jumlah_anggaran)}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {c.anggaran_pendukung}
                      </div>
                    </td>

                    <td className="p-4 text-center align-middle">
                      <div className="flex flex-col gap-2 items-center justify-center">
                        {c.dokumen_anggaran && (() => {
                          try {
                            const paths = JSON.parse(c.dokumen_anggaran);
                            return paths.map((path: string, i: number) => (
                              <a 
                                key={`anggaran-${i}`}
                                href={`/storage/${path}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1.5 hover:bg-blue-100 transition-colors uppercase font-tactical font-bold flex items-center gap-1 w-full justify-center"
                              >
                                DOK. ANGGARAN {paths.length > 1 ? i+1 : ''}
                              </a>
                            ));
                          } catch (e) {
                            return (
                              <a 
                                href={`/storage/${c.dokumen_anggaran}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[10px] bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-3 py-1.5 hover:bg-blue-100 transition-colors uppercase font-tactical font-bold flex items-center gap-1 w-full justify-center"
                              >
                                DOK. ANGGARAN
                              </a>
                            );
                          }
                        })()}
                        {c.dokumen_lpj && (() => {
                          try {
                            const paths = JSON.parse(c.dokumen_lpj);
                            return paths.map((path: string, i: number) => (
                              <a 
                                key={`lpj-${i}`}
                                href={`/storage/${path}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-3 py-1.5 hover:bg-purple-100 transition-colors uppercase font-tactical font-bold flex items-center gap-1 w-full justify-center"
                              >
                                DOK. LPJ {paths.length > 1 ? i+1 : ''}
                              </a>
                            ));
                          } catch (e) {
                            return (
                              <a 
                                href={`/storage/${c.dokumen_lpj}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-[10px] bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 px-3 py-1.5 hover:bg-purple-100 transition-colors uppercase font-tactical font-bold flex items-center gap-1 w-full justify-center"
                              >
                                DOK. LPJ
                              </a>
                            );
                          }
                        })()}
                      </div>
                    </td>
                  </tr>
                )))}
            </tbody>
          </table>
        </div>
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
};

export default MaintenanceReportsSection;
