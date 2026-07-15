import React from 'react';
import { FileText, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';

interface CompletionFormProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
  processing: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  imagePreviews: string[];
  setImagePreviews: (srcs: string[]) => void;
}

const CompletionForm: React.FC<CompletionFormProps> = ({
  data,
  setData,
  errors,
  processing,
  handleSubmit,
  imagePreviews,
  setImagePreviews
}) => {
  return (
    <>
      <h3 className="text-slate-800 dark:text-white font-tactical font-bold text-lg mb-6 flex items-center gap-2 tracking-widest uppercase border-b border-cighra-primary dark:border-cighra-gold/20 pb-2">
        <FileText className="w-5 h-5 text-cighra-primary dark:text-cighra-gold" />
        FORMULIR LAPORAN PENYELESAIAN
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BLOCK 1: Catatan */}
        <div>
          <label className="block text-slate-600 dark:text-slate-300 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
            Catatan Perbaikan & Tindakan yang Diambil
          </label>
          <textarea
            value={data.catatan}
            onChange={(e) => setData('catatan', e.target.value)}
            required
            className={`w-full h-[140px] bg-white dark:bg-cighra-darkcard/80 border ${errors.catatan ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-300 dark:border-slate-600'} text-slate-800 dark:text-white p-4 focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold transition-colors font-sans text-sm resize-none`}
            placeholder="JELASKAN DETAIL TINDAKAN PERBAIKAN DAN SOLUSI TEKNIS YANG TELAH DILAKUKAN..."
          />
          {errors.catatan && <p className="text-[11px] text-cighra-primary dark:text-cighra-gold mt-1 font-mono uppercase">{errors.catatan}</p>}
        </div>

        {/* BLOCK 2: Upload Bukti & Google Drive (Grid 2 Kolom) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Photo Upload (Required) */}
          <div className="flex flex-col">
            <label className="block text-slate-600 dark:text-slate-300 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
              Dokumentasi Foto Hasil Perbaikan <span className="text-cighra-primary dark:text-cighra-gold">*</span>
            </label>
            <div className={`border-2 border-dashed ${errors.foto_selesai ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-300 dark:border-slate-600 bg-cighra-light dark:bg-cighra-darkcard/10'} p-4 text-center hover:border-cighra-primary dark:hover:border-cighra-gold transition-all group cursor-pointer relative flex flex-col justify-center min-h-[100px]`}>
              <input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);
                    setData('foto_selesai', [...data.foto_selesai, ...files]);
                    
                    const newPreviews: string[] = [];
                    let loaded = 0;
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        newPreviews.push(reader.result as string);
                        loaded++;
                        if (loaded === files.length) {
                          setImagePreviews([...imagePreviews, ...newPreviews]);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-500 group-hover:text-cighra-primary dark:group-hover:text-cighra-gold transition-colors" />
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-300 group-hover:text-cighra-primary dark:group-hover:text-cighra-gold uppercase font-bold">
                    UNGGAH FOTO SELESAI
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Klik untuk pilih beberapa foto</span>
              </div>
            </div>
            {errors.foto_selesai && <p className="text-[11px] text-cighra-primary dark:text-cighra-gold mt-1 font-mono uppercase">{errors.foto_selesai}</p>}

            {/* Thumbnail previews of uploaded files */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3 bg-slate-50 dark:bg-slate-800/20 p-2 border border-slate-200 dark:border-slate-700/60 rounded-sm">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-square border border-slate-300 dark:border-slate-600 rounded-sm overflow-hidden group">
                    <img src={preview} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedFiles = data.foto_selesai.filter((_: File, i: number) => i !== index);
                        const updatedPreviews = imagePreviews.filter((_: string, i: number) => i !== index);
                        setData('foto_selesai', updatedFiles);
                        setImagePreviews(updatedPreviews);
                      }}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white hover:text-red-400 cursor-pointer text-[10px] font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Video Upload (Required Link) */}
          <div className="flex flex-col">
            <label className="block text-slate-600 dark:text-slate-300 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
              Tautan Video G-Drive (WAJIB) <span className="text-cighra-primary dark:text-cighra-gold">*</span>
            </label>
            <input
              type="url"
              value={data.tautan_video_selesai || ''}
              onChange={(e) => setData('tautan_video_selesai', e.target.value)}
              required
              className={`w-full h-[48px] bg-white dark:bg-cighra-darkcard/80 border ${errors.tautan_video_selesai ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-slate-300 dark:border-slate-600'} text-slate-800 dark:text-white px-4 focus:outline-none focus:border-blue-500 transition-colors font-sans text-sm rounded-sm`}
              placeholder="https://drive.google.com/file/d/..."
            />
            <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">Akses video harus diset ke publik 'Anyone with the link'.</p>
            {errors.tautan_video_selesai && <p className="text-[11px] text-red-500 mt-1 font-mono uppercase">{errors.tautan_video_selesai}</p>}
          </div>
        </div>

        {/* BLOCK 3: Metode Penanganan */}
        <div>
          <label className="block text-slate-600 dark:text-slate-300 text-xs font-mono font-bold mb-2 tracking-widest uppercase">
            Metode Penanganan Akhir
          </label>
          <div className="relative">
            <select
              value={data.metode}
              onChange={(e) => setData('metode', e.target.value)}
              required
              className={`w-full h-[48px] bg-white dark:bg-cighra-dark/50 border ${!data.metode ? 'border-cighra-primary dark:border-cighra-gold' : 'border-slate-300 dark:border-slate-600'} text-slate-800 dark:text-white px-4 focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold transition-colors font-tactical font-bold text-xs tracking-widest appearance-none pr-10 uppercase`}
            >
              <option value="" disabled>--- PILIH METODE PENANGANAN ---</option>
              <option value="Offline">PENANGANAN LANGSUNG (OFFLINE)</option>
              <option value="Online">PENANGANAN JARAK JAUH (ONLINE)</option>
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
          </div>
        </div>

        {/* BLOCK 4: Submit Button (Dominan & Full-Width) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={processing}
            className="w-full h-[52px] bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 hover:bg-cighra-primary/95 dark:hover:bg-cighra-gold/90 text-white font-tactical font-semibold px-6 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {processing ? (
              <span className="flex items-center gap-2"><span className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full" /> MENGIRIM...</span>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Selesaikan Laporan</>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default CompletionForm;

