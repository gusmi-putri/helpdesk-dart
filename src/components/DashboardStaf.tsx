import React, { useState } from 'react';
import { UserCog, AlertTriangle, CheckCircle, Clock, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const DashboardStaf: React.FC = () => {
  const navigate = useNavigate();
  const reports = useStore(state => state.reports);
  const users = useStore(state => state.users);
  const assignTechnician = useStore(state => state.assignTechnician);
  const currentUser = useStore(state => state.currentUser);
  
  const [activeTab, setActiveTab] = useState<'MASUK' | 'SELESAI'>('MASUK');
  const [assigningReportId, setAssigningReportId] = useState<string | null>(null);

  const MOCK_TECHNICIANS = users.filter(u => u.role === 'Teknisi');
  
  // ==========================================
  // 2. LOGIKA HANDLER
  // ==========================================
  const handleAssignTechnician = (reportId: string, idTeknisi: string) => {
    assignTechnician(reportId, idTeknisi);
    setAssigningReportId(null);
  };
  
  const handleLogout = () => {
    // navigate('/login') will be handled by App.tsx, but just for backup:
    navigate('/login');
  };

  // Memfilter data berdasarkan tab aktif
  const incomingReports = reports.filter((r) => r.status === 'PENDING' || r.status === 'DIPROSES');
  const completedReports = reports.filter((r) => r.status === 'SELESAI');

  return (
    <div className="pt-24 pb-12 px-4 sm:px-8 xl:px-16 min-h-screen bg-gunmetal relative selection:bg-camogreen selection:text-white">
      
      {/* Background Ornament */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-olive/40 via-transparent to-transparent"></div>
        <div className="w-full h-full bg-[linear-gradient(to_right,#4b532022_1px,transparent_1px),linear-gradient(to_bottom,#4b532022_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-700 pb-6">
          <div>
            <h1 className="text-3xl font-tactical font-bold text-white tracking-widest flex items-center gap-3">
              <UserCog className="text-olive w-8 h-8" />
              COMMAND DASHBOARD - <span className="text-targetred">PANEL STAF</span>
            </h1>
            <p className="text-gray-400 font-mono text-sm mt-1">
              DISPATCHER & TASK MANAGEMENT SYSTEM | KODE OTORISASI: {currentUser?.id}
            </p>
            <button 
              onClick={handleLogout}
              className="mt-3 flex items-center gap-2 text-gray-500 hover:text-white px-3 py-1.5 border border-gray-700 hover:bg-red-900 transition-colors font-tactical text-sm tracking-widest font-bold"
            >
              <LogOut className="w-4 h-4" /> TERMINASI SESI
            </button>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-black/50 border border-olive p-3 flex flex-col items-center min-w-[100px]">
              <span className="text-gray-400 font-tactical text-xs tracking-wider">ANTREAN</span>
              <span className="text-targetred font-mono text-2xl font-bold">{incomingReports.filter(r => r.status === 'PENDING').length}</span>
            </div>
            <div className="bg-black/50 border border-camogreen p-3 flex flex-col items-center min-w-[100px]">
              <span className="text-gray-400 font-tactical text-xs tracking-wider">PROSES</span>
              <span className="text-yellow-500 font-mono text-2xl font-bold">{incomingReports.filter(r => r.status === 'DIPROSES').length}</span>
            </div>
            <div className="bg-black/50 border border-gray-600 p-3 flex flex-col items-center min-w-[100px]">
              <span className="text-gray-400 font-tactical text-xs tracking-wider">SELESAI</span>
              <span className="text-green-500 font-mono text-2xl font-bold">{completedReports.length}</span>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex space-x-2 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('MASUK')}
            className={`px-6 py-3 font-tactical font-bold tracking-wider transition-all rounded-t-sm flex items-center gap-2
              ${activeTab === 'MASUK' 
                ? 'bg-olive text-white border-b-2 border-targetred shadow-[0_-4px_10px_rgba(75,83,32,0.5)]' 
                : 'bg-black/40 text-gray-400 hover:text-white hover:bg-black/60'}
            `}
          >
            <AlertTriangle className="w-4 h-4" />
            LAPORAN MASUK
          </button>
          <button
            onClick={() => setActiveTab('SELESAI')}
            className={`px-6 py-3 font-tactical font-bold tracking-wider transition-all rounded-t-sm flex items-center gap-2
              ${activeTab === 'SELESAI' 
                ? 'bg-olive text-white border-b-2 border-targetred shadow-[0_-4px_10px_rgba(75,83,32,0.5)]' 
                : 'bg-black/40 text-gray-400 hover:text-white hover:bg-black/60'}
            `}
          >
            <CheckCircle className="w-4 h-4" />
            ARSIP KINERJA (SELESAI)
          </button>
        </div>

        {/* TAB CONTENT: LAPORAN MASUK */}
        {activeTab === 'MASUK' && (
          <div className="bg-black/40 border border-gray-700 rounded-sm overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead className="bg-black/80 text-gray-400 border-b border-gray-700 font-tactical tracking-widest text-sm">
                  <tr>
                    <th className="p-4">ID LAPORAN</th>
                    <th className="p-4">ASAL & WAKTU</th>
                    <th className="p-4">RINCIAN KERUSAKAN</th>
                    <th className="p-4">STATUS</th>
                    <th className="p-4">EKSEKUSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {incomingReports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500 font-mono">
                        MANTAP. TIDAK ADA KERUSAKAN BARU YANG DILAPORKAN.
                      </td>
                    </tr>
                  )}
                  {incomingReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-white text-sm bg-black px-2 py-1 border border-gray-700">
                          {report.id}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-bold text-sm">{report.pelapor}</div>
                        <div className="text-gray-500 text-xs font-mono mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {report.tanggalLapor}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white text-sm">{report.barangRusak}</div>
                        <div className="text-gray-500 text-xs mt-1">LOK: {report.lokasi}</div>
                      </td>
                      <td className="p-4">
                        {report.status === 'PENDING' ? (
                          <span className="bg-targetred text-white text-xs px-2 py-1 font-mono tracking-widest flex inline-flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> PENDING
                          </span>
                        ) : (
                          <span className="bg-yellow-600 text-black font-bold text-xs px-2 py-1 font-mono tracking-widest w-fit">
                            DIPROSES
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                         {report.status === 'PENDING' ? (
                           <div className="relative">
                             {assigningReportId === report.id ? (
                               <div className="bg-black border border-olive p-3 rounded-sm absolute right-0 top-0 w-64 z-20 shadow-2xl">
                                  <h4 className="text-gray-400 text-xs font-tactical mb-2">PILIH TEKNISI:</h4>
                                  <div className="space-y-1">
                                    {MOCK_TECHNICIANS.map(tek => (
                                      <button 
                                        key={tek.id}
                                        onClick={() => handleAssignTechnician(report.id, tek.id)}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-olive hover:text-white transition-colors flex justify-between items-center group"
                                      >
                                        <span>{tek.name}</span>
                                        <span className="text-[10px] bg-black/50 px-1 border border-gray-700 group-hover:border-white/30">{tek.id}</span>
                                      </button>
                                    ))}
                                  </div>
                                  <button 
                                    onClick={() => setAssigningReportId(null)}
                                    className="mt-2 w-full text-xs text-gray-500 hover:text-white py-1 border border-gray-800"
                                  >
                                    BATAL
                                  </button>
                               </div>
                             ) : (
                               <button 
                                 onClick={() => setAssigningReportId(report.id)}
                                 className="bg-transparent border border-olive text-olive hover:bg-olive hover:text-white px-4 py-2 font-tactical text-sm font-bold tracking-widest transition-all"
                               >
                                 TUGASKAN
                               </button>
                             )}
                           </div>
                         ) : (
                           <div className="text-gray-400 text-xs font-mono">
                             Ditugaskan: <br/>
                             <span className="text-white font-bold">
                               {MOCK_TECHNICIANS.find(t => t.id === report.idTeknisi)?.name}
                             </span>
                           </div>
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: LAPORAN SELESAI */}
        {activeTab === 'SELESAI' && (
          <div className="bg-black/40 border border-gray-700 rounded-sm overflow-hidden shadow-xl">
             <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                <thead className="bg-black/80 text-gray-400 border-b border-gray-700 font-tactical tracking-widest text-sm">
                  <tr>
                    <th className="p-4 w-32">ID LAPORAN</th>
                    <th className="p-4">DETAIL KERUSAKAN</th>
                    <th className="p-4">PELAKSANA (TEKNISI)</th>
                    <th className="p-4">CATATAN PERBAIKAN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {completedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-gray-400 text-sm bg-black px-2 py-1 border border-gray-700 line-through decoration-targetred">
                          {report.id}
                        </span>
                        <div className="mt-2 text-green-500 text-[10px] font-mono font-bold flex items-center gap-1">
                           <CheckCircle className="w-3 h-3" /> CLEAR
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white text-sm line-clamp-1">{report.barangRusak}</div>
                        <div className="text-gray-500 text-xs font-mono mt-1 w-full max-w-sm">
                            Masuk: {report.tanggalLapor} <br/>
                            Selesai: <span className="text-white">{report.waktuPenyelesaian || '-'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                         <div className="text-gray-300 text-sm font-bold">
                           {MOCK_TECHNICIANS.find(t => t.id === report.idTeknisi)?.name}
                         </div>
                         <div className="text-gray-600 text-xs font-mono">
                           ID: {report.idTeknisi}
                         </div>
                      </td>
                      <td className="p-4">
                         <div className="bg-black/60 p-3 border-l-2 border-green-700 text-sm text-gray-300 italic font-serif relative">
                           <span className="absolute -top-2 -left-2 text-2xl text-gray-600">"</span>
                           {report.catatanTeknisi}
                           <span className="absolute -bottom-4 -right-1 text-2xl text-gray-600">"</span>
                         </div>
                      </td>
                    </tr>
                  ))}
                  {completedReports.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 font-mono">
                        BELUM ADA DATA ARSIP PERBAIKAN YANG DISELESAIKAN.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardStaf;
