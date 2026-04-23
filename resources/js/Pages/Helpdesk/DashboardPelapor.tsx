<<<<<<< HEAD
import React, { useState } from 'react';
import { Send, History, AlertCircle, Clock, CheckCircle2, ChevronRight, Activity, Camera, LogOut, Shield, FilePlus, Menu, X, CircleUser } from 'lucide-react';
import { useStore, type ReportStatus } from '@/store/useStore';
=======
import React, { useState, useEffect } from 'react';
import { Send, History, AlertCircle, Clock, CheckCircle2, ChevronRight, Activity, Camera, LogOut, Shield, FilePlus } from 'lucide-react';
import { useStore } from '@/store/useStore';
>>>>>>> 6467b13e2edc2594387b86f9a7f8877889317944
import { router } from '@inertiajs/react';

const DashboardPelapor = ({ dbCases = [], dbUnits = [], dbUsers = [] }: any) => {
  const [activeMenu, setActiveMenu] = useState<'FORM' | 'HISTORY'>('FORM');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Ambil state dan aksi dari global store
  const currentUser = useStore(state => state.currentUser);
  const logoutAction = useStore(state => state.logout);

  // Temukan db_id user saat ini berdasarkan username di Zustand
  const dbUser = dbUsers.find((u: any) => u.username === currentUser?.username);

  // Ambil riwayat laporan milik user ini saja
  const history = dbCases.filter((r: any) => r.kerusakan.pelapor === (dbUser?.name || currentUser?.name));

  // Auto-polling untuk real-time sinkronisasi
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases', 'dbUnits', 'dbUsers'], preserveScroll: true, preserveState: true });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // State Input Form
  const [unitId, setUnitId] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // LOGIKA SUBMIT
  // ==========================================
  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/reports', {
      unit_id: unitId,
      deskripsi: deskripsi,
      user_id: dbUser?.db_id
    }, {
      onSuccess: () => {
        setUnitId('');
        setDeskripsi('');
        setIsSubmitting(false);
        alert(`[SYSTEM] Laporan telah ditransmisikan ke Command Center.`);
        setActiveMenu('HISTORY');
      },
      onError: () => setIsSubmitting(false)
    });
  };

  const handleLogout = () => {
    logoutAction();
    router.visit('/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="flex items-center gap-1 text-targetred font-mono text-xs border border-targetred bg-red-900/10 px-2 py-1"><Clock className="w-3 h-3" /> PENDING (MENUNGGU)</span>;
      case 'PROSES':
        return <span className="flex items-center gap-1 text-blue-500 font-mono font-bold text-xs border border-blue-800 bg-blue-900/20 px-2 py-1"><Activity className="w-3 h-3 animate-pulse" /> DIKERJAKAN</span>;
      case 'SELESAI':
        return <span className="flex items-center gap-1 text-green-500 font-mono text-xs border border-green-800 bg-green-900/30 px-2 py-1"><CheckCircle2 className="w-3 h-3" /> SELESAI</span>;
      default:
        return <span className="text-gray-500">{status}</span>;
    }
  };

  const renderForm = () => (
    <div className="bg-white/60 dark:bg-black/60 border-t-2 border-olive border-r border-b border-l border-gray-300 dark:border-gray-800 p-6 shadow-2xl relative overflow-hidden max-w-4xl mx-auto mt-6 animate-in fade-in">
      <div className="mb-6 border-b border-gray-300 dark:border-gray-800 pb-4">
        <h2 className="text-gunmetal dark:text-white font-tactical font-bold text-2xl mb-1 mt-2">FORMULIR KERUSAKAN ASET</h2>
        <p className="text-gray-600 dark:text-gray-400 text-xs font-mono tracking-wide uppercase">ISIKAN BERDASARKAN KONDISI FISIK UNTUK DITERUSKAN KE PUSAT KONTROL</p>
      </div>

      <form onSubmit={handleSubmitNewReport} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-600 dark:text-gray-400 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
              Pilih Unit / Perangkat DART
            </label>
            <select
              required
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              className="w-full bg-sand dark:bg-gunmetal border border-gray-400 dark:border-gray-700 text-gunmetal dark:text-white p-3 focus:outline-none focus:border-olive transition-all font-sans text-sm"
            >
              <option value="">-- PILIH PERANGKAT LAPANGAN --</option>
              {dbUnits.map((u: any) => (
                <option key={u.id} value={u.id}>
                  {u.nomor_seri} - {u.nama_dart} [{u.asal_satuan}]
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-600 dark:text-gray-400 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
            Uraian Kendala Taktis
          </label>
          <textarea
            required rows={5} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
            className="w-full bg-sand dark:bg-gunmetal border border-gray-400 dark:border-gray-700 text-gunmetal dark:text-white p-3 focus:outline-none focus:border-olive transition-all font-sans text-sm resize-y"
            placeholder="Deskripsikan kerusakan secara detail..."
          />
        </div>

        <button type="button" className="w-full border border-dashed border-gray-400 dark:border-gray-600 bg-white/40 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 py-3 rounded-sm text-sm font-tactical tracking-wider flex items-center justify-center gap-2 transition-colors">
          <Camera className="w-4 h-4" /> UNGGAH DOKUMENTASI FISUAL
        </button>

        <div className="pt-4 border-t border-gray-300 dark:border-gray-800">
          <button type="submit" disabled={isSubmitting} className="w-full bg-olive hover:bg-camogreen text-gunmetal dark:text-white font-tactical font-bold py-4 px-6 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center gap-2 shadow-lg disabled:opacity-50">
            {isSubmitting ? (
              <span className="flex items-center gap-2"><span className="w-5 h-5 animate-spin border-2 border-gunmetal dark:border-white border-t-transparent rounded-full" /> TRANSMISI...</span>
            ) : (
              <><Send className="w-5 h-5" /> REKAM & KIRIM KE PUSAT</>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  const renderHistory = () => (
    <div className="max-w-5xl mx-auto space-y-6 mt-6 animate-in fade-in">
      <div className="bg-white/60 dark:bg-black/30 border-b border-gray-300 dark:border-gray-700 p-4 flex justify-between items-end shadow-md">
        <h2 className="text-gray-700 dark:text-gray-300 font-tactical font-bold tracking-widest flex items-center gap-2 text-xl uppercase">
          <History className="text-olive w-6 h-6" /> REKAM JEJAK PELAPORAN
        </h2>
        <span className="text-xs font-mono text-gray-600 dark:text-gray-500">Total: {history.length} Laporan</span>
      </div>

      <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
<<<<<<< HEAD
          <div className="p-8 text-center text-gray-600 font-mono bg-white/40 dark:bg-black/40 border border-gray-300 dark:border-gray-800">
            ANDA BELUM PERNAH MENGAJUKAN LAPORAN APAPUN.
=======
          <div className="p-8 text-center text-gray-600 font-mono bg-white/40 dark:bg-black/40 border border-gray-300 dark:border-gray-800 uppercase">
            BELUM ADA RIWAYAT LAPORAN.
>>>>>>> 6467b13e2edc2594387b86f9a7f8877889317944
          </div>
        ) : (
          history.map((item: any, index: number) => (
            <div key={index} className="relative group">
              <div className="p-5 md:p-6 bg-white/60 dark:bg-black/60 border border-gray-300 dark:border-gray-800 transition-all hover:bg-white/80 dark:hover:bg-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 px-2 py-0.5 font-mono text-xs border border-gray-400 dark:border-gray-700 font-bold uppercase">
                      {item.caseId}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-xs font-mono">{item.kerusakan.tanggal}</span>
                  </div>
                  <h3 className="text-gunmetal dark:text-white font-tactical text-xl drop-shadow-sm border-l-2 border-olive pl-3 font-bold uppercase">
                    {item.kerusakan.barangRusak}
                  </h3>
                  <div className="text-gray-600 dark:text-gray-400 text-sm font-sans pl-3">
                    Lokasi: <span className="text-gray-800 dark:text-gray-200 font-bold">{item.kerusakan.lokasi}</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center justify-between sm:items-end gap-3 min-w-[160px]">
                  {getStatusBadge(item.status)}
                  <button className="text-gray-600 dark:text-gray-400 hover:text-gunmetal dark:hover:text-white transition-colors flex items-center gap-1 text-xs font-tactical font-bold uppercase tracking-widest border border-gray-300 dark:border-gray-700 px-2 py-1 bg-white dark:bg-black shadow-sm">
                    Detail <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand dark:bg-gunmetal flex font-sans selection:bg-olive selection:text-gunmetal relative text-gunmetal dark:text-gray-200">

<<<<<<< HEAD
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

=======
>>>>>>> 6467b13e2edc2594387b86f9a7f8877889317944
      {/* MAN SIDEBAR - TACTICAL */}
      <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-72 bg-white dark:bg-black border-r border-gray-300 dark:border-gray-800 z-50 flex-shrink-0 flex flex-col shadow-2xl`}>
        {/* Brand */}
        <div className="p-6 border-b border-gray-300 dark:border-gray-800 flex items-center gap-4 bg-gray-100 dark:bg-[#111]">
          <div className="relative">
            <img src="/logo.png" alt="DART Logo" className="w-12 h-14 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
          </div>
          <div>
            <h1 className="font-stencil text-2xl tracking-widest text-gunmetal dark:text-white leading-none">HELPDESK DART</h1>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1">
<<<<<<< HEAD
=======
          <p className="px-6 text-[10px] font-mono font-bold tracking-widest text-gray-600 dark:text-gray-500 mb-4 uppercase">MODUL PELAPORAN //:</p>
>>>>>>> 6467b13e2edc2594387b86f9a7f8877889317944

          <button
            onClick={() => setActiveMenu('FORM')}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
              ${activeMenu === 'FORM' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}
            `}
          >
            <FilePlus className="w-5 h-5" /> BUAT LAPORAN BARU
          </button>

          <button
            onClick={() => setActiveMenu('HISTORY')}
            className={`w-full flex items-center gap-3 px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
              ${activeMenu === 'HISTORY' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}
            `}
          >
            <History className="w-5 h-5" /> RIWAYAT STATUS
          </button>
        </nav>

        <div className="p-4 border-t border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-[#111]">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-500 hover:text-targetred hover:bg-red-900/20 font-tactical text-sm tracking-wider transition-all rounded-sm border border-transparent hover:border-targetred/30">
<<<<<<< HEAD
            <LogOut className="w-5 h-5" /> LOGOUT
=======
            <LogOut className="w-5 h-5" /> TERMINASI SESI
>>>>>>> 6467b13e2edc2594387b86f9a7f8877889317944
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] opacity-[0.05] pointer-events-none"></div>
<<<<<<< HEAD

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
              <span className="block text-xs font-bold text-gunmetal dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Pelapor Anonim'}</span>
              <span className="block text-[9px] font-mono tracking-widest text-targetred">{currentUser?.id || 'PELAPOR'}</span>
            </div>
            <div className="w-10 h-full bg-sand dark:bg-gunmetal border-l border-gray-300 dark:border-gray-700 flex items-center justify-center p-2">
              <CircleUser className="w-6 h-6 text-gray-500 dark:text-gray-400" />
=======

        {/* Topbar */}
        <header className="h-16 border-b border-gray-300 dark:border-gray-800 bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-between px-8 flex-shrink-0 z-10 relative">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded-full bg-olive shadow-[0_0_5px_rgba(75,83,32,0.8)] animate-pulse"></div>
            <h2 className="font-mono text-xs text-gray-600 dark:text-gray-400 tracking-widest hidden sm:block uppercase">STATUS PERANGKAT: <span className="text-olive font-bold">ONLINE LAPANGAN</span></h2>
          </div>

          <div className="flex items-center gap-0 border border-gray-300 dark:border-gray-700 rounded shadow-sm bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-black px-4 py-1.5 text-right flex flex-col justify-center">
              <span className="block text-xs font-bold text-gunmetal dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Pelapor Anonim'}</span>
              <span className="block text-[9px] font-mono tracking-widest text-olive uppercase">{currentUser?.role || 'PELAPOR'}</span>
            </div>
            <div className="w-10 h-full bg-sand dark:bg-gunmetal border-l border-gray-300 dark:border-gray-700 flex items-center justify-center p-2">
              <AlertCircle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
>>>>>>> 6467b13e2edc2594387b86f9a7f8877889317944
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto uppercase">
            {activeMenu === 'FORM' ? renderForm() : renderHistory()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPelapor;

