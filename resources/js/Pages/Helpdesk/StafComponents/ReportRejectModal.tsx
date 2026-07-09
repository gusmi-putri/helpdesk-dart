import React, { useState } from 'react';
import { ShieldAlert, XCircle } from 'lucide-react';

interface ReportRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  caseId: string;
}

const ReportRejectModal: React.FC<ReportRejectModalProps> = ({ isOpen, onClose, onConfirm, caseId }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason);
    setReason('');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-cighra-primary dark:border-cighra-gold w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-cighra-primary dark:border-cighra-gold bg-cighra-primary/10 dark:bg-cighra-gold/10 flex justify-between items-center">
          <h3 className="font-tactical font-bold text-cighra-primary dark:text-cighra-gold tracking-widest uppercase flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" /> TOLAK LAPORAN: {caseId}
          </h3>
          <button onClick={onClose} className="text-slate-600 hover:text-cighra-primary dark:text-cighra-gold transition-colors font-bold text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            <h4 className="text-center text-sm font-tactical font-bold text-slate-800 dark:text-white tracking-widest uppercase mb-2">
              ALASAN PENOLAKAN LAPORAN
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono text-center uppercase">
              Berikan penjelasan atau feedback kepada Satkai mengapa laporan ini ditolak.
            </p>

            <div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={4}
                className="w-full bg-white dark:bg-cighra-darkcard/80 border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white p-3 focus:outline-none focus:border-red-500 transition-colors font-mono text-xs uppercase"
                placeholder="CONTOH: PERSYARATAN DOKUMEN LAPORAN BELUM LENGKAP ATAU FOTO BUKTI TIDAK VALID..."
              />
            </div>
          </div>

          <div className="p-6 grid grid-cols-2 gap-3 bg-black/5 dark:bg-cighra-darkcard/80">
            <button
              type="submit"
              disabled={!reason.trim()}
              className="bg-red-600 hover:bg-red-500 text-white py-3 font-tactical font-bold tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg uppercase disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> TOLAK LAPORAN
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-transparent border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-300 py-3 font-tactical font-bold tracking-widest hover:bg-slate-600/10 dark:hover:bg-soft-sand/5 transition-all uppercase"
            >
              BATALKAN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportRejectModal;

