import React, { useState, useEffect } from 'react';
import { Wrench, MapPin, AlertCircle, Calendar, Send, FileText, ChevronRight, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const DashboardTeknisi: React.FC = () => {
  const navigate = useNavigate();

  // Zustand Global State
  const currentUser = useStore(state => state.currentUser);
  const reports = useStore(state => state.reports);
  const completeReport = useStore(state => state.completeReport);
  const markReportAsViewed = useStore(state => state.markReportAsViewed);
  const logoutAction = useStore(state => state.logout);

  // Ambil tugas yang di-assign ke teknisi ini dan statusnya masih DIPROSES
  const tasks = reports.filter(r => r.idTeknisi === currentUser?.id && r.status === 'DIPROSES');

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null;

  // State untuk form
  const [catatan, setCatatan] = useState('');
  const [statusAkhir, setStatusAkhir] = useState('Selesai Sepenuhnya');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // 2. LIFECYCLE & NOTIFIKASI
  // ==========================================
  useEffect(() => {
    const hasUnviewedTask = tasks.some(t => t.isNewUpdate);
    if (hasUnviewedTask) {
      alert("⚠️ PERHATIAN TEKNISI: Anda memiliki Instruksi Tugas Perbaikan Baru dari Staf Command Center!");
      tasks.filter(t => t.isNewUpdate).forEach(t => markReportAsViewed(t.id));
    }
  }, [tasks, markReportAsViewed]);

  // ==========================================
  // 3. LOGIKA FORM
  // ==========================================
  const handleSubmitLaporan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    setIsSubmitting(true);

    // Simulasi pengiriman data
    setTimeout(() => {
      completeReport(selectedTask.id, catatan, statusAkhir);
      
      alert(`Berhasil! Laporan Penanganan untuk ${selectedTask.id} telah dicatat di database sistem.`);

      setCatatan('');
      setStatusAkhir('Selesai Sepenuhnya');
      setSelectedTaskId(null);
      setIsSubmitting(false);

    }, 600);
  };
  
  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-8 xl:px-16 min-h-screen bg-gunmetal relative selection:bg-targetred selection:text-white flex flex-col items-center">
      
      {/* Background Ornament */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[repeating-radial-gradient(circle_at_0_0,transparent_0,#4b5320_20px),repeating-linear-gradient(#2a3439,#2a3439)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl">
        
        {/* HEADER TRANSAKSI */}
        <div className="border-l-4 border-targetred pl-4 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-tactical font-bold text-white tracking-widest flex items-center gap-3">
              <Wrench className="w-7 h-7 text-targetred" />
              WORKSHOP - KENDALI TEKNISI
            </h1>
            <p className="text-gray-400 font-mono text-sm mt-1 uppercase">
              Data Otorisasi: {currentUser?.id} ({currentUser?.name}) | Sektor Aktif: Zona Merah
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-white px-3 py-1.5 border border-gray-700 hover:bg-red-900 transition-colors font-tactical text-sm tracking-widest font-bold"
          >
            <LogOut className="w-4 h-4" /> TERMINASI SESI
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* KOLOM KIRI: DAFTAR TUGAS (TASK CARDS) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-black/60 border-b-2 border-olive p-3 flex justify-between items-center">
              <h2 className="text-olive font-tactical font-bold tracking-widest text-lg">PROGRES TAHANAN ({tasks.length})</h2>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.length === 0 ? (
                <div className="p-6 border border-gray-800 bg-black/40 text-center font-mono text-gray-500 rounded-sm">
                  TIDAK ADA TUGAS AKTIF. BERSANTAILAH, PRAJURIT.
                </div>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id} 
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`p-4 border-2 transition-all cursor-pointer rounded-sm group
                      ${selectedTask?.id === task.id 
                        ? 'border-camogreen bg-[#4b5320]/20 shadow-[0_0_15px_rgba(85,107,47,0.3)]' 
                        : 'border-gray-800 bg-black/60 hover:border-olive hover:bg-black/80'
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <span className="bg-targetred text-white text-[10px] px-2 py-0.5 font-mono font-bold">
                         {task.id}
                       </span>
                       <span className="text-gray-500 text-xs font-mono flex items-center gap-1">
                         <Calendar className="w-3 h-3" /> {task.tanggalLapor?.split(',')[0]}
                       </span>
                    </div>
                    
                    <h3 className="text-white font-tactical text-xl font-bold mb-1 group-hover:text-camogreen transition-colors">
                      {task.barangRusak}
                    </h3>
                    
                    <div className="flex items-start gap-1 text-gray-400 text-xs font-sans mb-3">
                      <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{task.lokasi}</span>
                    </div>

                    <button className="w-full py-2 bg-gray-800 text-gray-300 font-tactical text-sm tracking-wider font-bold group-hover:bg-olive group-hover:text-white transition-colors flex justify-center items-center gap-1">
                      CEK DETAIL <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* KOLOM KANAN: FORM PELAPORAN KERJA */}
          <div className="lg:col-span-2">
            {!selectedTask ? (
              <div className="h-full min-h-[400px] border-2 border-dashed border-gray-700 bg-black/20 flex flex-col items-center justify-center rounded-sm">
                <Wrench className="w-16 h-16 text-gray-700 mb-4 opacity-50" />
                <p className="text-gray-500 font-mono uppercase tracking-widest text-center px-4">
                  PILIH TUGAS DARI PANEL KIRI UNTUK MEMBACA INSTRUKSI <br/>& MEMBUAT LAPORAN PENYELESAIAN.
                </p>
              </div>
            ) : (
              <div className="bg-black/80 border border-olive shadow-2xl rounded-sm rounded-tl-none relative overflow-hidden">
                {/* Accent lines */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-targetred to-olive"></div>
                
                {/* DETAIL TUGAS PANEL */}
                <div className="p-6 md:p-8 border-b border-gray-800">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-tactical font-bold text-white mb-2">
                        {selectedTask.barangRusak}
                      </h2>
                      <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400">
                        <span className="flex items-center gap-1.5"><AlertCircle className="w-4 h-4 text-targetred" /> Prioritas Tinggi</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-olive" /> {selectedTask.lokasi}</span>
                      </div>
                    </div>
                    <span className="bg-gray-800 px-3 py-1 text-gray-300 font-mono text-sm border border-gray-600 block">
                      {selectedTask.id}
                    </span>
                  </div>

                  <div className="bg-gunmetal/50 p-4 border-l-2 border-targetred rounded-r-sm">
                    <p className="text-sm text-gray-300 font-sans leading-relaxed">
                      <span className="text-targetred font-bold block mb-1">KELUHAN LAPANGAN:</span>
                      "{selectedTask.deskripsi}"
                    </p>
                    <p className="text-xs text-gray-500 font-mono mt-3 uppercase">
                      — DILAPORKAN OLEH: {selectedTask.pelapor}
                    </p>
                  </div>
                </div>

                {/* AREA FORM */}
                <div className="p-6 md:p-8 bg-black/60">
                  <h3 className="text-olive font-tactical font-bold text-xl mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    FORM LHK (LAPORAN HASIL KERJA)
                  </h3>

                  <form onSubmit={handleSubmitLaporan} className="space-y-6">
                    <div>
                      <label className="block text-gray-400 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
                        Rincian Tindakan Perbaikan
                      </label>
                      <textarea
                        value={catatan}
                        onChange={(e) => setCatatan(e.target.value)}
                        required
                        rows={4}
                        className="w-full bg-gunmetal border border-gray-700 text-white p-4 focus:outline-none focus:border-camogreen focus:ring-1 focus:ring-camogreen transition-colors font-sans text-sm resize-y"
                        placeholder="Uraikan diagnostik dan langkah-langkah yang dilakukan secara rinci..."
                      />
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-end">
                      <div className="w-full md:w-1/2">
                        <label className="block text-gray-400 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
                          Status Pasca-Pengerjaan
                        </label>
                        <select
                          value={statusAkhir}
                          onChange={(e) => setStatusAkhir(e.target.value)}
                          className="w-full bg-gunmetal border border-gray-700 text-white p-3 focus:outline-none focus:border-camogreen transition-colors font-tactical font-bold text-lg tracking-wider appearance-none"
                        >
                          <option value="Selesai">✅ SELESAI (CLEAR)</option>
                          <option value="Tertunda">⏳ TERTUNDA (BUTUH SPAREPART)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-1/2 bg-olive hover:bg-camogreen text-white font-tactical font-bold py-3 px-6 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center gap-2 border border-[#6b8e23] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          'MENGIRIM...'
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            KONTRIBUSIKAN LAPORAN
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
                
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardTeknisi;
