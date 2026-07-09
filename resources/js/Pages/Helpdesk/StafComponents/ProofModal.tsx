import React from 'react';
import { Camera } from 'lucide-react';

interface ProofModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewingProof: any[] | null;
}

const ProofModal: React.FC<ProofModalProps> = ({ isOpen, onClose, viewingProof }) => {
  if (!isOpen || !viewingProof) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-2xl shadow-2xl animate-in zoom-in-95">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2">
            <Camera className="w-5 h-5" /> LAMPIRAN BUKTI KENDALA
          </h3>
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-cighra-primary dark:hover:text-cighra-gold transition-colors font-bold text-xl">✕</button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {viewingProof.map((url, i) => {
              const isVideo = ['.mp4', '.mov', '.avi', '.webm'].some(ext => url.toLowerCase().includes(ext));
              return (
                <div key={i} className="border border-slate-300 dark:border-slate-600 rounded-sm overflow-hidden bg-black/60 flex items-center justify-center h-48">
                  {isVideo ? (
                    <video src={url} controls className="max-w-full max-h-full object-contain" />
                  ) : (
                    <img src={url} alt={`Bukti ${i}`} className="max-w-full max-h-full object-contain" />
                  )}
                </div>
              );
            })}
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
};

export default ProofModal;

