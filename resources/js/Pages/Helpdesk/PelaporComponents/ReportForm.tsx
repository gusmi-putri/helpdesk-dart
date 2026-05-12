import React from 'react';
import { Phone, MapPin, AlertCircle, CircleUser, Upload, Camera, Trash2, Send, ShieldCheck, X } from 'lucide-react';
import SearchableSelect from '@/Components/SearchableSelect';

interface ReportFormProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
  processing: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  dbUnits: any[];
  authUser: any;
  currentUser: any;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  data,
  setData,
  errors,
  processing,
  handleSubmit,
  dbUnits,
  authUser,
  currentUser,
  fileInputRef,
  handleFileSelect,
  removeFile
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  const confirmSubmit = () => {
    setIsConfirmOpen(false);
    const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(syntheticEvent);
  };

  const selectedUnit = dbUnits.find((u: any) => u.id?.toString() === data.unit_id?.toString());

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
      <div className="glass-panel border-t-4 border-t-olive overflow-hidden bg-white dark:bg-cighra-darkcard/80 shadow-xl border border-slate-200 dark:border-slate-600">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-tactical font-bold text-slate-800 dark:text-white tracking-wider uppercase mb-3">
            BUAT LAPORAN KERUSAKAN
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
            Tim teknis akan melakukan verifikasi data dan ketersediaan suku cadang setelah menerima laporan ini.
            Kami akan menghubungi Anda kembali untuk proses tindak lanjut.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
            Jika kendala bersifat <strong className="text-cighra-primary dark:text-cighra-gold">Darurat (Urgent)</strong>, mohon hubungi pusat bantuan kami di:
          </p>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2"><Phone size={16} className="text-cighra-primary dark:text-cighra-gold mt-0.5 flex-shrink-0" /><span><strong>Telepon:</strong> (+62) 822-2541-8071</span></li>
            <li className="flex items-start gap-2"><MapPin size={16} className="text-cighra-primary dark:text-cighra-gold mt-0.5 flex-shrink-0" /><span><strong>Alamat:</strong> Jl. PSM No.50, Sukapura, Kec. Kiaracondong, Kota Bandung, Jawa Barat 40285</span></li>
          </ul>
        </div>
        <div className="px-6 md:px-8 py-3 bg-cighra-primary/10 dark:bg-cighra-gold/10 border-t border-cighra-primary dark:border-cighra-gold/30">
          <p className="text-xs text-cighra-primary dark:text-cighra-gold font-semibold flex items-center gap-1.5"><AlertCircle size={14} /> Tanda <span className="font-bold">*</span> wajib diisi</p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="glass-panel p-6 border-l-4 border-l-olive space-y-5 bg-white dark:bg-cighra-darkcard/80 shadow-xl border border-slate-200 dark:border-slate-600">
          <h3 className="text-xs font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-[0.2em] uppercase flex items-center gap-2"><CircleUser size={16} /> DATA PELAPOR</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1.5">Nama Lengkap</label>
              <input type="text" readOnly value={authUser?.nama_lengkap || currentUser?.name || ''} className="w-full bg-white dark:bg-cighra-darkcard/80 border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm text-gunmetal dark:text-slate-300 cursor-not-allowed rounded-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1.5">Pangkat / NRP / Golongan</label>
              <input type="text" readOnly value={authUser?.nrp_nip || '-'} className="w-full bg-white dark:bg-cighra-darkcard/80 border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm text-gunmetal dark:text-slate-300 cursor-not-allowed rounded-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1.5">Satuan Kerja</label>
              <input type="text" readOnly value={authUser?.asal_satuan || '-'} className="w-full bg-white dark:bg-cighra-darkcard/80 border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm text-gunmetal dark:text-slate-300 cursor-not-allowed rounded-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-300 mb-1.5">Nomor WhatsApp Aktif</label>
              <input type="text" readOnly value={authUser?.no_wa || '-'} className="w-full bg-white dark:bg-cighra-darkcard/80 border border-slate-300 dark:border-slate-600 px-4 py-2.5 text-sm text-gunmetal dark:text-slate-300 cursor-not-allowed rounded-sm" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 italic uppercase tracking-tighter">Data diambil otomatis dari profil akun Anda. Hubungi Admin jika ada kesalahan.</p>
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-olive !overflow-visible relative z-20 bg-white dark:bg-cighra-darkcard/80 shadow-xl border border-slate-200 dark:border-slate-600">
          <SearchableSelect 
            label="Nomor Seri DART"
            placeholder="Ketik nomor seri atau nama unit DART..."
            options={dbUnits
              .filter((unit: any) => unit.asal_satuan === authUser.asal_satuan)
              .map((unit: any) => ({
                id: unit.id,
                label: unit.nomor_seri,
                sublabel: unit.nama_dart,
                tag: `${unit.jenis_dart} | ${unit.asal_satuan}`
              }))}
            value={data.unit_id}
            onChange={(val) => setData('unit_id', val.toString())}
            error={errors.unit_id}
          />
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-olive bg-white dark:bg-cighra-darkcard/80 shadow-xl border border-slate-200 dark:border-slate-600">
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-3 uppercase">Tingkat Kerusakan <span className="text-cighra-primary dark:text-cighra-gold">*</span></label>
          <div className="space-y-3">
            {['Ringan', 'Sedang', 'Parah'].map(level => (
              <label key={level} className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all ${data.tingkat_kerusakan === level ? 'border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 dark:bg-cighra-primary/20 dark:bg-cighra-gold/20' : 'border-slate-200 dark:border-slate-600 hover:border-cighra-primary dark:border-cighra-gold/50 hover:bg-white dark:hover:bg-black/40'}`}>
                <input type="radio" name="tingkat_kerusakan" value={level} checked={data.tingkat_kerusakan === level} onChange={(e) => setData('tingkat_kerusakan', e.target.value)} required
                  className="w-4 h-4 accent-olive" />
                <span className="text-sm text-gunmetal dark:text-slate-300 font-medium uppercase">{level}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 ml-auto uppercase">{level === 'Ringan' ? 'Masih bisa beroperasi' : level === 'Sedang' ? 'Fungsi terganggu sebagian' : 'Tidak dapat beroperasi'}</span>
              </label>
            ))}
          </div>
          {errors.tingkat_kerusakan && <p className="text-[9px] text-cighra-primary dark:text-cighra-gold mt-1 font-mono uppercase">{errors.tingkat_kerusakan}</p>}
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-olive bg-white dark:bg-cighra-darkcard/80 shadow-xl border border-slate-200 dark:border-slate-600">
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1 uppercase">Upload Bukti Kendala <span className="text-cighra-primary dark:text-cighra-gold">*</span></label>
          <p className="text-xs text-slate-500 dark:text-slate-300 mb-4">Maksimum 5 file (Gambar atau Video). Ukuran maks 100 MB per file.</p>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,video/*" multiple className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={data.file_bukti.length >= 5}
            className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-cighra-primary dark:border-cighra-gold/40 text-cighra-primary dark:text-cighra-gold font-semibold text-sm rounded-sm hover:bg-cighra-primary/10 dark:bg-cighra-gold/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Upload size={18} /> Unggah File Baru
          </button>
          {data.file_bukti.length > 0 && (
            <div className="mt-4 space-y-2">
              {data.file_bukti.map((file: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white dark:bg-cighra-darkcard/80 border border-slate-200 dark:border-slate-600 rounded-sm">
                  <div className="flex items-center gap-2 text-sm text-gunmetal dark:text-slate-300 truncate">
                    <Camera size={14} className="text-cighra-primary dark:text-cighra-gold flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-[10px] text-slate-500 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                  </div>
                  <button type="button" onClick={() => removeFile(i)} className="text-slate-500 hover:text-cighra-primary dark:text-cighra-gold transition-colors p-1"><Trash2 size={14} /></button>
                </div>
              ))}
              <p className="text-[10px] text-slate-500">{data.file_bukti.length}/5 file terpilih</p>
            </div>
          )}
          {errors.file_bukti && <p className="text-[9px] text-cighra-primary dark:text-cighra-gold mt-1 font-mono uppercase">{errors.file_bukti}</p>}
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-olive bg-white dark:bg-cighra-darkcard/80 shadow-xl border border-slate-200 dark:border-slate-600">
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1 uppercase">Prioritas Penanganan <span className="text-cighra-primary dark:text-cighra-gold">*</span></label>
          <p className="text-xs text-slate-500 dark:text-slate-300 italic mb-3">Pilihlah tingkat urgensi sesuai kondisi lapangan agar tim dapat memprioritaskan penanganan.</p>
          <div className="space-y-3">
            {[
              { val: 'Sangat Mendesak', desc: 'Butuh penanganan segera, operasi terhenti' },
              { val: 'Bisa Menunggu', desc: 'Perlu diperbaiki tapi tidak mendesak' },
              { val: 'Pemeliharaan Rutin', desc: 'Perawatan berkala / preventif' },
            ].map(opt => (
              <label key={opt.val} className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all ${data.urgensi === opt.val ? 'border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 dark:bg-cighra-primary/20 dark:bg-cighra-gold/20' : 'border-slate-200 dark:border-slate-600 hover:border-cighra-primary dark:border-cighra-gold/50 hover:bg-white dark:hover:bg-black/40'}`}>
                <input type="radio" name="urgensi" value={opt.val} checked={data.urgensi === opt.val} onChange={(e) => setData('urgensi', e.target.value)} required
                  className="w-4 h-4 accent-olive" />
                <div>
                  <span className="text-sm text-gunmetal dark:text-slate-300 font-medium uppercase">{opt.val}</span>
                  <span className="block text-[10px] text-slate-500 dark:text-slate-400 uppercase">{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>
          {errors.urgensi && <p className="text-[9px] text-cighra-primary dark:text-cighra-gold mt-1 font-mono uppercase">{errors.urgensi}</p>}
        </div>

        <div className="glass-panel p-6 border-l-4 border-l-olive bg-white dark:bg-cighra-darkcard/80 shadow-xl border border-slate-200 dark:border-slate-600">
          <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2 uppercase">Deskripsi Kerusakan <span className="text-cighra-primary dark:text-cighra-gold">*</span></label>
          <textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} required rows={5}
            className="w-full bg-cighra-light/50 dark:bg-cighra-darkcard/80 border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-cighra-primary dark:border-cighra-gold transition-colors resize-none rounded-sm"
            placeholder="Jelaskan secara detail kondisi kerusakan, kronologi kejadian, dan gejala yang dialami..." />
          {errors.deskripsi && <p className="text-[9px] text-cighra-primary dark:text-cighra-gold mt-1 font-mono uppercase">{errors.deskripsi}</p>}
        </div>

        <button type="submit" disabled={processing}
          className="w-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white font-tactical font-bold py-4 tracking-[0.3em] transition-all flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-50 shadow-lg rounded-sm uppercase">
          <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></span>
          <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          {processing ? 'MENGIRIM LAPORAN...' : 'Kirim Laporan Sekarang'}
        </button>
      </form>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setIsConfirmOpen(false)}>
          <div className="bg-white dark:bg-cighra-dark border border-cighra-primary dark:border-cighra-gold/30 shadow-2xl max-w-lg w-full mx-4 rounded-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 bg-cighra-primary/10 dark:bg-cighra-gold/10 border-b border-cighra-primary dark:border-cighra-gold/20 flex items-center justify-between">
              <h3 className="font-tactical font-bold tracking-widest text-sm flex items-center gap-2 text-slate-800 dark:text-white uppercase">
                <ShieldCheck className="w-5 h-5 text-cighra-primary dark:text-cighra-gold" /> KONFIRMASI PENGIRIMAN
              </h3>
              <button onClick={() => setIsConfirmOpen(false)} className="text-slate-500 dark:text-slate-300 hover:text-cighra-primary dark:text-cighra-gold transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gunmetal dark:text-slate-300">
                Apakah Anda yakin semua data laporan sudah benar dan lengkap? Laporan yang telah dikirim tidak dapat diubah kembali.
              </p>
              <div className="bg-white dark:bg-cighra-darkcard/80 p-3 border border-cighra-primary dark:border-cighra-gold/20 text-xs font-mono space-y-1">
                <p className="text-slate-500 dark:text-slate-300">UNIT: <span className="text-slate-800 dark:text-white font-bold">{selectedUnit?.nama_dart || selectedUnit?.nomor_seri || '-'}</span></p>
                <p className="text-slate-500 dark:text-slate-300">TINGKAT: <span className="text-slate-800 dark:text-white font-bold uppercase">{data.tingkat_kerusakan || '-'}</span></p>
                <p className="text-slate-500 dark:text-slate-300">URGENSI: <span className="text-slate-800 dark:text-white font-bold uppercase">{data.urgensi || '-'}</span></p>
                <p className="text-slate-500 dark:text-slate-300">BUKTI: <span className="text-slate-800 dark:text-white font-bold">{data.file_bukti?.length || 0} file</span></p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-600 flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-5 py-2 text-xs font-tactical font-bold tracking-widest border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-black/40 transition-colors uppercase"
              >
                PERIKSA ULANG
              </button>
              <button
                onClick={confirmSubmit}
                disabled={processing}
                className="bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white px-6 py-2 text-xs font-tactical font-bold tracking-widest transition-colors flex items-center gap-2 uppercase"
              >
                <Send className="w-4 h-4" /> YA, KIRIM LAPORAN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;
