import React, { useState } from 'react';
import { Send, History, AlertCircle, Clock, CheckCircle2, ChevronRight, Activity, Camera, LogOut } from 'lucide-react';
import { useStore, type ReportStatus } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

const DashboardPelapor: React.FC = () => {
  const navigate = useNavigate();

  // Ambil state dan aksi dari global store
  const currentUser = useStore(state => state.currentUser);
  const reports = useStore(state => state.reports);
  const addReport = useStore(state => state.addReport);
  const logoutAction = useStore(state => state.logout);

  // Saring laporan milik pelapor ini saja (jika mau realistis), atau tampilkan semua.
  // Untuk mock, asumsikan pelapor.name yang kita cek.
  const history = reports.filter(r => r.pelapor === currentUser?.name || currentUser?.role === 'Pelapor');

  // State Input Form
  const [barangRusak, setBarangRusak] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ==========================================
  // 2. LOGIKA SUBMIT
  // ==========================================
  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // Panggil fungsi Zustand! Ini akan otomatis mengupdate layar admin & staf.
      addReport(
        currentUser?.name || 'Pelapor Anonim',
        lokasi,
        barangRusak,
        deskripsi
      );

      setBarangRusak('');
      setLokasi('');
      setDeskripsi('');
      setIsSubmitting(false);
      alert(`Laporan Anda untuk ${barangRusak} telah masuk ke antrean staf jaga.`);
    }, 800);
  };

  const handleLogout = () => {
    logoutAction();
    navigate('/login');
  };

  // Helper untuk mendapatkan gaya Badge berdasarkan Status
  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'PENDING':
        return <span className="flex items-center gap-1 text-yellow-500 font-mono text-xs border border-yellow-700 bg-yellow-900/30 px-2 py-1"><Clock className="w-3 h-3" /> MENUNGGU INSTRUKSI</span>;
      case 'DIPROSES':
        return <span className="flex items-center gap-1 text-black font-mono font-bold text-xs border border-camogreen bg-[#556b2f] px-2 py-1"><Activity className="w-3 h-3" /> DIKERJAKAN TEKNISI</span>;
      case 'SELESAI':
        return <span className="flex items-center gap-1 text-green-500 font-mono text-xs border border-green-800 bg-green-900/30 px-2 py-1 line-through decoration-black"><CheckCircle2 className="w-3 h-3" /> SELESAI & AMAN</span>;
      default:
        return null;
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-8 xl:px-16 min-h-screen bg-gunmetal relative selection:bg-targetred selection:text-white flex flex-col items-center">

      {/* Background Ornament */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[linear-gradient(45deg,#2a3439_25%,transparent_25%,transparent_75%,#2a3439_75%,#2a3439),linear-gradient(45deg,#2a3439_25%,transparent_25%,transparent_75%,#2a3439_75%,#2a3439)] bg-[length:40px_40px] bg-[position:0_0,20px_20px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl">

        {/* HEADER */}
        <div className="border-l-4 border-olive pl-4 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-tactical font-bold text-white tracking-widest flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-olive" />
              STASIUN PELAPORAN LAPANGAN
            </h1>
            <p className="text-gray-400 font-mono text-sm mt-1 uppercase">
              Data Otorisasi: {currentUser?.id} ({currentUser?.name}) | Hak Akses: Tingkat II
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-white px-3 py-1.5 border border-gray-700 hover:bg-red-900 transition-colors font-tactical text-sm tracking-widest font-bold"
          >
            <LogOut className="w-4 h-4" /> TERMINASI SESI
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* KOLOM KIRI (PANEL FORM LAPORAN BARU) */}
          <div className="lg:col-span-5 bg-black/50 border-t-2 border-olive border-r border-b border-l border-gray-800 p-6 shadow-2xl relative overflow-hidden">

            {/* Decorative tape */}
            <div className="max-w-[200px] h-4 bg-yellow-500/20 -rotate-45 absolute -top-4 -left-12 opacity-50 blur-sm pointer-events-none"></div>

            <div className="mb-6 border-b border-gray-800 pb-4">
              <h2 className="text-white font-tactical font-bold text-2xl mb-1 mt-2">FORMULIR KERUSAKAN ASET</h2>
              <p className="text-gray-500 text-xs font-mono tracking-wide">ISIKAN BERDASARKAN KONDISI FISIK SAAT INI</p>
            </div>

            <form onSubmit={handleSubmitNewReport} className="space-y-5">
              <div>
                <label className="block text-gray-400 text-xs font-mono font-bold mb-1 tracking-widest uppercase">
                  Kategori / Nama Barang
                </label>
                <input
                  type="text"
                  required
                  value={barangRusak}
                  onChange={(e) => setBarangRusak(e.target.value)}
                  className="w-full bg-gunmetal border border-gray-700 text-white p-3 focus:outline-none focus:border-camogreen focus:ring-1 focus:ring-camogreen transition-all font-sans text-sm"
                  placeholder="Contoh: Kamera Thermal CCTV"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-mono font-bold mb-1 tracking-widest uppercase">
                  Titik Koordinat / Lokasi
                </label>
                <input
                  type="text"
                  required
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  className="w-full bg-gunmetal border border-gray-700 text-white p-3 focus:outline-none focus:border-camogreen focus:ring-1 focus:ring-camogreen transition-all font-sans text-sm"
                  placeholder="Contoh: Menara Jaga Sektor Utara"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-mono font-bold mb-1 tracking-widest uppercase flex justify-between items-center">
                  <span>Uraian Kendala Taktis</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  className="w-full bg-gunmetal border border-gray-700 text-white p-3 focus:outline-none focus:border-camogreen focus:ring-1 focus:ring-camogreen transition-all font-sans text-sm resize-y"
                  placeholder="Deskripsikan dengan konkrit bagaimana kerusakan tersebut membahayakan atau menghambat operasional..."
                />
              </div>

              {/* Tombol Dummy Unggah Dokumentasi */}
              <div>
                <button type="button" className="w-full border border-dashed border-gray-600 bg-black/40 hover:bg-black/60 text-gray-400 hover:text-white py-3 rounded-sm text-sm font-tactical tracking-wider flex items-center justify-center gap-2 transition-colors">
                  <Camera className="w-4 h-4" /> UNGGAH DOKUMENTASI FISUAL (OPSIONAL)
                </button>
                <p className="text-[10px] text-gray-600 font-mono mt-1 text-center">Ukuran maksimal file: 5MB (JPG/PNG).</p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-olive hover:bg-camogreen text-white font-tactical font-bold py-3 px-6 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" /> TRANSMISI DATA...</span>
                  ) : (
                    <><Send className="w-5 h-5" /> REKAM & BERITAHU STAF</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* KOLOM KANAN (PANEL RIWAYAT & STATUS) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-black/30 border-b border-gray-700 pb-2 flex justify-between items-end">
              <h2 className="text-gray-300 font-tactical font-bold tracking-widest flex items-center gap-2 text-xl">
                <History className="text-gray-500 w-5 h-5" /> REKAM JEJAK PELAPORAN
              </h2>
              <span className="text-xs font-mono text-gray-500">Mennampilkan {history.length} Laporan Terakhir</span>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {history.map((item, index) => (
                <div key={index} className="relative group">
                  {/* Visual Indicator Jika Baru Saja Di-Update (Diterima Teknisi) */}
                  {item.isNewUpdate && (
                    <>
                      <div className="absolute -left-1.5 top-0 bottom-0 w-1 bg-yellow-500 animate-pulse z-10 shadow-[0_0_10px_#eab308]"></div>
                      <div className="absolute top-2 right-2 flex items-center gap-1 z-20 bg-yellow-900 border border-yellow-500 px-2 py-0.5 text-[10px] text-yellow-300 font-bold font-mono shadow-md animate-bounce">
                        <Activity className="w-3 h-3" /> UPDATE STATUS
                      </div>
                    </>
                  )}

                  <div className={`p-5 md:p-6 bg-black/60 border ${item.isNewUpdate ? 'border-yellow-900 shadow-[inset_0_0_30px_rgba(234,179,8,0.05)]' : 'border-gray-800'} transition-all hover:bg-black/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>

                    <div className="space-y-2 flex-grow">
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-800 text-gray-400 px-2 py-0.5 font-mono text-xs border border-gray-700">
                          {item.id}
                        </span>
                        <span className="text-gray-500 text-xs font-mono">{item.tanggalLapor}</span>
                      </div>

                      <h3 className="text-white font-tactical font-bold text-xl drop-shadow-md">
                        {item.barangRusak}
                      </h3>

                      <div className="text-gray-400 text-xs font-sans">
                        Lokasi: <span className="text-gray-300">{item.lokasi}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center justify-between sm:items-end gap-3 min-w-[160px]">
                      {getStatusBadge(item.status)}
                      <button className="text-gray-500 hover:text-white transition-colors flex items-center gap-1 text-xs font-tactical font-bold uppercase tracking-widest border border-transparent hover:border-gray-700 p-1">
                        Detail Bukti <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gunmetal/50 border border-gray-800 text-center">
              <p className="text-[11px] text-gray-500 font-mono italic">
                Sistem Command Center merekam semua entri sejak pembentukan pos komando pada tahun 2026. Laporan yang lebih dari 6 bulan telah diarsip di server pusat.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPelapor;
