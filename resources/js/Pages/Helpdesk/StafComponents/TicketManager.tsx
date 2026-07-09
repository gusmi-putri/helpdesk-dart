import React, { useState, useMemo } from 'react';
import { 
  Clock, Activity, ShieldAlert, Eye, XCircle, CheckCircle, Wallet, 
  Search, SlidersHorizontal, User, MapPin, 
  Calendar, Image as ImageIcon, X, FileText,
  AlertTriangle
} from 'lucide-react';

interface TicketManagerProps {
  reports: any[];
  onAssignTechnician: (id: number) => void;
  onViewProof: (proof: any[]) => void;
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
        return <span className="bg-transparent text-red-500 border border-red-500/30 text-[10px] font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><span className="w-1.5 h-1.5  bg-red-500 animate-pulse block"></span> PENDING VERIFIKASI</span>;
      case 'DIVERIFIKASI':
        return <span className="bg-transparent text-yellow-500 border border-yellow-500/30 text-[10px] font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><Clock className="w-3 h-3 text-yellow-500" /> DIVERIFIKASI</span>;
      case 'DITERIMA TEKNISI':
        return <span className="bg-transparent text-purple-500 border border-purple-500/30 text-[10px] font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><Activity className="w-3 h-3 text-purple-500" /> TUGAS DITERIMA</span>;
      case 'DIPROSES':
        return <span className="bg-transparent text-blue-500 border border-blue-500/30 text-[10px] font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><Activity className="w-3 h-3" /> SEDANG DIPROSES</span>;
      case 'SELESAI':
        return <span className="bg-transparent text-green-500 border border-green-500/30 text-[10px] font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><CheckCircle className="w-3 h-3" /> SELESAI</span>;
      case 'DITOLAK':
        return <span className="bg-transparent text-red-500 border border-red-500/30 text-[10px] font-bold px-2 py-1  font-mono flex items-center gap-1 w-fit shadow-sm"><XCircle className="w-3 h-3" /> DITOLAK</span>;
      default:
        return <span className="bg-transparent text-slate-400 border border-slate-700 text-[10px] font-bold px-2 py-1  font-mono w-fit">{status}</span>;
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
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Menunggu Verifikasi</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold font-mono text-slate-800 dark:text-white">{countMenunggu}</h4>
              <span className="text-[10px] text-slate-400">Butuh verifikasi awal</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50  p-4 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20  text-blue-600 dark:text-blue-500">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Ditugaskan</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold font-mono text-slate-800 dark:text-white">{countDitugaskan}</h4>
              <span className="text-[10px] text-slate-400">Menunggu teknisi</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50  p-4 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500"></div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20  text-purple-600 dark:text-purple-500">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Sedang Ditangani</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold font-mono text-slate-800 dark:text-white">{countDikerjakan}</h4>
              <span className="text-[10px] text-slate-400">Dalam proses perbaikan</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/50  p-4 flex items-center gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20  text-green-600 dark:text-green-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 uppercase">Selesai</p>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-bold font-mono text-slate-800 dark:text-white">{countSelesai}</h4>
              <span className="text-[10px] text-slate-400">Selesai ditangani</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filters & Search */}
      <div className="flex flex-col md:flex-row gap-3 items-center bg-white dark:bg-cighra-darkcard p-3  border border-slate-200 dark:border-slate-700/50 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari ID tiket, unit, pelapor, atau lokasi..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700  text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-cighra-primary dark:focus:ring-cighra-gold"
          />
        </div>
        
        <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto">
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="py-2 pl-3 pr-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700  text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none appearance-none">
            <option value="ALL">Prioritas</option>
            <option value="KRITIS">Kritis</option>
            <option value="TINGGI">Tinggi</option>
            <option value="SEDANG">Sedang</option>
            <option value="RENDAH">Rendah</option>
          </select>
          
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="py-2 pl-3 pr-8 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700  text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none appearance-none">
            <option value="ALL">Status</option>
            <option value="PENDING">Menunggu Verifikasi</option>
            <option value="DIVERIFIKASI">Diverifikasi</option>
            <option value="DIPROSES">Dalam Penanganan</option>
            <option value="SELESAI">Selesai</option>
          </select>

          <button className="p-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700  text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
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
             <div className="text-center py-12">
               <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
               <p className="text-slate-500 dark:text-slate-400 font-mono text-sm uppercase tracking-widest">Tidak ada tiket ditemukan.</p>
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
                  className={`relative flex flex-col lg:flex-row gap-4 p-4  border-y border-r border-l-4 ${borderColorClass} ${isSelected ? 'bg-slate-50 dark:bg-slate-800/60 border-y-cighra-gold border-r-cighra-gold shadow-md' : 'bg-white dark:bg-cighra-darkcard border-y-slate-200 dark:border-y-slate-700 border-r-slate-200 dark:border-r-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'} transition-all group`}
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
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase mt-0.5">Unit DART</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1 lg:mt-0 text-right lg:text-left">
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
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">Pelapor</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{report.kerusakan.pelapor}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">Lokasi</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{report.kerusakan.lokasi}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Technician */}
                    <div className="w-full lg:w-1/2 space-y-4 py-1">
                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">Status</p>
                        {getStatusBadge(report.status)}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase mb-1">Teknisi Ditugaskan</p>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{report.perbaikan.teknisi || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 4: Actions */}
                  <div className="w-full lg:w-1/4 flex flex-row lg:flex-col justify-center items-center gap-2 lg:pl-4 lg:border-l border-slate-200 dark:border-slate-700 pt-3 lg:pt-0 border-t border-slate-200 dark:border-slate-700 lg:border-t-0 relative">
                    <button 
                      onClick={() => setSelectedTicketId(report.db_id)}
                      className="w-full max-w-[140px] px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-tactical tracking-widest  transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-600"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-500" /> DETAIL
                    </button>

                    {report.status === 'PENDING' && (
                      <div className="flex gap-2 w-full max-w-[160px]">
                        <button onClick={() => onVerify(report.db_id)} className="flex-1 bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:hover:bg-cighra-gold/90 dark:text-slate-900 text-white py-2 px-1 text-[10px] font-tactical tracking-widest  transition-colors flex items-center justify-center border border-cighra-primary dark:border-cighra-gold shadow-md">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> SETUJUI
                        </button>
                        <button onClick={() => onReject(report.db_id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-1 text-[10px] font-tactical tracking-widest  transition-colors flex items-center justify-center border border-red-600 shadow-md">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> TOLAK
                        </button>
                      </div>
                    )}

                    {report.status === 'DIVERIFIKASI' && (
                      <button onClick={() => onAssignTechnician(report.db_id)} className="w-full max-w-[140px] px-3 py-2 bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:hover:bg-cighra-gold/90 dark:text-slate-900 text-white text-[10px] font-tactical tracking-widest  transition-colors flex items-center justify-center gap-2 border border-cighra-primary dark:border-cighra-gold shadow-md">
                        <User className="w-3.5 h-3.5" /> TUGASKAN TEKNISI
                      </button>
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedTicketId(null)}
          ></div>
          
          <div className="bg-white dark:bg-cighra-darkcard w-full max-w-4xl max-h-[90vh] flex flex-col relative z-[110] shadow-2xl border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-start bg-slate-50 dark:bg-slate-800/30">
              <div>
                <h2 className="font-tactical text-lg tracking-widest text-slate-800 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cighra-primary dark:text-cighra-gold" /> DETAIL LAPORAN
                </h2>
                <div className="mt-4 flex items-center gap-3">
                  <span className="font-mono font-bold text-xl text-slate-800 dark:text-white">{selectedTicket.caseId}</span>
                  {(() => {
                    const priority = getPriorityInfo(selectedTicket.kerusakan.urgensi, selectedTicket.kerusakan.tingkatKerusakan);
                    return (
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5  uppercase ${priority.bg} ${priority.text} border ${priority.border} flex items-center gap-1`}>
                        {priority.color === 'red' && <AlertTriangle className="w-3 h-3" />} {priority.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase">Dibuat: {selectedTicket.kerusakan.tanggal}</p>
              </div>
              <button onClick={() => setSelectedTicketId(null)} className="p-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300  transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
              
              {/* Section 1: Info Unit */}
              <section>
                <h4 className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-3 uppercase">Informasi Unit DART</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">Nomor Unit</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{selectedTicket.kerusakan.barangRusak}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">Lokasi</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{selectedTicket.kerusakan.lokasi}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">Jenis DART</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{selectedTicket.kerusakan.jenis_dart || 'Tidak Diketahui'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">Satuan</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{selectedTicket.kerusakan.lokasi || '-'}</p>
                  </div>
                </div>
              </section>

              {/* Section 2: Info Pelapor */}
              <section>
                <h4 className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-3 uppercase">Informasi Pelapor</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">Nama Pelapor</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /> {selectedTicket.kerusakan.pelapor}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">Metode Perbaikan Diajukan</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-white uppercase"><Wallet className="inline w-3 h-3 mr-1" /> {selectedTicket.kerusakan.jenisPerbaikan || 'Swadaya'}</p>
                  </div>
                </div>
              </section>

              {/* Section 3: Deskripsi */}
              <section>
                <h4 className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-3 uppercase">Deskripsi Kerusakan</h4>
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4  border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans italic relative">
                   <span className="absolute top-2 left-2 text-2xl text-slate-300 dark:text-slate-700 font-serif leading-none">"</span>
                   <p className="pl-4 z-10 relative">{selectedTicket.kerusakan.deskripsi || 'Tidak ada deskripsi.'}</p>
                </div>
                
                {selectedTicket.kerusakan.fileBukti && selectedTicket.kerusakan.fileBukti.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedTicket.kerusakan.fileBukti.map((url: string, index: number) => (
                      <button 
                        key={index}
                        onClick={() => onViewProof(selectedTicket.kerusakan.fileBukti)}
                        className="h-20 w-28 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600  flex items-center justify-center overflow-hidden relative group/img hover:border-cighra-primary dark:hover:border-cighra-gold transition-colors"
                      >
                         {/* Thumbnail preview if it's an image, else icon */}
                         {url.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                            <img src={url} alt="Bukti" className="object-cover w-full h-full opacity-80 group-hover/img:opacity-100 transition-opacity" />
                         ) : (
                            <ImageIcon className="w-6 h-6 text-slate-400" />
                         )}
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-sm">
                           <Eye className="w-5 h-5 text-white" />
                         </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              {/* Section 4: Riwayat Status */}
              <section>
                <h4 className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-4 uppercase">Riwayat Status</h4>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 dark:before:via-slate-700 before:to-transparent">
                  {/* Item 1: Dilaporkan */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5  border border-white bg-slate-300 dark:bg-slate-700 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <div className="w-2 h-2  bg-slate-500"></div>
                    </div>
                    <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 dark:bg-slate-800/50 p-3 rounded border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-slate-800 dark:text-white uppercase">Dilaporkan</span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{selectedTicket.kerusakan.tanggal}</p>
                    </div>
                  </div>

                  {/* Dynamic Items based on status progression */}
                  {selectedTicket.status !== 'PENDING' && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5  border border-white bg-yellow-100 dark:bg-yellow-900/50 text-yellow-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <div className="w-2 h-2  bg-yellow-500"></div>
                      </div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 dark:bg-slate-800/50 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-yellow-600 dark:text-yellow-500 uppercase">Diverifikasi</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Verifikasi awal selesai.</p>
                      </div>
                    </div>
                  )}

                  {selectedTicket.perbaikan.teknisi && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5  border border-white bg-blue-100 dark:bg-blue-900/50 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <div className="w-2 h-2  bg-blue-500"></div>
                      </div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 dark:bg-slate-800/50 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-blue-600 dark:text-blue-500 uppercase">Ditugaskan</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Ke: {selectedTicket.perbaikan.teknisi}</p>
                      </div>
                    </div>
                  )}

                  {(selectedTicket.status === 'SELESAI' || selectedTicket.status === 'DITOLAK') && (
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className={`flex items-center justify-center w-5 h-5  border border-white ${selectedTicket.status === 'SELESAI' ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                        <div className={`w-2 h-2  ${selectedTicket.status === 'SELESAI' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 dark:bg-slate-800/50 p-3 rounded border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-bold text-xs uppercase ${selectedTicket.status === 'SELESAI' ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>{selectedTicket.status}</span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{selectedTicket.perbaikan.tanggalSelesai || 'Diselesaikan'}</p>
                      </div>
                    </div>
                  )}

                </div>
              </section>

              {/* Section 5: Info Teknisi */}
              <section className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700  p-4">
                <h4 className="text-[10px] font-tactical tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 pb-2 mb-3 uppercase flex items-center gap-2"><User className="w-3.5 h-3.5" /> Teknisi Ditugaskan</h4>
                {selectedTicket.perbaikan.teknisi ? (
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">Nama Teknisi</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedTicket.perbaikan.teknisi}</p>
                    </div>
                    {selectedTicket.status === 'DIVERIFIKASI' && (
                      <button onClick={() => onAssignTechnician(selectedTicket.db_id)} className="bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:hover:bg-cighra-gold/90 text-white dark:text-slate-900 px-3 py-1.5 text-[10px] font-tactical tracking-widest  transition-colors border border-cighra-primary dark:border-cighra-gold shadow-sm">
                        UBAH TEKNISI
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-mono uppercase italic mb-2">Belum ada teknisi ditugaskan.</p>
                    {selectedTicket.status === 'DIVERIFIKASI' && (
                      <button onClick={() => onAssignTechnician(selectedTicket.db_id)} className="bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:hover:bg-cighra-gold/90 text-white dark:text-slate-900 px-4 py-2 text-[10px] font-tactical tracking-widest  transition-colors flex items-center gap-2 mx-auto shadow-md">
                        <ShieldAlert className="w-3.5 h-3.5" /> TUGASKAN SEKARANG
                      </button>
                    )}
                  </div>
                )}
                
                {selectedTicket.perbaikan.tindakan && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                    <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 uppercase">Catatan Tindakan</p>
                    <p className="text-sm text-slate-800 dark:text-slate-300 font-serif italic">"{selectedTicket.perbaikan.tindakan}"</p>
                  </div>
                )}
                {selectedTicket.perbaikan.alasanPenolakan && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                    <p className="text-[10px] font-mono text-red-500 dark:text-red-400 mb-1 uppercase">Alasan Penolakan</p>
                    <p className="text-sm text-slate-800 dark:text-slate-300 font-serif italic text-red-700 dark:text-red-300">"{selectedTicket.perbaikan.alasanPenolakan}"</p>
                  </div>
                )}
              </section>

            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-cighra-darkcard flex gap-3">
              <button onClick={() => setSelectedTicketId(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-tactical tracking-widest  transition-colors border border-slate-200 dark:border-slate-600 flex-1 flex justify-center items-center gap-2">
                <X className="w-4 h-4" /> TUTUP
              </button>
              
              {selectedTicket.status === 'PENDING' && (
                <button onClick={() => onVerify(selectedTicket.db_id)} className="px-4 py-2 bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:hover:bg-cighra-gold/90 text-white dark:text-slate-900 text-[10px] font-tactical tracking-widest  transition-colors flex-1 flex justify-center items-center gap-2 shadow-md">
                  <CheckCircle className="w-4 h-4" /> SETUJUI
                </button>
              )}
              {['DIVERIFIKASI', 'DITERIMA TEKNISI', 'DIPROSES'].includes(selectedTicket.status) && (
                <button onClick={() => onAssignTechnician(selectedTicket.db_id)} className="px-4 py-2 bg-cighra-primary hover:bg-cighra-primary/90 dark:bg-cighra-gold dark:hover:bg-cighra-gold/90 text-white dark:text-slate-900 text-[10px] font-tactical tracking-widest  transition-colors flex-1 flex justify-center items-center gap-2 shadow-md">
                  <User className="w-4 h-4" /> {selectedTicket.perbaikan.teknisi ? 'TUGASKAN ULANG' : 'TUGASKAN TEKNISI'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketManager;

