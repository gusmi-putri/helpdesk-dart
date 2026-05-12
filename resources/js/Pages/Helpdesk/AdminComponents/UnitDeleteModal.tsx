import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface UnitDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  unit: any;
}

const UnitDeleteModal: React.FC<UnitDeleteModalProps> = ({ isOpen, onClose, onConfirm, unit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-red-900/20 flex items-center gap-3">
          <AlertTriangle className="text-cighra-primary dark:text-cighra-gold w-6 h-6" />
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase">KONFIRMASI PENGHAPUSAN UNIT</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-mono">
            APAKAH ANDA YAKIN INGIN MENGHAPUS UNIT <span className="text-cighra-primary dark:text-cighra-gold font-bold underline">[{unit?.nomor_seri}]</span> DARI SISTEM? TINDAKAN INI TIDAK DAPAT DIBATALKAN.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-cighra-primary dark:bg-cighra-gold dark:text-slate-900 text-white py-3 font-tactical font-bold tracking-widest hover:bg-cighra-primary/90 dark:hover:bg-cighra-gold/90 transition-colors"
            >
              YA, HAPUS UNIT
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 py-3 font-tactical font-bold tracking-widest hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              BATAL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDeleteModal;
