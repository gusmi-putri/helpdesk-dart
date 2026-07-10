import React, { useState } from 'react';
import { Trash2, Upload, X, FileText, AlertTriangle } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface RequestDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, document: File | null) => void;
  unit: any;
  processing: boolean;
}

const RequestDeleteModal: React.FC<RequestDeleteModalProps> = ({ isOpen, onClose, onSubmit, unit, processing }) => {
  const [reason, setReason] = useState('');
  const [document, setDocument] = useState<File | null>(null);

  if (!isOpen || !unit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reason, document);
    setReason('');
    setDocument(null);
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
      title="PENGAJUAN PENGHAPUSAN UNIT"
      icon={<Trash2 />}
      maxWidth="lg"
      headerColor="danger"
    >
      <form onSubmit={handleSubmit} className="p-2 space-y-4">
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 p-4 rounded-sm">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-800 dark:text-red-300">
                Anda mengajukan penghapusan unit:
              </p>
              <p className="text-xs font-mono text-red-700 dark:text-red-400 mt-1">
                [{unit.nomor_seri}]— {unit.asal_satuan}
              </p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                Pengajuan ini akan dikirim ke Admin untuk persetujuan. Unit tidak akan langsung dihapus.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Alasan Penghapusan *</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} required
            className="w-full bg-white dark:bg-cighra-darkcard border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm font-mono focus:border-red-500 outline-none text-slate-800 dark:text-white resize-none" placeholder="Jelaskan alasan penghapusan unit ini..." />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold text-slate-600 dark:text-slate-300 mb-1 uppercase">Surat Pendukung (PDF/JPG/PNG)</label>
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
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" className="hidden" onChange={(e) => e.target.files?.[0] && setDocument(e.target.files[0])} />
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
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
            variant="danger"
            disabled={processing || !reason.trim()}
            className="flex-1"
          >
            {processing ? 'MENGIRIM...' : 'AJUKAN PENGHAPUSAN'}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};

export default RequestDeleteModal;

