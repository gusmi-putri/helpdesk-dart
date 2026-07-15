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

        {/* SECTION: Dokumentasi Penyelesaian */}
        <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-700/60">
          <h4 className="text-[20px] font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase">
            DOKUMENTASI PENYELESAIAN
          </h4>

          {/* Upload Area */}
          <div className="flex flex-col space-y-2">
            <div 
              className={`border-2 border-dashed ${errors.foto_selesai ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-cighra-primary/40 dark:border-slate-600 bg-white dark:bg-cighra-darkcard/30'} p-6 text-center hover:border-cighra-primary dark:hover:border-cighra-gold hover:bg-slate-50 dark:hover:bg-cighra-darkcard/50 transition-all group cursor-pointer relative flex flex-col justify-center items-center h-[160px] rounded-sm focus-within:ring-2 focus-within:ring-cighra-primary dark:focus-within:ring-cighra-gold`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  if (e.target.files) {
                    const files = Array.from(e.target.files);
                    setData('foto_selesai', [...data.foto_selesai, ...files]);
                    
                    const newPreviews = files.map(file => URL.createObjectURL(file));
                    setImagePreviews([...imagePreviews, ...newPreviews]);
                  }
                }}
              />
              <div className="flex flex-col items-center justify-center gap-2">
                <Activity className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-cighra-primary dark:group-hover:text-cighra-gold transition-colors" />
                <span className="text-[16px] font-mono text-cighra-primary dark:text-cighra-gold group-hover:text-cighra-primary/90 dark:group-hover:text-cighra-gold/90 uppercase font-bold tracking-wider">
                  Unggah Foto Bukti Perbaikan
                </span>
                <span className="text-[13px] font-mono text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 uppercase">
                  Klik untuk memilih beberapa foto
                </span>
                <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase mt-1">
                  JPG • PNG • WEBP • MAKSIMAL 5 MB / FILE • MAKSIMAL 5 FOTO
                </span>
              </div>
            </div>
            {errors.foto_selesai && <p className="text-[11px] text-cighra-primary dark:text-cighra-gold mt-1 font-mono uppercase">{errors.foto_selesai}</p>}
          </div>

          {/* File Preview */}
          <div className="space-y-3">
            <label className="block text-[13px] font-mono font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
              Daftar Foto Bukti ({data.foto_selesai.length}/5)
            </label>
            {data.foto_selesai.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {data.foto_selesai.map((file: File, index: number) => {
                  const preview = imagePreviews[index];
                  const fileSizeString = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
                  return (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-cighra-darkcard border border-slate-200 dark:border-slate-700/80 rounded-sm hover:border-cighra-primary/50 dark:hover:border-cighra-gold/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {preview ? (
                          <div className="w-[56px] h-[56px] border border-slate-300 dark:border-slate-600 overflow-hidden shrink-0 bg-black">
                            <img src={preview} alt={file.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-[56px] h-[56px] border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 shrink-0">
                            <Activity className="w-4 h-4" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-[15px] font-mono font-bold text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md uppercase" title={file.name}>
                            ✓ {file.name}
                          </span>
                          <span className="text-[13px] font-mono text-slate-500 dark:text-slate-400">
                            {fileSizeString}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          if (imagePreviews[index]) {
                            URL.revokeObjectURL(imagePreviews[index]);
                          }
                          const updatedFiles = data.foto_selesai.filter((_: File, i: number) => i !== index);
                          const updatedPreviews = imagePreviews.filter((_: string, i: number) => i !== index);
                          setData('foto_selesai', updatedFiles);
                          setImagePreviews(updatedPreviews);
                        }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-500/40 rounded-sm transition-all text-xs font-mono font-bold uppercase cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 border border-dashed border-slate-300 dark:border-slate-700 text-center font-mono text-[13px] text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-800/10 rounded-sm">
                Belum ada foto yang dipilih.
              </div>
            )}
          </div>

          {/* Google Drive Video Upload */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[13px] font-mono font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                TAUTAN VIDEO GOOGLE DRIVE <span className="text-cighra-primary dark:text-cighra-gold">*</span>
              </label>
              {processing && (
                <div className="inline-flex items-center gap-1.5 text-xs text-cighra-primary dark:text-cighra-gold font-mono font-bold uppercase">
                  <span className="w-3.5 h-3.5 animate-spin border border-current border-t-transparent rounded-full" /> Uploading...
                </div>
              )}
            </div>
            <input
              type="url"
              value={data.tautan_video_selesai || ''}
              onChange={(e) => setData('tautan_video_selesai', e.target.value)}
              required
              className={`w-full h-[48px] bg-white dark:bg-cighra-darkcard/80 border ${errors.tautan_video_selesai ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'border-slate-300 dark:border-slate-600'} text-slate-800 dark:text-white px-4 focus:outline-none focus:border-cighra-primary dark:focus:border-cighra-gold transition-colors font-sans text-sm rounded-sm`}
              placeholder="https://drive.google.com/file/d/..."
            />
            <p className="text-[13px] font-mono text-slate-500 dark:text-slate-400 uppercase">
              Video wajib memiliki akses publik "Anyone with the link"
            </p>
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

