import React from 'react';
import { FileText, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';

interface CompletionFormProps {
  data: any;
  setData: (key: string, value: any) => void;
  errors: any;
  processing: boolean;
  handleSubmit: (e: React.FormEvent) => void;
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
      <h3 className="text-gunmetal dark:text-white font-tactical font-bold text-lg mb-6 flex items-center gap-2 tracking-widest uppercase border-b border-olive/20 pb-2">
        <FileText className="w-5 h-5 text-olive" />
        FORMULIR LAPORAN PENYELESAIAN
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-soft-gunmetal dark:text-soft-sand text-xs font-mono font-bold mb-2 tracking-widest uppercase">
            Catatan Perbaikan & Tindakan yang Diambil
          </label>
          <textarea
            value={data.catatan}
            onChange={(e) => setData('catatan', e.target.value)}
            required rows={5}
            className={`w-full bg-sand/30 dark:bg-black/20 border ${errors.catatan ? 'border-targetred' : 'border-soft-gunmetal/20 dark:border-soft-sand/10'} text-gunmetal dark:text-white p-4 focus:outline-none focus:border-olive transition-colors font-sans text-sm resize-y`}
            placeholder="Jelaskan tindakan perbaikan yang telah dilakukan secara detail..."
          />
          {errors.catatan && <p className="text-[9px] text-targetred mt-1 font-mono uppercase">{errors.catatan}</p>}
        </div>

        <div className="border-2 border-dashed border-soft-gunmetal/20 dark:border-soft-sand/10 p-4 text-center hover:border-olive transition-all group cursor-pointer relative bg-sand/20 dark:bg-black/10">
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
                  <Activity className="w-5 h-5 text-soft-gunmetal/40 group-hover:text-olive transition-colors" />
                  <span className="text-xs font-mono text-soft-gunmetal/60 dark:text-soft-sand/40 group-hover:text-olive uppercase font-bold">
                    UNGGAH FOTO BUKTI SELESAI
                  </span>
                </div>
                <span className="text-[9px] font-mono text-soft-gunmetal/40 dark:text-soft-sand/20 uppercase">Klik atau tarik file ke area ini</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
          <div>
            <label className="block text-soft-gunmetal dark:text-soft-sand text-xs font-mono font-bold mb-2 tracking-widest uppercase">
              Metode Penanganan Akhir
            </label>
            <div className="relative">
              <select
                value={data.metode}
                onChange={(e) => setData('metode', e.target.value)}
                required
                className={`w-full bg-sand/30 dark:bg-gunmetal/50 border ${!data.metode ? 'border-targetred' : 'border-soft-gunmetal/20 dark:border-soft-sand/10'} text-gunmetal dark:text-white p-3.5 focus:outline-none focus:border-olive transition-colors font-tactical font-bold text-base tracking-widest appearance-none pr-10 uppercase`}
              >
                <option value="" disabled>--- PILIH METODE PENANGANAN ---</option>
                <option value="Offline">PENANGANAN LANGSUNG (OFFLINE)</option>
                <option value="Online">PENANGANAN JARAK JAUH (ONLINE)</option>
              </select>
              <ChevronRight className="absolute right-4 top-4 w-5 h-5 text-soft-gunmetal/40 rotate-90 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-olive hover:bg-camogreen text-sand font-tactical font-bold py-3.5 px-6 rounded-sm transition-all duration-300 uppercase tracking-widest flex justify-center items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {processing ? (
              <span className="flex items-center gap-2"><span className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full" /> MENGIRIM...</span>
            ) : (
              <><CheckCircle2 className="w-5 h-5" /> Kirim Laporan Selesai</>
            )}
          </button>
        </div>
      </form>
    </>
  );
};

export default CompletionForm;
