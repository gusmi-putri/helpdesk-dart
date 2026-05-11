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
      <div className="bg-slate-50 dark:bg-gunmetal border-2 border-targetred w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-targetred bg-red-900/20 flex items-center gap-3">
          <AlertTriangle className="text-targetred w-6 h-6" />
          <h3 className="font-tactical font-bold text-targetred tracking-widest uppercase">KONFIRMASI PENGHAPUSAN UNIT</h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-mono">
            APAKAH ANDA YAKIN INGIN MENGHAPUS UNIT <span className="text-targetred font-bold underline">[{unit?.nomor_seri}]</span> DARI SISTEM? TINDAKAN INI TIDAK DAPAT DIBATALKAN.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-targetred text-white py-3 font-tactical font-bold tracking-widest hover:bg-red-700 transition-colors"
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
