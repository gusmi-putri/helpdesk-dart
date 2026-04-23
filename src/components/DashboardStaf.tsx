import React, { useState } from 'react';
import { UserCog, AlertTriangle, CheckCircle, Clock, LogOut, ShieldAlert, Users, Database, Shield, Activity } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const DashboardStaf: React.FC = () => {
  const navigate = useNavigate();
  const reports = useStore(state => state.reports);
  const users = useStore(state => state.users);
  const assignTechnician = useStore(state => state.assignTechnician);
  const currentUser = useStore(state => state.currentUser);
  const logoutAction = useStore(state => state.logout);
  
  const [activeMenu, setActiveMenu] = useState<'MASUK' | 'SELESAI'>('MASUK');
  const [assigningReportId, setAssigningReportId] = useState<string | null>(null);

  const MOCK_TECHNICIANS = users.filter(u => u.role === 'Teknisi');
  
  const handleAssignTechnician = (reportId: string, idTeknisi: string) => {
    assignTechnician(reportId, idTeknisi);
    setAssigningReportId(null);
  };
  
  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  const incomingReports = reports.filter((r) => r.status === 'PENDING' || r.status === 'DIPROSES');
  const completedReports = reports.filter((r) => r.status === 'SELESAI');

  const renderMasuk = () => (
    <div className="animate-in fade-in space-y-6 mt-6">
      <div className="flex gap-4">
        <div className="bg-white/60 dark:bg-black/60 border border-targetred p-4 flex-1 shadow-md">
          <span className="text-gray-600 dark:text-gray-400 font-tactical text-xs tracking-wider block mb-1">ANTREAN PENDING</span>
          <span className="text-targetred font-mono text-3xl font-bold">{incomingReports.filter(r => r.status === 'PENDING').length}</span>
        </div>
        <div className="bg-white/60 dark:bg-black/60 border border-blue-600 p-4 flex-1 shadow-md">
          <span className="text-gray-600 dark:text-gray-400 font-tactical text-xs tracking-wider block mb-1">SEDANG DIPROSES</span>
          <span className="text-blue-500 font-mono text-3xl font-bold">{incomingReports.filter(r => r.status === 'DIPROSES').length}</span>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 rounded-sm overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-[#1a2024] flex items-center justify-between text-white">
          <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500"/> LAPORAN DALAM PENANGANAN STAFF</h3>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left font-sans">
            <thead className="bg-[#1a2024] text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700 font-tactical tracking-widest text-xs">
              <tr>
                <th className="p-4">ID LAPORAN</th>
                <th className="p-4">ASAL & WAKTU</th>
                <th className="p-4">RINCIAN KERUSAKAN</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 text-center">DISPATCH TEKNISI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-800">
              {incomingReports.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-600 dark:text-gray-500 font-mono">
                    TIDAK ADA ANTRIAN LAPORAN.
                  </td>
                </tr>
              )}
              {incomingReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors text-gunmetal dark:text-white">
                  <td className="p-4">
                    <span className="font-mono font-bold text-sm bg-white dark:bg-black px-2 py-1 border border-gray-300 dark:border-gray-700 block text-center w-fit">
                      {report.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm">{report.pelapor}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs font-mono mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {report.tanggalLapor}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold mb-1">{report.barangRusak}</div>
                    <div className="text-gray-700 dark:text-gray-400 text-xs">LOK: {report.lokasi}</div>
                  </td>
                  <td className="p-4">
                    {report.status === 'PENDING' ? (
                      <span className="bg-red-900/20 text-targetred border border-targetred text-[10px] px-2 py-1 font-mono tracking-widest flex items-center gap-1 w-fit shadow-inner">
                        <span className="w-1.5 h-1.5 rounded-full bg-targetred animate-pulse block"></span> PENDING (UNASSIGNED)
                      </span>
                    ) : (
                      <span className="bg-blue-900/20 text-blue-500 border border-blue-800 text-[10px] font-bold px-2 py-1 font-mono tracking-widest w-fit flex items-center gap-1">
                        <Activity className="w-3 h-3" /> DIPROSES TEKNISI
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                      {report.status === 'PENDING' ? (
                        <div className="relative inline-block w-full">
                          {assigningReportId === report.id ? (
                            <div className="bg-white dark:bg-[#1a2024] border border-olive p-2 rounded-sm absolute right-0 top-0 w-64 z-20 shadow-2xl text-left">
                              <h4 className="text-gray-600 dark:text-gray-400 text-xs font-tactical mb-2">PILIH PERSONEL TEKNISI:</h4>
                              <div className="space-y-1">
                                {MOCK_TECHNICIANS.map(tek => (
                                  <button 
                                    key={tek.id}
                                    onClick={() => handleAssignTechnician(report.id, tek.id)}
                                    className="w-full text-left px-3 py-2 text-xs text-gunmetal dark:text-white bg-gray-100 hover:bg-olive dark:bg-black dark:hover:bg-olive hover:text-gunmetal font-bold transition-colors flex justify-between items-center"
                                  >
                                    <span>{tek.name}</span>
                                    <span className="font-mono text-[10px] text-gray-500">{tek.id}</span>
                                  </button>
                                ))}
                              </div>
                              <button 
                                onClick={() => setAssigningReportId(null)}
                                className="mt-2 w-full text-[10px] text-gray-600 hover:text-targetred py-1 border border-transparent hover:border-targetred/30 transition-colors font-tactical tracking-widest"
                              >
                                [ BATALKAN ASSIGNMENT ]
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setAssigningReportId(report.id)}
                              className="bg-targetred hover:bg-red-800 text-white w-full py-2 flex items-center justify-center font-tactical text-[11px] font-bold tracking-widest transition-all shadow-md"
                            >
                              TUGASKAN TEKNISI SEKARANG
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-600 dark:text-gray-400 text-[10px] font-mono border border-gray-300 dark:border-gray-800 p-2 bg-gray-100 dark:bg-[#111]">
                          [ TEKNISI DITUGASKAN ] <br/>
                          <span className="text-blue-600 dark:text-blue-400 font-bold block mt-1 text-xs">
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
    </div>
  );

  const renderSelesai = () => (
    <div className="animate-in fade-in space-y-6 mt-6">
      <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 rounded-sm overflow-hidden shadow-xl">
          <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#1a2024] flex items-center justify-between text-gunmetal dark:text-white">
            <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500"/> ARSIP PENYELESAIAN (SELESAI)</h3>
          </div>
          <div className="overflow-x-auto p-2">
          <table className="w-full text-left font-sans">
            <thead className="bg-[#1a2024] text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700 font-tactical tracking-widest text-xs">
              <tr>
                <th className="p-4 w-32">ID LAPORAN</th>
                <th className="p-4">DETAIL KERUSAKAN</th>
                <th className="p-4">PELAKSANA (TEKNISI)</th>
                <th className="p-4">CATATAN PERBAIKAN DARI TEKNISI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-800 text-gunmetal dark:text-white">
              {completedReports.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-600 dark:text-gray-500 font-mono">
                    BELUM ADA DATA ARSIP PERBAIKAN YANG DISELESAIKAN HARI INI.
                  </td>
                </tr>
              )}
              {completedReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-gray-600 dark:text-gray-400 text-sm bg-white dark:bg-black px-2 py-1 border border-gray-300 dark:border-gray-700 block w-fit">
                      {report.id}
                    </span>
                    <div className="mt-2 text-green-600 dark:text-green-500 text-[10px] font-mono font-bold flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> BERHASIL CLEAR
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm mb-1">{report.barangRusak}</div>
                    <div className="text-gray-700 dark:text-gray-400 text-xs font-mono w-full max-w-sm">
                        Masuk: {report.tanggalLapor} <br/>
                        Selesai: <span className="text-gunmetal dark:text-white font-bold">{report.waktuPenyelesaian || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                      <div className="text-sm font-bold">
                        {MOCK_TECHNICIANS.find(t => t.id === report.idTeknisi)?.name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-500 text-[10px] font-mono mt-1">
                        KODE OP: {report.idTeknisi}
                      </div>
                  </td>
                  <td className="p-4">
                      <div className="bg-white dark:bg-black/50 p-4 border-l-4 border-green-700 text-sm text-gray-800 dark:text-gray-300 relative shadow-inner">
                        <span className="absolute top-1 left-2 text-xl text-gray-400 dark:text-gray-600 font-serif">"</span>
                        <span className="pl-4 block italic font-serif leading-relaxed">{report.catatanTeknisi}</span>
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

  return (
    <div className="min-h-screen bg-sand dark:bg-gunmetal flex font-sans selection:bg-olive selection:text-gunmetal relative text-gunmetal dark:text-gray-200">
      {/* MAN SIDEBAR - TACTICAL */}
      <aside className="w-72 bg-white dark:bg-black border-r border-gray-300 dark:border-gray-800 relative z-20 flex-shrink-0 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-gray-300 dark:border-gray-800 flex items-center gap-4 bg-gray-100 dark:bg-[#111]">
          <div className="relative">
            <UserCog className="w-10 h-10 text-olive" />
          </div>
          <div>
            <h1 className="font-stencil text-2xl tracking-widest text-gunmetal dark:text-white leading-none">DART</h1>
            <span className="text-[10px] font-mono text-gray-600 dark:text-gray-500 block mt-1 tracking-widest uppercase">DISPATCHER KOMANDO</span>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1">
          <p className="px-6 text-[10px] font-mono font-bold tracking-widest text-gray-600 dark:text-gray-500 mb-4">MODUL PENGENDALIAN //:</p>
          
          <button 
            onClick={() => setActiveMenu('MASUK')}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
              ${activeMenu === 'MASUK' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}
            `}
          >
            <AlertTriangle className="w-5 h-5" /> PENUGASAN (ANTREAN)
         </button>

         <button 
            onClick={() => setActiveMenu('SELESAI')}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
              ${activeMenu === 'SELESAI' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}
            `}
          >
            <CheckCircle className="w-5 h-5" /> REKAP ARSIP SELESAI
         </button>
        </nav>

        <div className="p-4 border-t border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-[#111]">
           <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-500 hover:text-targetred hover:bg-red-900/20 font-tactical text-sm tracking-wider transition-all rounded-sm border border-transparent hover:border-targetred/30">
              <LogOut className="w-5 h-5" /> TERMINASI SESI
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>
        
        {/* Topbar */}
        <header className="h-16 border-b border-gray-300 dark:border-gray-800 bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0 z-10 relative">
           <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-olive shadow-[0_0_5px_rgba(75,83,32,0.8)] animate-pulse"></div>
             <h2 className="font-mono text-xs text-gray-600 dark:text-gray-400 tracking-widest hidden sm:block">STATUS OTORISASI: <span className="text-olive font-bold">LEVEL STAF KOMANDO</span></h2>
           </div>

           <div className="flex items-center gap-0 border border-gray-300 dark:border-gray-700 rounded shadow-sm bg-gray-100 dark:bg-gray-900">
             <div className="bg-white dark:bg-black px-4 py-1.5 text-right flex flex-col justify-center">
               <span className="block text-xs font-bold text-gunmetal dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Staf Admin'}</span>
               <span className="block text-[9px] font-mono tracking-widest text-olive">{currentUser?.role || 'STAF LOGISTIK'}</span>
             </div>
             <div className="w-10 h-full bg-sand dark:bg-gunmetal border-l border-gray-300 dark:border-gray-700 flex items-center justify-center p-2">
               <ShieldAlert className="w-4 h-4 text-gray-500 dark:text-gray-400" />
             </div>
           </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">
             {/* Dynamic Heading based on active menu */}
             <div className="mb-6 flex justify-between items-end border-b border-gray-300 dark:border-gray-700 pb-4">
                <div>
                   <h2 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white tracking-widest">
                     {activeMenu === 'MASUK' ? 'MODUL PENUGASAN TEKNISI' : 'ARSIP DOKUMEN PENYELESAIAN'}
                   </h2>
                   <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-1 uppercase">
                     Sistem Manajemen dan Penyaluran Tiket Kerusakan Aset.
                   </p>
                </div>
             </div>
             
             {activeMenu === 'MASUK' ? renderMasuk() : renderSelesai()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardStaf;
