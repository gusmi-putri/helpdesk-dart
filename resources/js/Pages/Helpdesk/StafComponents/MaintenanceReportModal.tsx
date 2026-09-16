import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Send, AlertTriangle, Building, User, Wallet, FileText, Upload } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface MaintenanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

const MaintenanceReportModal: React.FC<MaintenanceReportModalProps> = ({ isOpen, onClose, currentUser }) => {
  const addNotification = useStore((state) => state.addNotification);

  const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
    nama_giat: '',
    periode: 'Triwulan I',
    tahun: new Date().getFullYear().toString(),
    anggaran_pendukung: '',
    jumlah_anggaran: '',
    dokumen_anggaran: null as File | null,
    dokumen_lpj: null as File | null,
  });

  const [previewAnggaran, setPreviewAnggaran] = useState<string | null>(null);
  const [previewLpj, setPreviewLpj] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/maintenance-reports', {
      preserveScroll: true,
      onSuccess: () => {
        addNotification('Laporan pemeliharaan berhasil dikirim', 'success');
        reset();
        setPreviewAnggaran(null);
        setPreviewLpj(null);
        onClose();
      },
      onError: () => {
        addNotification('Gagal mengirim laporan. Periksa kembali form anda.', 'error');
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'dokumen_anggaran' | 'dokumen_lpj') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        addNotification('Ukuran file maksimal 10MB', 'error');
        return;
      }
      setData(field, file);
      
      const isImage = file.type.startsWith('image/');
      if (field === 'dokumen_anggaran') {
        setPreviewAnggaran(isImage ? URL.createObjectURL(file) : 'PDF Document');
      } else {
        setPreviewLpj(isImage ? URL.createObjectURL(file) : 'PDF Document');
      }
    }
  };

  const periodes = [
    'Triwulan I', 'Triwulan II', 'Triwulan III', 'Triwulan IV',
    'Semester I', 'Semester II', 'Tahunan'
  ];

  const currentYear = new Date().getFullYear();
  const tahunList = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-cighra-darkcard border border-slate-700 shadow-2xl flex flex-col max-h-[90vh] text-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50 bg-slate-800 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-tactical font-bold text-cighra-gold tracking-widest uppercase">
              BUAT LAPORAN PEMELIHARAAN
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Form ini bersifat pasif dan digunakan sebagai Laporan Pertanggung Jawaban Keuangan (Wabku) dari satuan pemakai terhadap pemeliharaan DART yang telah dilaksanakan.
            </p>
            <p className="text-xs text-cighra-gold mt-4 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Tanda * wajib diisi
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-900">
          <form id="maintenance-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. DATA SATUAN & PELAPOR */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-sm">
              <h3 className="text-sm font-tactical font-bold text-cighra-gold tracking-widest uppercase mb-4 flex items-center gap-2">
                <Building className="w-4 h-4" /> DATA SATUAN & PELAPOR
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">ASAL SATUAN</label>
                  <input type="text" value={currentUser?.satuan?.nama_satuan || '-'} disabled className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 px-4 py-2.5 sm:text-sm cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">NAMA PELAPOR</label>
                  <input type="text" value={currentUser?.nama_lengkap || '-'} disabled className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 px-4 py-2.5 sm:text-sm cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">PANGKAT / NRP / GOLONGAN</label>
                  <input type="text" value={currentUser?.nrp_nip || '-'} disabled className="w-full bg-slate-700/50 border border-slate-600 text-slate-300 px-4 py-2.5 sm:text-sm cursor-not-allowed" />
                </div>
              </div>
            </div>

            {/* 2. INFORMASI GIAT PEMELIHARAAN */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-sm">
              <h3 className="text-sm font-tactical font-bold text-cighra-gold tracking-widest uppercase mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4" /> INFORMASI GIAT PEMELIHARAAN
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-cighra-gold uppercase tracking-wider mb-2">NAMA GIAT *</label>
                  <input 
                    type="text" 
                    value={data.nama_giat}
                    onChange={(e) => setData('nama_giat', e.target.value)}
                    placeholder="Contoh: Pengecatan Ulang dan Servis Berkala"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cighra-gold focus:ring-1 focus:ring-cighra-gold text-white px-4 py-2.5 sm:text-sm transition-colors"
                    required
                  />
                  {errors.nama_giat && <p className="text-red-500 text-xs mt-1">{errors.nama_giat}</p>}
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-cighra-gold uppercase tracking-wider mb-2">WAKTU PELAKSANAAN *</label>
                  <div className="flex gap-2">
                    <select 
                      value={data.periode}
                      onChange={(e) => setData('periode', e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 focus:border-cighra-gold focus:ring-1 focus:ring-cighra-gold text-white px-4 py-2.5 sm:text-sm transition-colors cursor-pointer"
                    >
                      {periodes.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select 
                      value={data.tahun}
                      onChange={(e) => setData('tahun', e.target.value)}
                      className="w-1/3 bg-slate-900 border border-slate-700 focus:border-cighra-gold focus:ring-1 focus:ring-cighra-gold text-white px-4 py-2.5 sm:text-sm transition-colors cursor-pointer"
                    >
                      {tahunList.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. KEUANGAN */}
            <div className="bg-slate-800 border border-slate-700 p-5 rounded-sm">
              <h3 className="text-sm font-tactical font-bold text-cighra-gold tracking-widest uppercase mb-4 flex items-center gap-2">
                <Wallet className="w-4 h-4" /> KEUANGAN
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-cighra-gold uppercase tracking-wider mb-2">ANGGARAN PENDUKUNG *</label>
                  <input 
                    type="text" 
                    value={data.anggaran_pendukung}
                    onChange={(e) => setData('anggaran_pendukung', e.target.value)}
                    placeholder="Contoh: DIPA Satuan 2024"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cighra-gold focus:ring-1 focus:ring-cighra-gold text-white px-4 py-2.5 sm:text-sm transition-colors"
                    required
                  />
                  {errors.anggaran_pendukung && <p className="text-red-500 text-xs mt-1">{errors.anggaran_pendukung}</p>}
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-cighra-gold uppercase tracking-wider mb-2">JUMLAH ANGGARAN (RP) *</label>
                  <input 
                    type="number" 
                    value={data.jumlah_anggaran}
                    onChange={(e) => setData('jumlah_anggaran', e.target.value)}
                    placeholder="15000000"
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cighra-gold focus:ring-1 focus:ring-cighra-gold text-white px-4 py-2.5 sm:text-sm transition-colors"
                    required
                  />
                  {errors.jumlah_anggaran && <p className="text-red-500 text-xs mt-1">{errors.jumlah_anggaran}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DOKUMEN ANGGARAN */}
                <div>
                  <label className="block text-xs font-mono font-bold text-cighra-gold uppercase tracking-wider mb-1">DOKUMEN PENDUKUNG ANGGARAN KEUANGAN *</label>
                  <p className="text-xs text-slate-400 mb-3">Unggah scan/foto dokumen rincian anggaran (PDF/Gambar).</p>
                  <div className="relative">
                    <input 
                      type="file"
                      id="dok_anggaran"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileChange(e, 'dokumen_anggaran')}
                      className="hidden"
                      required
                    />
                    <label 
                      htmlFor="dok_anggaran"
                      className="w-full flex items-center justify-center gap-2 border border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-3 cursor-pointer transition-colors text-sm font-tactical tracking-widest uppercase"
                    >
                      <Upload className="w-4 h-4" /> UNGGAH DOKUMEN ANGGARAN
                    </label>
                    {data.dokumen_anggaran && (
                      <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                        <span className="truncate">{data.dokumen_anggaran.name}</span>
                        <button type="button" onClick={() => { setData('dokumen_anggaran', null); setPreviewAnggaran(null); }} className="text-red-400 hover:text-red-300 ml-auto">Hapus</button>
                      </div>
                    )}
                    {errors.dokumen_anggaran && <p className="text-red-500 text-xs mt-1">{errors.dokumen_anggaran}</p>}
                  </div>
                </div>

                {/* DOKUMEN LPJ */}
                <div>
                  <label className="block text-xs font-mono font-bold text-cighra-gold uppercase tracking-wider mb-1">DOKUMEN LAPORAN PERTANGGUNG JAWABAN (LPJ) *</label>
                  <p className="text-xs text-slate-400 mb-3">Unggah scan/foto dokumen laporan pertanggung jawaban pelaksanaan (PDF/Gambar).</p>
                  <div className="relative">
                    <input 
                      type="file"
                      id="dok_lpj"
                      accept=".pdf,image/*"
                      onChange={(e) => handleFileChange(e, 'dokumen_lpj')}
                      className="hidden"
                      required
                    />
                    <label 
                      htmlFor="dok_lpj"
                      className="w-full flex items-center justify-center gap-2 border border-slate-600 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-3 cursor-pointer transition-colors text-sm font-tactical tracking-widest uppercase"
                    >
                      <Upload className="w-4 h-4" /> UNGGAH DOKUMEN LPJ
                    </label>
                    {data.dokumen_lpj && (
                      <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                        <span className="truncate">{data.dokumen_lpj.name}</span>
                        <button type="button" onClick={() => { setData('dokumen_lpj', null); setPreviewLpj(null); }} className="text-red-400 hover:text-red-300 ml-auto">Hapus</button>
                      </div>
                    )}
                    {errors.dokumen_lpj && <p className="text-red-500 text-xs mt-1">{errors.dokumen_lpj}</p>}
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-800">
          <button
            form="maintenance-form"
            type="submit"
            disabled={processing}
            className="w-full bg-cighra-gold hover:bg-yellow-500 text-slate-900 font-tactical font-bold text-lg tracking-widest py-4 px-6 flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            <Send className="w-5 h-5" /> 
            {processing ? 'MENGIRIM...' : 'KIRIM LAPORAN PERTANGGUNG JAWABAN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceReportModal;
