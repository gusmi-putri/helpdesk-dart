import React from 'react';
import { UserX } from 'lucide-react';
import { Modal } from '@/Components/ui/Modal';
import { Button } from '@/Components/ui/Button';

interface RejectConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  actionType?: 'add' | 'register' | 'edit' | 'delete' | null;
}

const RejectConfirmModal: React.FC<RejectConfirmModalProps> = ({ isOpen, onClose, onConfirm, userName, actionType = 'register' }) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="KONFIRMASI PENOLAKAN AKSES"
      icon={<UserX />}
      maxWidth="lg"
      footer={
        <div className="flex gap-4 w-full">
          <Button variant="danger" onClick={onConfirm} className="flex-[2] uppercase" size="lg">
            <UserX className="w-5 h-5" /> YA, TOLAK AKSES
          </Button>
          <Button variant="secondary" onClick={onClose} className="flex-1 uppercase" size="lg">
            BATAL
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <h4 className="text-xl font-tactical font-bold text-slate-800 dark:text-white tracking-[0.2em] uppercase">
          {actionType === 'edit' && 'TOLAK PERUBAHAN DATA?'}
          {actionType === 'delete' && 'TOLAK PENGHAPUSAN PERSONIL?'}
          {(actionType === 'register' || actionType === 'add' || !actionType) && 'TOLAK PENDAFTARAN PERSONIL?'}
        </h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-mono leading-relaxed uppercase tracking-wider">
          {actionType === 'edit' && (
            <>PENGAJUAN PERUBAHAN DATA ATAS NAMA <strong className="text-red-500 font-bold underline decoration-2 underline-offset-4">{userName}</strong> AKAN DITOLAK. DATA SEBELUMNYA AKAN TETAP DIGUNAKAN.</>
          )}
          {actionType === 'delete' && (
            <>PENGAJUAN PENGHAPUSAN ATAS NAMA <strong className="text-red-500 font-bold underline decoration-2 underline-offset-4">{userName}</strong> AKAN DITOLAK. PERSONIL TETAP AKTIF DI DALAM SISTEM.</>
          )}
          {(actionType === 'register' || actionType === 'add' || !actionType) && (
            <>PENDAFTARAN ATAS NAMA <strong className="text-red-500 font-bold underline decoration-2 underline-offset-4">{userName}</strong> AKAN DITOLAK DAN DIHAPUS SECARA PERMANEN DARI LOG SISTEM.</>
          )}
        </p>
      </div>
    </Modal>
  );
};

export default RejectConfirmModal;

