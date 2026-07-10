import React from 'react';
import { UserMinus, Trash2 } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: any;
  isPengajuan?: boolean;
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = ({ isOpen, onClose, onConfirm, user, isPengajuan }) => {
  if (!isOpen || !user) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isPengajuan ? 'AJUKAN PENGHAPUSAN' : 'KONFIRMASI PENGHAPUSAN'}
      icon={<UserMinus />}
      maxWidth="lg"
      headerColor="danger"
      footer={
        <div className="flex gap-4 w-full">
          <Button 
            variant="danger" 
            onClick={onConfirm} 
            className="flex-[2] uppercase" 
            size="lg"
          >
            <Trash2 className="w-5 h-5" />
            {isPengajuan ? 'AJUKAN HAPUS' : 'HAPUS PERMANEN'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose} 
            className="flex-1 uppercase" 
            size="lg"
          >
            BATAL
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm font-mono text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-wider">
          {isPengajuan
            ? <>SISTEM MENDETEKSI PERMINTAAN PENGHAPUSAN AKUN PERSONEL: <span className="text-red-500 font-bold underline decoration-2 underline-offset-4">{user.name}</span>. DATA AKAN DIARSIPKAN JIKA ADMIN MENYETUJUI.</>
            : <>PERINGATAN TINGKAT TINGGI: ANDA AKAN MENGHAPUS DATA PERSONEL <span className="text-red-500 font-bold underline decoration-2 underline-offset-4">{user.name}</span> SECARA PERMANEN DARI SISTEM OPERASIONAL DART.</>}
        </p>
      </div>
    </BaseModal>
  );
};

export default UserDeleteModal;
