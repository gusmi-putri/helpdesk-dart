import React, { useState } from 'react';
import { Trash2, Upload, X, FileText, AlertTriangle } from 'lucide-react';

interface RequestDeleteBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, document: File) => void;
  selectedUnits: any[];
  processing: boolean;
}

const RequestDeleteBatchModal: React.FC<RequestDeleteBatchModalProps> = ({ isOpen, onClose, onSubmit, selectedUnits, processing }) => {
  const [reason, setReason] = useState('');
  const [document, setDocument] = useState<File | null>(null);

  if (!isOpen || selectedUnits.length === 0) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;
    
    onSubmit(reason, document);
  };

  const handleClose = () => {
    setReason('');
    setDocument(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-cighra-light dark:bg-cighra-dark border-2 border-red-600 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-red-600 bg-red-900/10 flex justify-between items-center shrink-0">
          <h3 className="font-tactical font-bold text-red-600 dark:text-red-400 tracking-widest uppercase flex items-center gap-2">
            <Trash2 size={18} /> PENGAJUAN PENGHAPUSAN MASSAL
          </h3>
          <button onClick={handleClose} className="text-slate-500 hover:text-red-600 text-xl">✕</button>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-6 space-y-4 flex-1">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 p-4 rounded-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-800 dark:text-red-300">
                  Anda mengajukan penghapusan untuk {selectedUnits.length} unit:
                </p>
                <div className="max-h-24 overflow-y-auto custom-scrollbar mt-2 border border-red-200 dark:border-red-800/40 divide-y divide-red-200 dark:divide-red-800/40">
                  {selectedUnits.map((u, i) => (
                    <div key={u.db_id} className="text-xs font-mono text-red-700 dark:text-red-400 bg-white/50 dark:bg-black/20 p-1.5 flex gap-2">
                       <span className="font-bold w-4">{i + 1}.</span> 
                       <span>[{u.nomor_seri}]</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-red-600 dark:text-red-400 mt-2">
                  Pengajuan ini akan dikirim ke Admin untuk persetujuan. Unit tidak akan langsung dihapus. 1 Surat akan berlaku sebagai dasar penghapusan unit-unit ini.
                </p>
              </div>
            </div>
          </div>

          <form id="deleteBatchForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Alasan Penghapusan *</label>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required
                className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-red-500 outline-none text-slate-800 dark:text-white resize-none" placeholder="Jelaskan alasan penghapusan massal ini..." />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Surat Pendukung (PDF/JPG/PNG) *</label>
              <div className="relative">
                {document ? (
                  <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 px-3 py-2 rounded-sm">
                    <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-mono text-green-700 dark:text-green-400 flex-1 truncate">{document.name}</span>
                    <button type="button" onClick={() => setDocument(null)} className="text-red-500 hover:text-red-700">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 bg-slate-50 dark:bg-cighra-darkcard border border-dashed border-slate-300 dark:border-slate-600 px-3 py-3 cursor-pointer hover:border-red-500 transition-colors rounded-sm">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-mono text-slate-500">Pilih file surat pendukung...</span>
                    <input type="file" accept=".pdf,.png,.jpg,.jpeg" required className="hidden" onChange={(e) => e.target.files?.[0] && setDocument(e.target.files[0])} />
                  </label>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-cighra-dark/50 shrink-0">
          <div className="flex gap-3">
            <button type="button" onClick={handleClose}
              className="flex-1 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-tactical text-xs tracking-widest hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              BATAL
            </button>
            <button type="submit" form="deleteBatchForm" disabled={processing || !reason.trim() || !document}
              className="flex-1 py-2.5 bg-red-600 text-white font-tactical font-bold text-xs tracking-widest hover:bg-red-700 transition-all disabled:opacity-50">
              {processing ? 'MENGIRIM...' : 'AJUKAN PENGHAPUSAN'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RequestDeleteBatchModal;

