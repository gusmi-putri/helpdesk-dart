import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Clock, Activity, ShieldAlert, Eye, XCircle, CheckCircle, Wallet, 
  Search, SlidersHorizontal, User, MapPin, 
  Calendar, Image as ImageIcon, X, FileText,
  AlertTriangle, Link as LinkIcon
} from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';
import { EmptyState } from '@/Components/ui/EmptyState';

interface TicketManagerProps {
  reports: any[];
  onAssignTechnician: (id: number) => void;
  onViewProof: (proofData: { report: any; type: 'rusak' | 'selesai' }) => void;
  onVerify: (id: number) => void;
  onReject: (id: number) => void;
}

const TicketManager: React.FC<TicketManagerProps> = ({
  reports,
  onAssignTechnician,
  onViewProof,
  onVerify,
  onReject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('terbaru');
  
  // State for Drawer
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  // Derive counts from all reports (including completed, which should be passed if DashboardStaf is updated)
  const countMenunggu = reports.filter(r => r.status === 'PENDING').length;
  const countDitugaskan = reports.filter(r => r.status === 'DIVERIFIKASI' || r.status === 'DITERIMA TEKNISI').length;
  const countDikerjakan = reports.filter(r => r.status === 'DIPROSES').length;
  const countSelesai = reports.filter(r => r.status === 'SELESAI').length;

  // Compute Priority Helper
  const getPriorityInfo = (urgensi: string, level: string) => {
    const urg = urgensi?.toUpperCase() || '';
    const lvl = level?.toUpperCase() || '';
    
    if (urg === 'SANGAT MENDESAK' || lvl === 'PARAH' || lvl === 'BERAT') {
      return { label: 'KRITIS', color: 'red', bg: 'bg-transparent', text: 'text-red-500', border: 'border-red-500/50' };
    }
    if (urg === 'MENDESAK' || lvl === 'SEDANG') {
      return { label: 'TINGGI', color: 'orange', bg: 'bg-transparent', text: 'text-orange-500', border: 'border-orange-500/50' };
    }
    if (urg === 'BISA MENUNGGU' || lvl === 'RINGAN') {
      return { label: 'RENDAH', color: 'blue', bg: 'bg-transparent', text: 'text-blue-500', border: 'border-blue-500/50' };
    }
    return { label: 'SEDANG', color: 'yellow', bg: 'bg-transparent', text: 'text-yellow-500', border: 'border-yellow-500/50' };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-transparent text-red-500 border border-red-500/30 text-xs font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><span className="w-1.5 h-1.5  bg-red-500 animate-pulse block"></span> PENDING VERIFIKASI</span>;
      case 'DIVERIFIKASI':
        return <span className="bg-transparent text-yellow-500 border border-yellow-500/30 text-xs font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><Clock className="w-3 h-3 text-yellow-500" /> DIVERIFIKASI</span>;
      case 'DITERIMA TEKNISI':
        return <span className="bg-transparent text-purple-500 border border-purple-500/30 text-xs font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><Activity className="w-3 h-3 text-purple-500" /> TUGAS DITERIMA</span>;
      case 'DIPROSES':
        return <span className="bg-transparent text-blue-500 border border-blue-500/30 text-xs font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><Activity className="w-3 h-3" /> SEDANG DIPROSES</span>;
      case 'SELESAI':
        return <span className="bg-transparent text-green-500 border border-green-500/30 text-xs font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><CheckCircle className="w-3 h-3" /> SELESAI</span>;
      case 'DITOLAK':
        return <span className="bg-transparent text-red-500 border border-red-500/30 text-xs font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><XCircle className="w-3 h-3" /> DITOLAK</span>;
      default:
        return <span className="bg-transparent text-slate-400 border border-slate-700 text-xs font-bold px-2 py-1  font-mono w-fit">{status}</span>;
    }
  };

  // Filter and Sort
  const filteredReports = useMemo(() => {
    let result = reports.filter(r => r.status !== 'SELESAI' && r.status !== 'DITOLAK'); // Hide completed from the active list by default unless statusFilter is SELESAI
    
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'SELESAI') {
         result = reports.filter(r => r.status === 'SELESAI');
      } else {
         result = result.filter(r => r.status === statusFilter);
      }
    }

    if (priorityFilter !== 'ALL') {
      result = result.filter(r => getPriorityInfo(r.kerusakan.urgensi, r.kerusakan.tingkatKerusakan).label === priorityFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.caseId.toLowerCase().includes(q) ||
        r.unit?.nomor_seri?.toLowerCase().includes(q) ||
        r.kerusakan.pelapor?.toLowerCase().includes(q) ||
        r.kerusakan.lokasi?.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => {
      // Simplistic sort by ID for newest/oldest (higher ID = newer)
      if (sortOrder === 'terbaru') return b.db_id - a.db_id;
      if (sortOrder === 'terlama') return a.db_id - b.db_id;
      return 0; // priority sorting can be added here
    });
  }, [reports, searchQuery, priorityFilter, statusFilter, sortOrder]);

  const selectedTicket = useMemo(() => reports.find(r => r.db_id === selectedTicketId), [reports, selectedTicketId]);

  return (
    <div className="animate-in fade-in space-y-6 mt-6">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50  p-4 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20  text-yellow-600 dark:text-yellow-500">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Menunggu Verifikasi</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold font-mono text-slate-800 dark:text-white">{countMenunggu}</h4>
              <span className="text-xs text-slate-400">Butuh verifikasi awal</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50  p-4 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20  text-blue-600 dark:text-blue-500">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Ditugaskan</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold font-mono text-slate-800 dark:text-white">{countDitugaskan}</h4>
              <span className="text-xs text-slate-400">Menunggu teknisi</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50  p-4 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20  text-purple-600 dark:text-purple-500">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Sedang Ditangani</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold font-mono text-slate-800 dark:text-white">{countDikerjakan}</h4>
              <span className="text-xs text-slate-400">Dalam proses perbaikan</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50  p-4 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20  text-green-600 dark:text-green-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Selesai</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold font-mono text-slate-800 dark:text-white">{countSelesai}</h4>
              <span className="text-xs text-slate-400">Selesai ditangani</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="w-full md:w-96">
          <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">CARI TIKET / UNIT</label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="ID TIKET, UNIT, PELAPOR..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 pl-9 pr-4 py-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold transition-colors uppercase"
            />
          </div>
        </div>
        
        <div className="w-full md:w-48">
          <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">PRIORITAS</label>
          <select 
            value={priorityFilter} 
            onChange={e => setPriorityFilter(e.target.value)} 
            className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold transition-colors uppercase"
          >
            <option value="ALL">SEMUA PRIORITAS</option>
            <option value="KRITIS">KRITIS</option>
            <option value="TINGGI">TINGGI</option>
            <option value="SEDANG">SEDANG</option>
            <option value="RENDAH">RENDAH</option>
          </select>
        </div>

        <div className="w-full md:w-56">
          <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">STATUS</label>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)} 
            className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-xs font-mono text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold transition-colors uppercase"
          >
            <option value="ALL">SEMUA STATUS</option>
            <option value="PENDING">MENUNGGU VERIFIKASI</option>
            <option value="DIVERIFIKASI">DIVERIFIKASI</option>
            <option value="DIPROSES">DALAM PENANGANAN</option>
            <option value="SELESAI">SELESAI</option>
          </select>
        </div>
      </div>

      {/* 3. Ticket List Area */}
      <div className="bg-white dark:bg-cighra-darkcard/50  border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
          <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2 text-slate-800 dark:text-white">
            <Activity className="w-4 h-4 text-cighra-primary dark:text-cighra-gold" /> DAFTAR PENANGANAN KERUSAKAN
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Urutkan:</span>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="bg-transparent border-none font-bold text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer p-0">
              <option value="terbaru">Terbaru</option>
              <option value="terlama">Terlama</option>
            </select>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filteredReports.length === 0 ? (
             <div className="py-8">
               <EmptyState title="TIDAK ADA TIKET" description="Belum ada tiket atau laporan kerusakan yang ditemukan." />
             </div>
          ) : (
            filteredReports.map((report) => {
              const priority = getPriorityInfo(report.kerusakan.urgensi, report.kerusakan.tingkatKerusakan);
              const isSelected = selectedTicketId === report.db_id;
              
              let borderColorClass = '';
              if (priority.color === 'red') borderColorClass = 'border-l-red-500';
              else if (priority.color === 'orange') borderColorClass = 'border-l-orange-500';
              else if (priority.color === 'yellow') borderColorClass = 'border-l-yellow-500';
              else borderColorClass = 'border-l-blue-500';

              return (
                <div 
                  key={report.db_id} 
                  className={`relative flex flex-col lg:flex-row gap-4 p-4  border-y border-r border-l-4 ${borderColorClass} ${isSelected ? 'bg-slate-50 dark:bg-slate-800/60 border-y-cighra-gold border-r-cighra-gold shadow-md' : 'bg-white dark:bg-cighra-darkcard border-y-slate-200 dark:border-y-slate-700 border-r-slate-200 dark:border-r-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:-translate-y-0.5 hover:shadow-lg'} transition-all duration-300 group`}
                >
                  {/* Column 1: Ticket Info */}
                  <div className="w-full lg:w-1/4 space-y-2 lg:space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-base text-slate-800 dark:text-white">{report.caseId}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5  uppercase ${priority.bg} ${priority.text} border ${priority.border} flex items-center gap-1`}>
                        {priority.color === 'red' && <AlertTriangle className="w-3 h-3" />} {priority.label}
                      </span>
                    </div>
                    <div className="flex flex-row lg:flex-col justify-between items-start lg:gap-2">
                      <div className="pt-1 lg:pt-2 text-left">
                        <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{report.kerusakan.barangRusak}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase mt-0.5">Unit DART</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 lg:mt-0 text-right lg:text-left">
                        <Calendar className="w-3 h-3" /> {report.kerusakan.tanggal}
                      </div>
                    </div>
                  </div>

                  {/* Divider mobile */}
                  <div className="hidden lg:block w-px bg-slate-200 dark:bg-slate-700 my-1"></div>

                  {/* Details Grid (Mobile: 2 cols, Desktop: flex) */}
                  <div className="w-full lg:w-2/4 grid grid-cols-2 lg:flex lg:gap-0 gap-4">
                    {/* Reporter & Location */}
                    <div className="w-full lg:w-1/2 space-y-4 py-1">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">Pelapor</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{report.kerusakan.pelapor}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">Lokasi</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{report.kerusakan.lokasi}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Technician */}
                    <div className="w-full lg:w-1/2 space-y-4 py-1">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">Status</p>
                        {getStatusBadge(report.status)}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">Teknisi Ditugaskan</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{report.perbaikan.teknisi || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 4: Actions */}
                  <div className="w-full lg:w-1/4 flex flex-row lg:flex-col justify-center items-center gap-2 lg:pl-4 lg:border-l border-slate-200 dark:border-slate-700 pt-3 lg:pt-0 border-t border-slate-200 dark:border-slate-700 lg:border-t-0 relative">
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTicketId(report.db_id)}
                      className="w-full max-w-[190px] text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-500" /> DETAIL
                    </Button>

                    {report.status === 'PENDING' && (
                      <div className="flex gap-2 w-full max-w-[190px]">
                        <Button variant="primary" size="sm" onClick={() => onVerify(report.db_id)} className="flex-1 text-xs px-1">
                          <CheckCircle className="w-3.5 h-3.5" /> SETUJUI
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => onReject(report.db_id)} className="flex-1 text-xs px-1">
                          <XCircle className="w-3.5 h-3.5" /> TOLAK
                        </Button>
                      </div>
                    )}

                    {report.status === 'DIVERIFIKASI' && (
                      <Button variant="primary" size="sm" onClick={() => onAssignTechnician(report.db_id)} className="w-full max-w-[190px] text-xs">
                        <User className="w-3.5 h-3.5" /> TUGASKAN TEKNISI
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 4. Modal for Ticket Details */}
      {selectedTicket && (
        <BaseModal
          isOpen={true}
          onClose={() => setSelectedTicketId(null)}
          maxWidth="2xl"
          headerColor="default"
          icon={<FileText />}
          title={
            <div className="flex flex-col">
              <span className="flex items-center gap-2">DETAIL LAPORAN</span>
              <div className="mt-2 flex items-center gap-3">
                <span className="font-mono font-bold text-xl text-slate-800 dark:text-white leading-none">{selectedTicket.caseId}</span>
                {(() => {
                  const priority = getPriorityInfo(selectedTicket.kerusakan.urgensi, selectedTicket.kerusakan.tingkatKerusakan);
                  return (
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 uppercase ${priority.bg} ${priority.text} border ${priority.border} flex items-center gap-1 rounded-sm`}>
                      {priority.color === 'red' && <AlertTriangle className="w-3 h-3" />} {priority.label}
                    </span>
                  );
                })()}
              </div>
              <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-2 font-normal normal-case">Dibuat: {selectedTicket.kerusakan.tanggal}</p>
            </div>
          }
          footer={
            <div className="flex justify-end gap-3 w-full">
              <button onClick={() => setSelectedTicketId(null)} className="px-6 py-2.5 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-tactical font-bold tracking-widest transition-colors border border-slate-300 dark:border-slate-600 rounded-sm uppercase">
                TUTUP
              </button>
              
              {selectedTicket.status === 'PENDING' && (
                <button onClick={() => onVerify(selectedTicket.db_id)} className="px-6 py-2.5 bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:hover:bg-cighra-gold/90 text-white dark:text-slate-900 text-xs font-tactical font-bold tracking-widest transition-colors shadow-md rounded-sm uppercase flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> SETUJUI
                </button>
              )}
              {['DIVERIFIKASI', 'DITERIMA TEKNISI', 'DIPROSES'].includes(selectedTicket.status) && (
                <button onClick={() => onAssignTechnician(selectedTicket.db_id)} className="px-6 py-2.5 bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:hover:bg-cighra-gold/90 text-white dark:text-slate-900 text-xs font-tactical font-bold tracking-widest transition-colors shadow-md rounded-sm uppercase flex items-center gap-2">
                  <User className="w-4 h-4" /> {selectedTicket.perbaikan.teknisi ? 'TUGASKAN ULANG' : 'TUGASKAN TEKNISI'}
                </button>
              )}
            </div>
          }
        >
          <div className="p-6 md:p-8 space-y-8">
              
              {/* Section 1: Info Unit */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 border border-slate-200 dark:border-slate-700 rounded-sm">
                <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Informasi Unit DART</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase">Nomor Unit</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{selectedTicket.kerusakan.barangRusak}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase">Lokasi</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{selectedTicket.kerusakan.lokasi}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase">Jenis DART</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{selectedTicket.kerusakan.jenis_dart || 'Tidak Diketahui'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase">Satuan</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{selectedTicket.kerusakan.lokasi || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Section 2: Info Pelapor */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 border border-slate-200 dark:border-slate-700 rounded-sm">
                <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Informasi Pelapor</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase">Nama Pelapor</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> {selectedTicket.kerusakan.pelapor}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase">Metode Perbaikan Diajukan</p>
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono font-bold border rounded-sm uppercase bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600">
                      <Wallet className="w-3 h-3 mr-1" /> {selectedTicket.kerusakan.jenisPerbaikan || 'Swadaya'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Deskripsi */}
              <section>
                <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FileText size={14} /> DESKRIPSI KERUSAKAN
                </h4>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans italic relative rounded-sm">
                   <span className="absolute top-2 left-2 text-2xl text-slate-300 dark:text-slate-700 font-serif leading-none">"</span>
                   <p className="pl-4 z-10 relative">{selectedTicket.kerusakan.deskripsi || 'Tidak ada deskripsi.'}</p>
                </div>
                
                {/* Lampiran Foto */}
                {(selectedTicket.kerusakan.foto_bukti || (selectedTicket.kerusakan.fileBukti && selectedTicket.kerusakan.fileBukti.length > 0)) && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ImageIcon size={14} /> FOTO KENDALA
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedTicket.kerusakan.foto_bukti && (
                        <a href={selectedTicket.kerusakan.foto_bukti} target="_blank" rel="noopener noreferrer" className="block border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden aspect-video relative group">
                          <img src={selectedTicket.kerusakan.foto_bukti} alt="Foto Bukti" className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
                            <span className="text-white text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 border border-white/50 rounded-sm">Perbesar</span>
                          </div>
                        </a>
                      )}
                      {selectedTicket.kerusakan.fileBukti?.map((foto: string, idx: number) => {
                        if (foto.match(/\.(jpeg|jpg|gif|png)$/i)) {
                          return (
                            <a key={idx} href={foto} target="_blank" rel="noopener noreferrer" className="block border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 rounded-sm overflow-hidden aspect-video relative group">
                              <img src={foto} alt={`Foto Bukti ${idx+1}`} className="w-full h-full object-cover group-hover:opacity-75 transition-opacity" />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-sm">
                                <span className="text-white text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 border border-white/50 rounded-sm">Perbesar</span>
                              </div>
                            </a>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                )}

                {/* Lampiran Dokumen */}
                {selectedTicket.kerusakan.dokumenAnggaran && selectedTicket.kerusakan.dokumenAnggaran.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={14} /> DOKUMEN PENDUKUNG ({selectedTicket.kerusakan.dokumenAnggaran.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedTicket.kerusakan.dokumenAnggaran.map((doc: string, idx: number) => {
                        const fileName = doc.split('/').pop() || `Dokumen_${idx+1}.pdf`;
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-sm bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-sm shrink-0">
                                <FileText size={16} className="text-slate-600 dark:text-slate-300" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 dark:text-white truncate" title={fileName}>{fileName}</p>
                                <p className="text-xs text-slate-500 font-mono mt-0.5">Berkas Terlampir</p>
                              </div>
                            </div>
                            <a href={doc} target="_blank" rel="noopener noreferrer" title="Unduh Dokumen" className="shrink-0 ml-3 p-2 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-600 hover:text-cighra-primary dark:hover:text-cighra-gold hover:border-cighra-primary dark:hover:border-cighra-gold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors rounded-sm">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Tautan Media Eksternal */}
                {selectedTicket.kerusakan.tautan_video && (
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <LinkIcon size={14} /> TAUTAN MEDIA EKSTERNAL
                    </h4>
                    <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-sm bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-sm shrink-0">
                          <LinkIcon size={18} className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-white mb-1">Tautan Drive / URL</p>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-mono truncate cursor-pointer hover:underline" onClick={() => window.open(selectedTicket.kerusakan.tautan_video, '_blank')} title={selectedTicket.kerusakan.tautan_video}>{selectedTicket.kerusakan.tautan_video}</p>
                        </div>
                      </div>
                      <a href={selectedTicket.kerusakan.tautan_video} target="_blank" rel="noopener noreferrer" className="shrink-0 ml-3 px-4 py-2 text-xs font-tactical font-bold tracking-widest uppercase bg-blue-600 text-white hover:bg-blue-700 transition-colors rounded-sm flex items-center gap-2 shadow-sm">
                        Buka Tautan <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                      </a>
                    </div>
                  </div>
                )}
              </section>

              {/* Section 4: Riwayat Status */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 border border-slate-200 dark:border-slate-700 rounded-sm">
                <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Riwayat Status</h4>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                  {/* Item 1: Dilaporkan */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5  border border-white bg-slate-300 dark:bg-slate-700 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <div className="w-2 h-2  bg-slate-500"></div>
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-white dark:bg-slate-800 p-3 rounded-sm border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-800 dark:text-white uppercase">Dilaporkan</span>
                      </div>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{selectedTicket.kerusakan.tanggal}</p>
                    </div>
                  </div>

                  {/* Dynamic Items based on status progression */}
                  {selectedTicket.status !== 'PENDING' && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5  border border-white bg-yellow-100 dark:bg-yellow-900/50 text-yellow-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <div className="w-2 h-2  bg-yellow-500"></div>
                      </div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-white dark:bg-slate-800 p-3 rounded-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-yellow-600 dark:text-yellow-500 uppercase">Diverifikasi</span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Verifikasi awal selesai.</p>
                      </div>
                    </div>
                  )}

                  {selectedTicket.perbaikan.teknisi && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5  border border-white bg-blue-100 dark:bg-blue-900/50 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <div className="w-2 h-2  bg-blue-500"></div>
                      </div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-white dark:bg-slate-800 p-3 rounded-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-blue-600 dark:text-blue-500 uppercase">Ditugaskan</span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">Ke: {selectedTicket.perbaikan.teknisi}</p>
                      </div>
                    </div>
                  )}

                  {(selectedTicket.status === 'SELESAI' || selectedTicket.status === 'DITOLAK') && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-5 h-5  border border-white ${selectedTicket.status === 'SELESAI' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                        <div className={`w-2 h-2  ${selectedTicket.status === 'SELESAI' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-white dark:bg-slate-800 p-3 rounded-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold text-xs uppercase ${selectedTicket.status === 'SELESAI' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>{selectedTicket.status}</span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{selectedTicket.perbaikan.tanggalSelesai || 'Diselesaikan'}</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Section 5: Info Teknisi */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-4 border border-slate-200 dark:border-slate-700 rounded-sm">
                <h4 className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2"><User className="w-3.5 h-3.5" /> Teknisi Ditugaskan</h4>
                {selectedTicket.perbaikan.teknisi ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase">Nama Teknisi</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedTicket.perbaikan.teknisi}</p>
                    </div>
                    {selectedTicket.status === 'DIVERIFIKASI' && (
                      <button onClick={() => onAssignTechnician(selectedTicket.db_id)} className="bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:hover:bg-cighra-gold/90 text-white dark:text-slate-900 px-3 py-1.5 text-xs font-tactical tracking-widest  transition-colors border border-cighra-primary dark:border-cighra-gold shadow-sm rounded-sm">
                        UBAH TEKNISI
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-mono uppercase italic mb-2">Belum ada teknisi ditugaskan.</p>
                    {selectedTicket.status === 'DIVERIFIKASI' && (
                      <button onClick={() => onAssignTechnician(selectedTicket.db_id)} className="bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:hover:bg-cighra-gold/90 text-white dark:text-slate-900 px-4 py-2 text-xs font-tactical tracking-widest  transition-colors flex items-center gap-2 mx-auto shadow-md rounded-sm">
                        <ShieldAlert className="w-3.5 h-3.5" /> TUGASKAN SEKARANG
                      </button>
                    )}
                  </div>
                )}
                
                {selectedTicket.perbaikan.tindakan && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase">Catatan Tindakan</p>
                    <p className="text-sm text-slate-800 dark:text-slate-300 font-serif italic">"{selectedTicket.perbaikan.tindakan}"</p>
                  </div>
                )}
                {selectedTicket.perbaikan.alasanPenolakan && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                    <p className="text-xs font-mono text-red-500 dark:text-red-400 mb-1 uppercase">Alasan Penolakan</p>
                    <p className="text-sm text-slate-800 dark:text-slate-300 font-serif italic text-red-700 dark:text-red-300">"{selectedTicket.perbaikan.alasanPenolakan}"</p>
                  </div>
                )}
              </div>
            </div>
        </BaseModal>
      )}
    </div>
  );
};

export default TicketManager;

