import React, { useState, useEffect, useRef } from 'react';
import { Send, History, AlertCircle, Clock, CheckCircle2, ChevronRight, Activity, Camera, LogOut, Shield, FilePlus, Menu, X as XIcon, CircleUser, Wrench, Upload, Phone, MapPin, Info, Trash2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { router, useForm } from '@inertiajs/react';

const DashboardPelapor = ({ dbCases = [], dbUnits = [], dbUsers = [], authUser = null }: any) => {
  const [activeMenu, setActiveMenu] = useState<'FORM' | 'HISTORY'>('FORM');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const addNotification = useStore(state => state.addNotification);

  // Ambil state dan aksi dari global store
  const currentUser = useStore(state => state.currentUser);
  const logoutAction = useStore(state => state.logout);

  // Temukan db_id user saat ini berdasarkan username di Zustand
  const dbUser = dbUsers.find((u: any) => u.username === currentUser?.username);

  // Ambil riwayat laporan milik user ini saja
  const history = dbCases.filter((r: any) => r.kerusakan.pelapor_id === dbUser?.db_id);

  // Auto-polling untuk real-time sinkronisasi
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({ only: ['dbCases', 'dbUnits', 'dbUsers'] });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { data, setData, post, processing, reset, errors } = useForm({
    unit_id: '',
    deskripsi: '',
    tingkat_kerusakan: '',
    urgensi: '',
    klasifikasi: '', // Will be inferred or can be left empty
    file_bukti: [] as File[],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | string | null>(null);

  // Cari item terpilih dari dbCases agar data di modal selalu fresh saat polling
  const selectedItem = dbCases.find((c: any) => c.db_id === selectedItemId);

  // ==========================================
  // LOGIKA SUBMIT
  // ==========================================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setData('file_bukti', [...data.file_bukti, ...newFiles].slice(0, 5));
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeFile = (index: number) => {
    setData('file_bukti', data.file_bukti.filter((_, i) => i !== index));
  };

  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();

    post('/reports', {
      onSuccess: () => {
        reset();
        addNotification('LAPORAN TELAH DITRANSMISIKAN KE COMMAND CENTER.');
        setActiveMenu('HISTORY');
      },
      onError: () => {
        addNotification('GAGAL MENGIRIM LAPORAN. CEK KONEKSI SATELIT.', 'error');
      }
    });
  };

  const handleLogout = () => {
    logoutAction();
    router.visit('/login');
  };

  // ==========================================
  // VIEW RENDERERS
  // ==========================================

  const renderForm = () => (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

      {/* ====== HEADER PANEL ====== */}
      <div className="glass-panel border-t-4 border-t-olive overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-tactical font-bold text-gunmetal dark:text-white tracking-wider uppercase mb-3">
            Form Pengaduan Kerusakan DART
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            Tim teknis akan melakukan verifikasi data dan ketersediaan suku cadang setelah menerima laporan ini.
            Kami akan menghubungi Anda kembali untuk proses tindak lanjut.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            Jika kendala bersifat <strong className="text-targetred">darurat (Urgent)</strong>, mohon hubungi pusat bantuan kami di:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2"><Phone size={16} className="text-olive mt-0.5 flex-shrink-0" /><span><strong>Telepon:</strong> (+62) 822-2541-8071</span></li>
            <li className="flex items-start gap-2"><MapPin size={16} className="text-olive mt-0.5 flex-shrink-0" /><span><strong>Alamat:</strong> Jl. PSM No.50, Sukapura, Kec. Kiaracondong, Kota Bandung, Jawa Barat 40285 Bengpuskomlek Puskomlekad</span></li>
          </ul>
        </div>
        <div className="px-6 md:px-8 py-3 bg-targetred/10 border-t border-targetred/30">
          <p className="text-xs text-targetred font-semibold flex items-center gap-1.5"><AlertCircle size={14} /> Tanda <span className="font-bold">*</span> menunjukkan pertanyaan yang wajib diisi</p>
        </div>
      </div>

      <form onSubmit={handleSubmitNewReport} className="space-y-6">
        {/* ====== NOMOR SERI DART ====== */}

        {/* ====== DATA PELAPOR (READ-ONLY) ====== */}
        <div className="glass-panel p-6 border-l-4 border-l-olive space-y-5">
          <h3 className="text-xs font-tactical font-bold text-olive tracking-[0.2em] uppercase flex items-center gap-2"><CircleUser size={16} /> Data Pelapor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Nama Lengkap</label>
              <input type="text" readOnly value={authUser?.nama_lengkap || currentUser?.name || ''} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm text-gunmetal dark:text-gray-300 cursor-not-allowed rounded-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Pangkat / NRP / Golongan</label>
              <input type="text" readOnly value={authUser?.nrp_nip || '-'} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm text-gunmetal dark:text-gray-300 cursor-not-allowed rounded-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Satuan Kerja</label>
              <input type="text" readOnly value={authUser?.asal_satuan || '-'} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm text-gunmetal dark:text-gray-300 cursor-not-allowed rounded-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5">Nomor WhatsApp Aktif</label>
              <input type="text" readOnly value={authUser?.no_wa || '-'} className="w-full bg-gray-100 dark:bg-gray-800/60 border border-gray-300 dark:border-gray-700 px-4 py-2.5 text-sm text-gunmetal dark:text-gray-300 cursor-not-allowed rounded-sm" />
            </div>
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">Data diambil otomatis dari profil akun Anda. Hubungi Admin jika ada kesalahan.</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-olive">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nomor Seri DART <span className="text-targetred">*</span></label>
          <select value={data.unit_id} onChange={(e) => setData('unit_id', e.target.value)} required
            className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gunmetal dark:text-white focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors rounded-sm">
            <option value="">-- Pilih Unit DART --</option>
            {dbUnits.map((unit: any) => (
              <option key={unit.id} value={unit.id}>{unit.nomor_seri} — {unit.nama_dart} ({unit.asal_satuan})</option>
            ))}
          </select>
          {errors.unit_id && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.unit_id}</p>}
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-olive">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tingkat Kerusakan <span className="text-targetred">*</span></label>
          <div className="space-y-3">
            {['Ringan', 'Sedang', 'Parah'].map(level => (
              <label key={level} className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all ${data.tingkat_kerusakan === level ? 'border-olive bg-olive/10 dark:bg-olive/20' : 'border-gray-200 dark:border-gray-700 hover:border-olive/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                <input type="radio" name="tingkat_kerusakan" value={level} checked={data.tingkat_kerusakan === level} onChange={(e) => setData('tingkat_kerusakan', e.target.value)} required
                  className="w-4 h-4 accent-olive" />
                <span className="text-sm text-gunmetal dark:text-gray-200 font-medium">{level}</span>
                <span className="text-[10px] text-gray-400 ml-auto">{level === 'Ringan' ? 'Masih bisa beroperasi' : level === 'Sedang' ? 'Fungsi terganggu sebagian' : 'Tidak dapat beroperasi'}</span>
              </label>
            ))}
          </div>
          {errors.tingkat_kerusakan && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.tingkat_kerusakan}</p>}
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-olive">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Upload Photo / Video Kendala <span className="text-targetred">*</span></label>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Upload maksimum 5 file yang didukung: image atau video. Maks 100 MB per file.</p>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" multiple className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={data.file_bukti.length >= 5}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-olive/60 text-olive font-semibold text-sm rounded-sm hover:bg-olive/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Upload size={18} /> Tambahkan file
          </button>
          {data.file_bukti.length > 0 && (
            <div className="mt-4 space-y-2">
              {data.file_bukti.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-sm">
                  <div className="flex items-center gap-2 text-sm text-gunmetal dark:text-gray-300 truncate">
                    <Camera size={14} className="text-olive flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                  </div>
                  <button type="button" onClick={() => removeFile(i)} className="text-gray-400 hover:text-targetred transition-colors p-1"><Trash2 size={14} /></button>
                </div>
              ))}
              <p className="text-[10px] text-gray-400">{data.file_bukti.length}/5 file terpilih</p>
            </div>
          )}
          {errors.file_bukti && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.file_bukti}</p>}
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-olive">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Status Kebutuhan Perbaikan <span className="text-targetred">*</span></label>
          <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-3">"Pilihlah tingkat urgensi dengan jujur sesuai kondisi di lapangan agar tim teknisi dapat memprioritaskan penanganan secara efektif."</p>
          <div className="space-y-3">
            {[
              { val: 'Sangat Mendesak', desc: 'Butuh penanganan segera, operasi terhenti' },
              { val: 'Bisa Menunggu', desc: 'Perlu diperbaiki tapi tidak mendesak' },
              { val: 'Pemeliharaan Rutin', desc: 'Perawatan berkala / preventif' },
            ].map(opt => (
              <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all ${data.urgensi === opt.val ? 'border-olive bg-olive/10 dark:bg-olive/20' : 'border-gray-200 dark:border-gray-700 hover:border-olive/50 hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}>
                <input type="radio" name="urgensi" value={opt.val} checked={data.urgensi === opt.val} onChange={(e) => setData('urgensi', e.target.value)} required
                  className="w-4 h-4 accent-olive" />
                <div>
                  <span className="text-sm text-gunmetal dark:text-gray-200 font-medium">{opt.val}</span>
                  <span className="block text-[10px] text-gray-400">{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.urgensi && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.urgensi}</p>}
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-olive">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsikan kendala yang akan dilaporkan <span className="text-targetred">*</span></label>
          <textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} required rows={5}
            className="w-full bg-white dark:bg-black/50 border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm text-gunmetal dark:text-white focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive transition-colors resize-none rounded-sm"
            placeholder="Jelaskan secara detail kondisi kerusakan, kronologi kejadian, and gejala yang terjadi..." />
          {errors.deskripsi && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.deskripsi}</p>}
        </div>

        <button type="submit" disabled={processing}
          className="w-full bg-olive hover:bg-camogreen text-white font-tactical font-bold py-4 tracking-[0.3em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 shadow-lg rounded-sm">
          <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></span>
          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          {processing ? 'MENGIRIM LAPORAN...' : 'KIRIM LAPORAN PENGADUAN'}
        </button>
      </form>
    </div>
  );

  const renderHistory = () => (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-tactical font-bold text-gunmetal dark:text-white tracking-widest uppercase">Riwayat Laporan</h2>
          <p className="text-gray-600 dark:text-gray-400 text-xs font-mono mt-1 tracking-widest uppercase">Log Pelaporan Unit Anda</p>
        </div>
        <div className="bg-olive/10 border border-olive/30 px-4 py-2">
          <span className="text-[10px] font-mono text-olive font-bold tracking-widest">TOTAL: {history.length} TIKET</span>
        </div>
      </div>

      <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-600 font-mono bg-white/40 dark:bg-black/40 border border-gray-300 dark:border-gray-800">
            ANDA BELUM PERNAH MENGAJUKAN LAPORAN APAPUN.
          </div>
        ) : (
          history.map((item: any, index: number) => (
            <div
              key={index}
              onClick={() => setSelectedItemId(item.db_id)}
              className="glass-panel p-5 border-l-4 border-l-gray-400 dark:border-l-gray-700 hover:border-l-olive transition-all cursor-pointer group hover:bg-white/40 dark:hover:bg-black/40"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-500 bg-gray-200 dark:bg-gray-800 px-2 py-1 tracking-widest">{item.caseId}</span>
                  <span className="text-xs font-mono text-gray-500 tracking-tighter">{item.kerusakan.tanggal}</span>
                </div>
                <div className={`px-3 py-1 text-[9px] font-tactical font-bold tracking-[0.2em] flex items-center gap-2 border
                  ${item.status === 'SELESAI' ? 'bg-green-900/20 text-green-500 border-green-800' :
                    item.status === 'PROSES' ? 'bg-blue-900/20 text-blue-500 border-blue-800' :
                      'bg-yellow-900/20 text-yellow-500 border-yellow-800'}
                `}>
                  {item.status === 'SELESAI' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                  {item.status}
                </div>
              </div>
              <h4 className="text-sm font-bold text-gunmetal dark:text-white mb-2 group-hover:text-olive transition-colors uppercase tracking-wide">
                {item.kerusakan.barangRusak}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 font-mono leading-relaxed italic">
                "{item.kerusakan.deskripsi}"
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                    <Activity size={12} className="text-olive" /> {item.kerusakan.lokasi}
                  </div>
                  {item.perbaikan.teknisi && (
                    <div className="text-[10px] text-olive font-bold font-mono flex items-center gap-1">
                      [TEKNISI: {item.perbaikan.teknisi.toUpperCase()}]
                    </div>
                  )}
                </div>
                <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ==========================================
  // MAIN LAYOUT
  // ==========================================
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
        {/* Brand */}
        <div className="p-6 border-b border-gray-300 dark:border-gray-800 flex items-center gap-4 bg-gray-100 dark:bg-[#111]">
          <div className="relative">
            <img src="/logo.png" alt="DART Logo" className="w-12 h-14 object-contain" />
          </div>
          <div>
            <h1 className="font-stencil text-2xl tracking-widest text-gunmetal dark:text-white leading-none">HELPDESK-DART</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6">

          <button
            onClick={() => { setActiveMenu('FORM'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-2
              ${activeMenu === 'FORM' ? 'bg-gray-100 dark:bg-gray-900 text-gunmetal dark:text-white border-olive' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/50'}
            `}
          >
            <Send size={18} /> FORM PELAPORAN
          </button>

          <button
            onClick={() => { setActiveMenu('HISTORY'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-6 py-4 font-tactical text-sm tracking-wider transition-all border-l-2
              ${activeMenu === 'HISTORY' ? 'bg-gray-100 dark:bg-gray-900 text-gunmetal dark:text-white border-olive' : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900/50'}
            `}
          >
            <History size={18} /> RIWAYAT LAPORAN
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
              <span className="block text-xs font-bold text-gunmetal dark:text-white uppercase font-sans tracking-wider">{currentUser?.name || 'Pelapor Anonim'}</span>
              <span className="block text-[9px] font-mono tracking-widest text-targetred">{currentUser?.id || 'PELAPOR'}</span>
            </div>
            <div className="w-10 h-full bg-sand dark:bg-gunmetal border-l border-gray-300 dark:border-gray-700 flex items-center justify-center p-2">
              <CircleUser className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeMenu === 'FORM' ? renderForm() : renderHistory()}
        </div>
      </main>

      {/* MODAL DETAIL RIWAYAT */}
      {selectedItemId && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-sand dark:bg-gunmetal border-2 border-olive w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-olive bg-olive/10 flex justify-between items-center">
              <h3 className="font-tactical font-bold text-olive tracking-widest uppercase flex items-center gap-2">
                <Activity size={18} /> RINCIAN TIKET: {selectedItem.caseId}
              </h3>
              <button onClick={() => setSelectedItemId(null)} className="text-gray-500 hover:text-targetred text-xl">✕</button>
            </div>
            <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh] custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bagian Pelaporan */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono font-bold text-gray-500 tracking-[0.2em] border-b border-gray-300 dark:border-gray-800 pb-2 uppercase">DATA PELAPORAN</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Barang Rusak</p>
                      <p className="text-sm font-bold text-gunmetal dark:text-white uppercase">{selectedItem.kerusakan.barangRusak}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Lokasi Kejadian</p>
                      <p className="text-sm font-bold text-olive uppercase">{selectedItem.kerusakan.lokasi}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Waktu Transmisi</p>
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{selectedItem.kerusakan.tanggal}</p>
                    </div>
                  </div>
                </div>

                {/* Bagian Status & Penanganan */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-mono font-bold text-gray-500 tracking-[0.2em] border-b border-gray-300 dark:border-gray-800 pb-2 uppercase">STATUS SISTEM</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Status Perbaikan</p>
                      <span className={`inline-block px-3 py-1 text-[10px] font-tactical font-bold tracking-widest border mt-1
                        ${selectedItem.status === 'SELESAI' ? 'bg-green-900/20 text-green-500 border-green-800' :
                          selectedItem.status === 'PROSES' ? 'bg-blue-900/20 text-blue-500 border-blue-800' :
                            'bg-yellow-900/20 text-yellow-500 border-yellow-800'}
                      `}>
                        {selectedItem.perbaikan.statusPerbaikan || selectedItem.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Teknisi Penanggung Jawab</p>
                      <p className="text-sm font-bold text-gunmetal dark:text-white flex items-center gap-2">
                        <Wrench size={14} className="text-olive" /> {selectedItem.perbaikan.teknisi ? selectedItem.perbaikan.teknisi.toUpperCase() : 'MENUNGGU KONFIRMASI'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deskripsi & Catatan */}
              <div className="space-y-4">
                <div className="bg-sand/30 dark:bg-black/30 p-4 border border-gray-300 dark:border-gray-800">
                  <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mb-2">DESKRIPSI KRONOLOGI:</p>
                  <p className="text-xs text-gray-700 dark:text-gray-400 font-mono leading-relaxed italic">
                    "{selectedItem.kerusakan.deskripsi}"
                  </p>
                </div>

                {selectedItem.perbaikan.tindakan && (
                  <div className="bg-olive/5 p-4 border border-olive/30">
                    <p className="text-[9px] text-olive font-mono uppercase tracking-widest mb-2">TINDAKAN PERBAIKAN (TEKNISI):</p>
                    <p className="text-xs text-gunmetal dark:text-gray-200 font-mono leading-relaxed">
                      {selectedItem.perbaikan.tindakan}
                    </p>
                    {selectedItem.perbaikan.sukuCadang && (
                      <div className="mt-3 pt-3 border-t border-olive/20">
                        <span className="text-[9px] font-bold text-olive tracking-tighter uppercase">SUKU CADANG DIGANTI: {selectedItem.perbaikan.sukuCadang}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-100 dark:bg-black/40 border-t border-olive/20 text-right">
              <button
                onClick={() => setSelectedItemId(null)}
                className="px-6 py-2 bg-olive text-white font-tactical font-bold text-xs tracking-widest hover:bg-camogreen transition-colors"
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPelapor;
