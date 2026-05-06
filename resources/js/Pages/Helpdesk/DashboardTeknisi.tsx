import React, { useState, useEffect } from 'react';
import { Wrench, MapPin, AlertCircle, Calendar, Send, FileText, ChevronRight, LogOut, Activity, ShieldAlert, CheckCircle2, Menu, X, CircleUser, Shield } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { router, useForm } from '@inertiajs/react';

const DashboardTeknisi = ({ dbCases = [] }: any) => {
  // Zustand Global State
  const currentUser = useStore(state => state.currentUser);
  const logoutAction = useStore(state => state.logout);

  // Ambil tugas yang di-assign ke teknisi ini
  const activeTasks = dbCases.filter((r: any) => r.status === 'PROSES' || r.status === 'PENDING');
  const historyTasks = dbCases.filter((r: any) => r.status === 'SELESAI');

  // States
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const tasksToShow = activeTab === 'ACTIVE' ? activeTasks : historyTasks;
  const filteredTasks = tasksToShow.filter((t: any) => 
    t.kerusakan.barangRusak.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.caseId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-polling untuk real-time sinkronisasi
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases'] });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { data, setData, post, processing, reset, errors } = useForm({
    catatan: '',
    metode: '',
    foto_selesai: null as File | null,
  });

  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const selectedTask = dbCases.find((t: any) => t.db_id === selectedTaskId) || null;

  // Navigation Menu State
  const [activeMenu, setActiveMenu] = useState<'TUGAS'>('TUGAS');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const addNotification = useStore(state => state.addNotification);

  const handleSubmitLaporan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) return;
    
    if (!data.metode) {
      addNotification('PERINGATAN: METODE PERBAIKAN WAJIB DIPILIH.', 'error');
      return;
    }

    post(`/reports/${selectedTaskId}/complete`, {
      onSuccess: () => {
        addNotification('LOG PENANGANAN TELAH DISEROBOT KE SISTEM PUSAT.');
        reset();
        setImagePreview(null);
        setSelectedTaskId(null);
      },
      onError: () => {
        addNotification('GAGAL MENGUNGGAH BAP. CEK PROTOKOL.', 'error');
      }
    });
  };

  const handleLogout = () => {
    logoutAction();
    router.visit('/login');
  };

  const renderDashboard = () => {
    let areaContent;
    if (activeTab === 'HISTORY') {
      areaContent = selectedTask && (
        <div className="space-y-6">
          <h3 className="text-targetred font-tactical font-bold text-lg mb-4 flex items-center gap-2 tracking-widest uppercase">
            <CheckCircle2 className="w-5 h-5" /> RINGKASAN PENYELESAIAN
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Metode Perbaikan</p>
                <p className="text-sm font-bold text-gunmetal dark:text-white bg-gray-200 dark:bg-gray-800 p-3 border-l-4 border-olive uppercase">
                  {selectedTask.perbaikan.metode || 'OFFLINE'}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Catatan Eksekusi</p>
                <div className="text-sm text-gunmetal dark:text-gray-300 bg-white/50 dark:bg-black/30 p-4 border border-gray-300 dark:border-gray-800 italic uppercase">
                  {selectedTask.perbaikan.tindakan || 'TIDAK ADA CATATAN TAMBAHAN.'}
                </div>
              </div>
            </div>
            <div>
               <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Bukti Selesai</p>
               {selectedTask.perbaikan.foto_bukti_selesai ? (
                 <div className="border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden rounded-sm h-48">
                   <img src={selectedTask.perbaikan.foto_bukti_selesai} alt="Bukti Selesai" className="w-full h-full object-cover" />
                 </div>
               ) : (
                 <div className="h-48 border-2 border-dashed border-gray-400 dark:border-gray-700 flex items-center justify-center text-gray-500 font-mono text-[10px] uppercase">
                    FOTO TIDAK DILAMPIRKAN
                 </div>
               )}
            </div>
          </div>
          <div className="pt-6 border-t border-gray-300 dark:border-gray-800 flex justify-between items-center">
            <div className="text-[10px] font-mono text-gray-500 uppercase">
              Penyelesaian: {selectedTask.perbaikan.tanggalSelesai}
            </div>
            <button 
              onClick={() => setSelectedTaskId(null)}
              className="bg-gunmetal dark:bg-gray-800 text-white px-6 py-2 font-tactical font-bold text-xs tracking-widest hover:bg-black transition-colors"
            >
              KEMBALI KE DAFTAR
            </button>
          </div>
        </div>
      );
    } else {
      areaContent = (
        <>
          <h3 className="text-gunmetal dark:text-white font-tactical font-bold text-lg mb-6 flex items-center gap-2 tracking-widest uppercase">
            <FileText className="w-5 h-5 text-olive" />
            FORMAT LAPORAN PENYELESAIAN (BAP)
          </h3>

          <form onSubmit={handleSubmitLaporan} className="space-y-6">
            <div>
              <label className="block text-gray-600 dark:text-gray-400 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
                Catatan Eksekusi & Metode Perbaikan
              </label>
              <textarea
                value={data.catatan}
                onChange={(e) => setData('catatan', e.target.value)}
                required rows={5}
                className={`w-full bg-sand dark:bg-gunmetal border ${errors.catatan ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} text-gunmetal dark:text-white p-4 focus:outline-none focus:border-olive transition-colors font-sans text-sm resize-y uppercase`}
                placeholder="Contoh: Mengganti motor dart dengan nomor seri AX-901B. Melakukan penyesuaian kembali pada koneksi kabel..."
              />
              {errors.catatan && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.catatan}</p>}
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-800 p-4 text-center hover:border-olive transition-all group cursor-pointer relative bg-gray-50/50 dark:bg-black/20">
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  setData('foto_selesai', file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setImagePreview(reader.result as string);
                    reader.readAsDataURL(file);
                  } else {
                    setImagePreview(null);
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center gap-3">
                {imagePreview ? (
                  <div className="relative w-full max-w-[200px] h-32 border-2 border-olive shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                    <img src={imagePreview} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-white font-bold font-mono">GANTI FOTO</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-3">
                      <Activity className="w-5 h-5 text-gray-400 group-hover:text-olive transition-colors" />
                      <span className="text-xs font-mono text-gray-500 group-hover:text-olive uppercase font-bold">
                        UNGGAH FOTO BUKTI SELESAI
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-gray-400 dark:text-gray-600 uppercase">Klik atau tarik file ke area ini</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-gray-600 dark:text-gray-400 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
                  Status Penetapan Tindakan Akhir
                </label>
                <div className="relative">
                  <select
                    value={data.metode}
                    onChange={(e) => setData('metode', e.target.value)}
                    required
                    className={`w-full bg-sand dark:bg-gunmetal border ${!data.metode ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} text-gunmetal dark:text-white p-3.5 focus:outline-none focus:border-olive transition-colors font-tactical font-bold text-base tracking-widest appearance-none pr-10 uppercase`}
                  >
                    <option value="" disabled>--- PILIH METODE PENANGANAN ---</option>
                    <option value="Offline">METODE: OFFLINE (PENANGANAN LANGSUNG)</option>
                    <option value="Online">METODE: ONLINE (AKSES DARING)</option>
                  </select>
                  <ChevronRight className="absolute right-4 top-4 w-5 h-5 text-gray-500 rotate-90 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full bg-olive hover:bg-camogreen text-gunmetal dark:text-white font-tactical font-bold py-3.5 px-6 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {processing ? (
                  <span className="flex items-center gap-2"><span className="w-5 h-5 animate-spin border-2 border-gunmetal dark:border-white border-t-transparent rounded-full" /> MENGUNGGAH...</span>
                ) : (
                  <><CheckCircle2 className="w-5 h-5" /> TANDAI TUGAS SELESAI</>
                )}
              </button>
            </div>
          </form>
        </>
      );
    }

    return (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in mt-6">
        {/* KOLOM KIRI: DAFTAR TUGAS */}
        <div className="xl:col-span-4 space-y-4">
          <div className="bg-white/60 dark:bg-black/60 border-b-2 border-olive p-4 shadow-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-gunmetal dark:text-white font-tactical font-bold tracking-widest text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-olive" /> {activeTab === 'ACTIVE' ? 'TUGAS AKTIF' : 'RIWAYAT SELESAI'}
              </h2>
              <span className="bg-olive text-gunmetal font-bold text-xs px-2 py-1 font-mono">{filteredTasks.length} ENTRI</span>
            </div>
            
            <div className="flex gap-1 bg-gray-200 dark:bg-black p-1 border border-gray-300 dark:border-gray-800">
              <button 
                onClick={() => { setActiveTab('ACTIVE'); setSelectedTaskId(null); }}
                className={`flex-1 py-1.5 text-[10px] font-tactical font-bold transition-all ${activeTab === 'ACTIVE' ? 'bg-olive text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
              >
                SEDANG BERJALAN
              </button>
              <button 
                onClick={() => { setActiveTab('HISTORY'); setSelectedTaskId(null); }}
                className={`flex-1 py-1.5 text-[10px] font-tactical font-bold transition-all ${activeTab === 'HISTORY' ? 'bg-targetred text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
              >
                LOG RIWAYAT
              </button>
            </div>

            <div className="relative">
              <input 
                type="text"
                placeholder="CARI KODE / UNIT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-sand/50 dark:bg-gunmetal/50 border border-gray-300 dark:border-gray-800 p-2 pl-8 text-[10px] font-mono focus:outline-none focus:border-olive uppercase"
              />
              <Activity className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredTasks.length === 0 ? (
              <div className="p-6 border border-gray-300 dark:border-gray-800 bg-white/40 dark:bg-black/40 text-center font-mono text-gray-600 dark:text-gray-500 rounded-sm">
                {searchQuery ? 'TIDAK ADA DATA YANG COCOK.' : 'BELUM ADA LAPORAN KERUSAKAN...'}
              </div>
            ) : (
              filteredTasks.map((task: any) => (
                <div
                  key={task.db_id}
                  onClick={() => setSelectedTaskId(task.db_id)}
                  className={`p-4 border-2 transition-all cursor-pointer rounded-sm group
                    ${selectedTaskId === task.db_id
                      ? 'border-olive bg-gray-200 dark:bg-gray-800 shadow-[inset_4px_0_0_#4b5320]'
                      : 'border-transparent bg-white/60 dark:bg-black/60 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm'
                    }
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-targetred text-white text-[10px] px-2 py-0.5 font-mono font-bold tracking-widest shadow-sm">
                      {task.caseId}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 text-xs font-mono flex items-center gap-1 uppercase">
                      <Calendar className="w-3 h-3 text-olive" /> {task.kerusakan.tanggal.split(',')[0]}
                    </span>
                  </div>

                  <h3 className="text-gunmetal dark:text-white font-tactical text-lg font-bold mb-1 group-hover:text-olive transition-colors leading-tight line-clamp-2 uppercase">
                    {task.kerusakan.barangRusak}
                  </h3>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-300 dark:border-gray-800">
                    <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-xs font-sans">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-olive" />
                      <span className="line-clamp-1 uppercase">{task.kerusakan.lokasi}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* KOLOM KANAN: FORM PELAPORAN */}
        <div className="xl:col-span-8">
          {!selectedTask ? (
            <div className="h-full min-h-[500px] border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white/40 dark:bg-black/20 flex flex-col items-center justify-center rounded-sm text-center p-8">
              <Wrench className="w-20 h-20 text-gray-400 dark:text-gray-700 mb-6 opacity-30" />
              <h3 className="text-gray-600 dark:text-gray-500 font-tactical text-2xl tracking-widest mb-2 uppercase">MODE STANDBY AKTIF</h3>
              <p className="text-gray-600 dark:text-gray-500 font-mono text-sm max-w-md uppercase tracking-tighter">
                Pilih satu laporan kerusakan pada daftar di sebelah kiri untuk meninjau instruksi kerusakan dan menuliskan format Berita Acara Perbaikan (BAP) kepada Staf.
              </p>
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-black/60 border border-gray-300 dark:border-gray-800 shadow-2xl rounded-sm relative overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-olive"></div>

              {/* DETAIL TUGAS PANEL */}
              <div className="p-6 md:p-8 border-b border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-[#1a2024] relative">
                {activeTab === 'HISTORY' && (
                  <div className="absolute top-0 right-0 bg-targetred text-white px-4 py-1 font-tactical font-bold text-[10px] tracking-widest uppercase">
                    ARSIP LAPORAN SELESAI
                  </div>
                )}
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-tactical font-bold text-gunmetal dark:text-white mb-2 leading-none uppercase">
                      {selectedTask.kerusakan.barangRusak}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-[11px] font-mono font-bold text-gray-600 dark:text-gray-400 mt-3">
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-red-900/10 border border-red-900/30 text-targetred uppercase"><AlertCircle className="w-3.5 h-3.5" /> KLASIFIKASI: {selectedTask.kerusakan.urgensi?.toUpperCase() || 'NORMAL'}</span>
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-olive/10 border border-olive/30 text-olive uppercase"><Wrench className="w-3.5 h-3.5" /> LEVEL: {selectedTask.kerusakan.tingkatKerusakan?.toUpperCase() || 'UMUM'}</span>
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gunmetal dark:text-gray-300 uppercase"><MapPin className="w-3.5 h-3.5 text-olive" /> TITIK: {selectedTask.kerusakan.lokasi}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-black px-4 py-2 text-center border shadow-sm border-gray-300 dark:border-gray-700">
                    <div className="text-[9px] font-mono text-gray-500 tracking-widest mb-1 uppercase">KODE REFERENSI</div>
                    <div className="font-mono text-lg font-bold text-gunmetal dark:text-white">{selectedTask.caseId}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="bg-white dark:bg-black/50 p-5 border border-gray-300 dark:border-gray-800 rounded-sm relative">
                    <span className="absolute -top-3 left-4 bg-gray-50 dark:bg-[#1a2024] px-2 text-[10px] font-mono font-bold text-olive border-x border-gray-300 dark:border-gray-800 uppercase">Deskripsi Kendala</span>
                    <p className="text-sm text-gunmetal dark:text-gray-300 font-sans leading-relaxed italic border-l-2 border-gray-300 dark:border-gray-700 pl-4 mt-2 uppercase">
                      {selectedTask.kerusakan.deskripsi}
                    </p>
                    <div className="flex justify-end mt-2">
                      <span className="text-[10px] bg-gray-200 dark:bg-gray-800 px-2 py-1 font-mono text-gray-600 dark:text-gray-400 font-bold uppercase">
                        SUMBER: {selectedTask.kerusakan.pelapor}
                      </span>
                    </div>
                  </div>

                  {selectedTask.kerusakan.fileBukti && selectedTask.kerusakan.fileBukti.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {selectedTask.kerusakan.fileBukti.map((file: string, i: number) => (
                        <div key={i} className="border border-gray-300 dark:border-gray-800 rounded-sm overflow-hidden bg-black flex items-center justify-center group relative h-24">
                          <img src={file} alt={`Bukti ${i}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* AREA FORM / HISTORY VIEW */}
              <div className="p-6 md:p-8 bg-white/40 dark:bg-transparent flex-1">
                {areaContent}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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
            onClick={() => { setActiveMenu('TUGAS'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-6 py-3.5 font-tactical text-sm tracking-wider transition-all border-l-2
              ${activeMenu === 'TUGAS' ? 'bg-gray-200 dark:bg-gray-800/80 text-gunmetal dark:text-white border-olive' : 'border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}
            `}
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5" /> DAFTAR KERUSAKAN
            </div>
            {activeTasks.length > 0 && (
              <span className="bg-targetred text-white text-[10px] w-5 h-5 flex items-center justify-center font-bold font-mono animate-pulse">
                {activeTasks.length}
              </span>
            )}
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gunmetal dark:hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
          </div>

          <div className="flex items-center gap-0 border border-gray-300 dark:border-gray-700 rounded shadow-sm bg-gray-100 dark:bg-gray-900 ml-auto">
            <div className="bg-white dark:bg-black px-4 py-1.5 text-right flex flex-col justify-center">
              <span className="block text-xs font-bold text-gunmetal dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Teknisi Alfa'}</span>
              <span className="block text-[9px] font-mono tracking-widest text-targetred">{currentUser?.id || 'TEKNISI LAPANGAN'}</span>
            </div>
            <div className="w-10 h-full bg-sand dark:bg-gunmetal border-l border-gray-300 dark:border-gray-700 flex items-center justify-center p-2">
              <CircleUser className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar z-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="mb-4 border-b border-gray-300 dark:border-gray-700 pb-4">
              <h2 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white tracking-widest uppercase">
                PORTAL PERBAIKAN DART
              </h2>
              <p className="text-xs font-mono text-gray-600 dark:text-gray-400 mt-1 uppercase tracking-widest">
                Pusat Instruksi & Penyerahan Berita Acara Perbaikan DART
              </p>
            </div>
            {renderDashboard()}
          </div>
        </div>
      </main>

      {/* REMOVED LOCAL NOTIFICATION RENDERER */}
    </div>
  );
};

export default DashboardTeknisi;
