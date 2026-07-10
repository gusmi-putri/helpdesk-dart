import React, { useState } from 'react';
import { ShieldAlert, XCircle } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`TOLAK LAPORAN: ${caseId}`}
      icon={<XCircle />}
      maxWidth="md"
      headerColor="danger"
      footer={
        <div className="w-full flex gap-3">
          <Button
            type="submit"
            form="rejectReportForm"
            variant="danger"
            disabled={!reason.trim()}
            className="flex-[2] uppercase"
          >
            TOLAK LAPORAN
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 uppercase"
          >
            BATALKAN
          </Button>
        </div>
      }
    >
      <form id="rejectReportForm" onSubmit={handleSubmit}>
        <div className="p-2 space-y-4">
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
      </form>
    </BaseModal>
  );
};

export default ReportRejectModal;

