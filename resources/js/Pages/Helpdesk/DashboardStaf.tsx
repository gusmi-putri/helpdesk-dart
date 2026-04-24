import React, { useState, useEffect } from 'react';
import { UserCog, AlertTriangle, CheckCircle, Clock, LogOut, ShieldAlert, Users, Database, Shield, Activity, Menu, X, CircleUser } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { router } from '@inertiajs/react';

const DashboardStaf = ({ dbCases = [], dbUsers = [] }: any) => {
  const currentUser = useStore(state => state.currentUser);
  const logoutAction = useStore(state => state.logout);

  const [activeMenu, setActiveMenu] = useState<'MASUK' | 'SELESAI'>('MASUK');
  const [assigningReportId, setAssigningReportId] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Auto-polling untuk real-time sinkronisasi
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases', 'dbUsers'] });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAssignTechnician = (reportId: number, idTeknisi: number) => {
    router.post(`/reports/${reportId}/handle`, { teknisi_id: idTeknisi }, {
      onSuccess: () => {
        setAssigningReportId(null);
        alert('Teknisi berhasil ditugaskan ke lapangan!');
      }
    });
  };

  const handleLogout = () => {
    logoutAction();
    router.visit('/login');
  };

  const incomingReports = dbCases.filter((r: any) => r.status === 'PENDING' || r.status === 'PROSES');
  const completedReports = dbCases.filter((r: any) => r.status === 'SELESAI');

  const renderMasuk = () => (
    <div className="animate-in fade-in space-y-6 mt-6">
      <div className="flex gap-4">
        <div className="bg-white/60 dark:bg-black/60 border border-targetred p-4 flex-1 shadow-md">
          <span className="text-gray-600 dark:text-gray-400 font-tactical text-xs tracking-wider block mb-1 uppercase">ANTREAN PENDING</span>
          <span className="text-targetred font-mono text-3xl font-bold">{incomingReports.filter((r: any) => r.status === 'PENDING').length}</span>
        </div>
        <div className="bg-white/60 dark:bg-black/60 border border-blue-600 p-4 flex-1 shadow-md">
          <span className="text-gray-600 dark:text-gray-400 font-tactical text-xs tracking-wider block mb-1 uppercase">SEDANG DIPROSES</span>
          <span className="text-blue-500 font-mono text-3xl font-bold">{incomingReports.filter((r: any) => r.status === 'PROSES').length}</span>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-700 rounded-sm overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-[#1a2024] flex items-center justify-between text-white">
          <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" /> LAPORAN DALAM PENANGANAN STAFF</h3>
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
              {incomingReports.map((report: any) => (
                <tr key={report.db_id} className="hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors text-gunmetal dark:text-white">
                  <td className="p-4">
                    <span className="font-mono font-bold text-sm bg-white dark:bg-black px-2 py-1 border border-gray-300 dark:border-gray-700 block text-center w-fit">
                      {report.caseId}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm">{report.kerusakan.pelapor}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs font-mono mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {report.kerusakan.tanggal}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold mb-1">{report.kerusakan.barangRusak}</div>
                    <div className="text-gray-700 dark:text-gray-400 text-xs">LOK: {report.kerusakan.lokasi}</div>
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
                        {assigningReportId === report.db_id ? (
                          <div className="bg-white dark:bg-[#1a2024] border border-olive p-2 rounded-sm absolute right-0 top-0 w-64 z-20 shadow-2xl text-left">
                            <h4 className="text-gray-600 dark:text-gray-400 text-xs font-tactical mb-2 uppercase">PILIH PERSONEL TEKNISI:</h4>
                            <div className="space-y-1">
                              {dbUsers.filter((u: any) => u.role === 'Teknisi').map((tek: any) => (
                                <button
                                  key={tek.id}
                                  onClick={() => handleAssignTechnician(report.db_id, tek.db_id)}
                                  className="w-full text-left px-3 py-2 text-xs text-gunmetal dark:text-white bg-gray-100 hover:bg-olive dark:bg-black dark:hover:bg-olive hover:text-gunmetal font-bold transition-colors flex justify-between items-center"
                                >
                                  <span>{tek.name}</span>
                                  <span className="font-mono text-[10px] text-gray-500">{tek.id}</span>
                                </button>
                              ))}
                            </div>
                            <button
                              onClick={() => setAssigningReportId(null)}
                              className="mt-2 w-full text-[10px] text-gray-600 hover:text-targetred py-1 border border-transparent hover:border-targetred/30 transition-colors font-tactical tracking-widest uppercase"
                            >
                              [ BATALKAN ]
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAssigningReportId(report.db_id)}
                            className="bg-targetred hover:bg-red-800 text-white w-full py-2 flex items-center justify-center font-tactical text-[11px] font-bold tracking-widest transition-all shadow-md uppercase"
                          >
                            TUGASKAN TEKNISI
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-600 dark:text-gray-400 text-[10px] font-mono border border-gray-300 dark:border-gray-800 p-2 bg-gray-100 dark:bg-[#111]">
                        [ TEKNISI DITUGASKAN ] <br />
                        <span className="text-blue-600 dark:text-blue-400 font-bold block mt-1 text-xs uppercase">
                          {report.perbaikan.teknisi}
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
          <h3 className="font-tactical tracking-widest text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> ARSIP PENYELESAIAN (SELESAI) </h3>
        </div>
        <div className="overflow-x-auto p-2">
          <table className="w-full text-left font-sans">
            <thead className="bg-[#1a2024] text-gray-600 dark:text-gray-400 border-b border-gray-300 dark:border-gray-700 font-tactical tracking-widest text-xs">
              <tr>
                <th className="p-4 w-32">ID LAPORAN</th>
                <th className="p-4">DETAIL KERUSAKAN</th>
                <th className="p-4">PELAKSANA (TEKNISI)</th>
                <th className="p-4">CATATAN PERBAIKAN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-800 text-gunmetal dark:text-white">
              {completedReports.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-600 dark:text-gray-500 font-mono">
                    BELUM ADA DATA ARSIP PERBAIKAN.
                  </td>
                </tr>
              )}
              {completedReports.map((report: any) => (
                <tr key={report.db_id} className="hover:bg-gray-200 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="p-4">
                    <span className="font-mono text-gray-600 dark:text-gray-400 text-sm bg-white dark:bg-black px-2 py-1 border border-gray-300 dark:border-gray-700 block w-fit">
                      {report.caseId}
                    </span>
                    <div className="mt-2 text-green-600 dark:text-green-500 text-[10px] font-mono font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> BERHASIL CLEAR
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-sm mb-1 uppercase">{report.kerusakan.barangRusak}</div>
                    <div className="text-gray-700 dark:text-gray-400 text-xs font-mono w-full max-w-sm uppercase">
                      Masuk: {report.kerusakan.tanggal} <br />
                      Selesai: <span className="text-gunmetal dark:text-white font-bold">{report.perbaikan.tanggalPenanganan || '-'}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-bold uppercase">
                      {report.perbaikan.teknisi}
                    </div>
                    <div className="text-gray-600 dark:text-gray-500 text-[10px] font-mono mt-1 uppercase">
                      KODE OP: {report.db_id}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="bg-white dark:bg-black/50 p-4 border-l-4 border-green-700 text-sm text-gray-800 dark:text-gray-300 relative shadow-inner">
                      <span className="absolute top-1 left-2 text-xl text-gray-400 dark:text-gray-600 font-serif">"</span>
                      <span className="pl-4 block italic font-serif leading-relaxed uppercase">{report.perbaikan.tindakan}</span>
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
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAN SIDEBAR - TACTICAL */}
      <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-white dark:bg-black border-r border-gray-300 dark:border-gray-800 z-50 flex-shrink-0 flex flex-col shadow-2xl`}>
        <div className="p-6 border-b border-gray-300 dark:border-gray-800 flex items-center gap-4 bg-gray-100 dark:bg-[#111]">
          <div className="relative">
            <img src="/logo.png" alt="DART Logo" className="w-12 h-14 object-contain" />
          </div>
          <div>
            <h1 className="font-stencil text-2xl tracking-widest text-gunmetal dark:text-white leading-none">HELPDESK-DART</h1>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1">

          <button
            onClick={() => { setActiveMenu('MASUK'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
              ${activeMenu === 'MASUK' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'}
            `}
          >
            <AlertTriangle className="w-5 h-5" /> PENUGASAN (ANTREAN)
          </button>

          <button
            onClick={() => { setActiveMenu('SELESAI'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
              ${activeMenu === 'SELESAI' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive' : 'border-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900'}
            `}
          >
            <CheckCircle className="w-5 h-5" /> REKAP ARSIP SELESAI
          </button>
        </nav>

        <div className="p-4 border-t border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-[#111]">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-500 hover:text-targetred hover:bg-red-900/20 font-tactical text-sm tracking-wider transition-all rounded-sm border border-transparent hover:border-targetred/30">
            <LogOut className="w-5 h-5" /> LOGOUT
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>

        {/* Topbar */}
        <header className="h-16 border-b border-gray-300 dark:border-gray-800 bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-10 relative">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gunmetal dark:hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-0 border border-gray-300 dark:border-gray-700 rounded shadow-sm bg-gray-100 dark:bg-gray-900 ml-auto">
            <div className="bg-white dark:bg-black px-4 py-1.5 text-right flex flex-col justify-center">
              <span className="block text-xs font-bold text-gunmetal dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Staf Admin'}</span>
              <span className="block text-[9px] font-mono tracking-widest text-targetred">{currentUser?.id || 'STAF LOGISTIK'}</span>
            </div>
            <div className="w-10 h-full bg-sand dark:bg-gunmetal border-l border-gray-300 dark:border-gray-700 flex items-center justify-center p-2">
              <CircleUser className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">
            {/* Dynamic Heading based on active menu */}
            <div className="mb-6 flex justify-between items-end border-b border-gray-300 dark:border-gray-700 pb-4">
              <div>
                <h2 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white tracking-widest uppercase">
                  {activeMenu === 'MASUK' ? 'MODUL PENUGASAN TEKNISI' : 'ARSIP DOKUMEN PENYELESAIAN'}
                </h2>
                <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-1 uppercase tracking-widest">
                  Sistem Manajemen Pelaporan Kerusakan Dart.
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
