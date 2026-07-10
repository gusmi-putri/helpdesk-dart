import { createPortal } from 'react-dom';
import React from 'react';
import { Camera, FileText, Link as LinkIcon, ImageIcon } from 'lucide-react';

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewingProof: { report: any; type: 'rusak' | 'selesai' } | null;
}

const ProofModal: React.FC<ProofModalProps> = ({ isOpen, onClose, viewingProof }) => {
  if (!isOpen || !viewingProof) return null;

  const { report, type } = viewingProof;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-2xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center shrink-0">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2">
            <Camera className="w-5 h-5" /> LAMPIRAN BUKTI {type === 'rusak' ? 'KENDALA' : 'HASIL PERBAIKAN'}
          </h3>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-cighra-primary dark:hover:text-cighra-gold transition-colors font-bold text-xl">✕</button>
        </div>
        <div className="p-6 text-gunmetal dark:text-slate-300 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
          <div className="space-y-4">
            {type === 'rusak' && (
              <div className="space-y-4">
                {/* Tautan Video */}
                {report.kerusakan.tautan_video && (
                  <div className="bg-slate-100 dark:bg-cighra-darkcard/40 p-4 border border-slate-200 dark:border-slate-700/50">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest font-bold mb-2">Tautan Video G-Drive:</p>
                    <a href={report.kerusakan.tautan_video} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-400 underline break-all font-mono inline-block">
                      {report.kerusakan.tautan_video}
                    </a>
                  </div>
                )}

                {/* Foto Bukti */}
                {(report.kerusakan.foto_bukti || (report.kerusakan.fileBukti && report.kerusakan.fileBukti.length > 0)) && (
                  <div className="bg-slate-100 dark:bg-cighra-darkcard/40 p-4 border border-slate-200 dark:border-slate-700/50 space-y-3">
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest font-bold">DOKUMENTASI KENDALA (DARI PELAPOR):</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.kerusakan.foto_bukti && (
                        <div className="border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden bg-black/40 flex items-center justify-center h-48">
                          <img src={report.kerusakan.foto_bukti} alt="Foto Kendala" className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                      {report.kerusakan.fileBukti?.map((foto: string, index: number) => (
                        <div key={index} className="border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden bg-black/40 flex items-center justify-center h-48">
                          <img src={foto} alt={`Foto Kendala ${index + 1}`} className="max-w-full max-h-full object-contain" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {type === 'selesai' && (
              <div className="bg-slate-100 dark:bg-cighra-darkcard/40 p-4 border border-slate-200 dark:border-slate-700/50 space-y-3">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest font-bold">DOKUMENTASI HASIL PERBAIKAN:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.perbaikan.foto_bukti_selesai && (
                    <div className="border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden bg-black/40 flex items-center justify-center h-48">
                      <img src={report.perbaikan.foto_bukti_selesai} alt="Foto Selesai" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                  {report.perbaikan.video_bukti_selesai && (
                    <div className="border border-slate-300 dark:border-slate-700 rounded-sm overflow-hidden bg-black/40 flex items-center justify-center h-48">
                      <video src={report.perbaikan.video_bukti_selesai} controls className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gunmetal dark:bg-cighra-darkcard text-white px-8 py-2 font-tactical font-bold tracking-widest hover:bg-slate-600 transition-colors border border-slate-400 dark:border-slate-600 uppercase"
            >
              Tutup Lampiran
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
};

export default ProofModal;

