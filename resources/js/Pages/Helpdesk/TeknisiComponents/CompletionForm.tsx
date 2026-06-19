import React from 'react';
import { FileText, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';

interface CompletionFormProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
  processing: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  imagePreview: string | null;
  imagePreview: string | null;
  setImagePreview: (src: string | null) => void;
}

const CompletionForm: React.FC<CompletionFormProps> = ({
  data,
  setData,
  errors,
  processing,
  handleSubmit,
  imagePreview,
  setImagePreview
}) => {
  return (
    <>
      <h3 className="text-slate-800 dark:text-white font-tactical font-bold text-lg mb-6 flex items-center gap-2 tracking-widest uppercase border-b border-cighra-primary dark:border-cighra-gold/20 pb-2">
        <FileText className="w-5 h-5 text-cighra-primary dark:text-cighra-gold" />
        FORMULIR LAPORAN PENYELESAIAN
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-slate-600 dark:text-slate-300 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
            Catatan Perbaikan & Tindakan yang Diambil
          </label>
          <textarea
            value={data.catatan}
            onChange={(e) => setData('catatan', e.target.value)}
            required rows={5}
            className={`w-full bg-white dark:bg-cighra-darkcard/80 border ${errors.catatan ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-300 dark:border-slate-600'} text-slate-800 dark:text-white p-4 focus:outline-none focus:border-cighra-primary dark:border-cighra-gold transition-colors font-sans text-sm resize-y`}
            placeholder="Jelaskan tindakan perbaikan yang telah dilakukan secara detail..."
          />
          {errors.catatan && <p className="text-[9px] text-cighra-primary dark:text-cighra-gold mt-1 font-mono uppercase">{errors.catatan}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo Upload (Required) */}
          <div className={`border-2 border-dashed ${errors.foto_selesai ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 bg-cighra-light dark:bg-cighra-darkcard/10'} p-4 text-center hover:border-cighra-primary dark:hover:border-cighra-gold transition-all group cursor-pointer relative flex flex-col justify-center min-h-[140px]`}>
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
                <div className="relative w-full max-w-[200px] h-32 border-2 border-cighra-primary dark:border-cighra-gold shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                  <img src={imagePreview} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-white font-bold font-mono">GANTI FOTO</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-slate-500 group-hover:text-cighra-primary dark:group-hover:text-cighra-gold transition-colors" />
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-300 group-hover:text-cighra-primary dark:group-hover:text-cighra-gold uppercase font-bold">
                      UNGGAH FOTO BUKTI SELESAI <span className="text-cighra-primary dark:text-cighra-gold ml-1">*</span>
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 dark:text-slate-400 uppercase">Klik untuk unggah foto hasil perbaikan</span>
                </div>
              )}
            </div>
            {errors.foto_selesai && <p className="text-[9px] text-cighra-primary dark:text-cighra-gold mt-1 font-mono uppercase">{errors.foto_selesai}</p>}
          </div>

          {/* Video Upload (Required Link) */}
          <div className="flex flex-col justify-center">
            <label className="block text-slate-600 dark:text-slate-300 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
              Tautan Video G-Drive (WAJIB) <span className="text-cighra-primary dark:text-cighra-gold">*</span>
            </label>
            <input
              type="url"
              value={data.tautan_video_selesai || ''}
              onChange={(e) => setData('tautan_video_selesai', e.target.value)}
              required
              className={`w-full bg-white dark:bg-cighra-darkcard/80 border ${errors.tautan_video_selesai ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-slate-300 dark:border-slate-600'} text-slate-800 dark:text-white px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors font-sans text-sm rounded-sm`}
              placeholder="https://drive.google.com/file/d/..."
            />
            <p className="text-[9px] font-mono text-slate-500 mt-2">Pastikan video memiliki akses publik 'Anyone with the link'.</p>
            {errors.tautan_video_selesai && <p className="text-[9px] text-red-500 mt-1 font-mono uppercase">{errors.tautan_video_selesai}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
              Metode Penanganan Akhir
            </label>
            <div className="relative">
              <select
                value={data.metode}
                onChange={(e) => setData('metode', e.target.value)}
                required
                className={`w-full bg-white dark:bg-cighra-dark/50 border ${!data.metode ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-300 dark:border-slate-600'} text-slate-800 dark:text-white p-3.5 focus:outline-none focus:border-cighra-primary dark:border-cighra-gold transition-colors font-tactical font-bold text-base tracking-widest appearance-none pr-10 uppercase`}
              >
                <option value="" disabled>--- PILIH METODE PENANGANAN ---</option>
                <option value="Offline">PENANGANAN LANGSUNG (OFFLINE)</option>
                <option value="Online">PENANGANAN JARAK JAUH (ONLINE)</option>
              </select>
              <ChevronRight className="absolute right-4 top-4 w-5 h-5 text-slate-500 rotate-90 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 text-white font-tactical font-bold py-3.5 px-6 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {processing ? (
              <span className="flex items-center gap-2"><span className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full" /> MENGIRIM...</span>
            ) : (
              <><CheckCircle2 className="w-5 h-5" /> Selesaikan Laporan</>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default CompletionForm;
