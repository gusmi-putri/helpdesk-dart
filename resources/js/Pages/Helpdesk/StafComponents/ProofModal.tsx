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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-sand dark:bg-gunmetal border-2 border-olive w-full max-w-2xl shadow-2xl animate-in zoom-in-95">
        <div className="p-4 border-b border-olive bg-olive/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-olive tracking-widest uppercase flex items-center gap-2">
            <Camera className="w-5 h-5" /> LAMPIRAN BUKTI KENDALA
          </h3>
          <button onClick={onClose} className="text-soft-gunmetal/60 hover:text-targetred transition-colors font-bold text-xl">✕</button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {viewingProof.map((url, i) => (
              <div key={i} className="border border-soft-gunmetal/20 dark:border-soft-sand/10 rounded-sm overflow-hidden bg-black/60 flex items-center justify-center h-48">
                <img src={url} alt={`Bukti ${i}`} className="max-w-full max-h-full object-contain" />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gunmetal dark:bg-black text-sand px-8 py-2 font-tactical font-bold tracking-widest hover:bg-soft-gunmetal transition-colors border border-soft-gunmetal/30 uppercase"
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
