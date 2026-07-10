import React, { useState } from 'react';
import { Trash2, Upload, X, FileText, AlertTriangle } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

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
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title="PENGAJUAN PENGHAPUSAN MASSAL"
      icon={<Trash2 />}
      maxWidth="lg"
      headerColor="danger"
      footer={
        <div className="w-full flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1"
          >
            BATAL
          </Button>
          <Button
            type="submit"
            form="deleteBatchForm"
            variant="danger"
            disabled={processing || !reason.trim() || !document}
            className="flex-1"
          >
            {processing ? 'MENGIRIM...' : 'AJUKAN PENGHAPUSAN'}
          </Button>
        </div>
      }
    >
      <div className="overflow-y-auto custom-scrollbar p-2 space-y-4 flex-1 min-h-0">
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
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Pengajuan ini akan dikirim kepada Admin untuk persetujuan. Unit tidak akan langsung dihapus. 1 Surat akan berlaku sebagai dasar penghapusan unit-unit ini.
              </p>
            </div>
          </div>
        </div>

        <form id="deleteBatchForm" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Alasan Penghapusan *</label>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required
              className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-red-500 outline-none text-slate-800 dark:text-white resize-none" placeholder="Jelaskan alasan penghapusan massal ini..." />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Surat Pendukung (PDF/JPG/PNG) *</label>
            <div className="relative">
              {document ? (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 px-3 py-2 rounded-sm">
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-mono text-green-700 dark:text-green-400 flex-1 min-h-0 truncate">{document.name}</span>
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
    </BaseModal>
  );
};

export default RequestDeleteBatchModal;

