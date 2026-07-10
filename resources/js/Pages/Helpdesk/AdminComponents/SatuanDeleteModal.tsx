import React, { useState } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useStore } from '@/store/useStore';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface SatuanDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  satuan: any;
  onSuccess?: () => void;
  isPengajuan?: boolean;
}

const SatuanDeleteModal: React.FC<SatuanDeleteModalProps> = ({
  isOpen,
  onClose,
  satuan,
  onSuccess,
  isPengajuan
}) => {
  const [processing, setProcessing] = useState(false);
  const addNotification = useStore(state => state.addNotification);

  if (!isOpen || !satuan) return null;

  const handleDelete = () => {
    setProcessing(true);
    router.delete(`/satuans/${satuan.id}`, {
      onSuccess: () => {
        setProcessing(false);
        addNotification('SATUAN berhasil dihapus/diajukan hapus.');
        if (onSuccess) onSuccess();
        onClose();
      },
      onError: () => {
        setProcessing(false);
        addNotification('Gagal memproses permintaan hapus.', 'error');
      }
    });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={isPengajuan ? 'AJUKAN PENGHAPUSAN' : 'KONFIRMASI PENGHAPUSAN'}
      icon={<AlertTriangle />}
      maxWidth="lg"
      headerColor="danger"
      footer={
        <div className="flex gap-4 w-full">
          <Button 
            variant="danger" 
            onClick={handleDelete} 
            disabled={processing}
            className="flex-[2] uppercase" 
            size="lg"
          >
            <Trash2 className="w-5 h-5" />
            {processing ? 'MEMPROSES...' : isPengajuan ? 'AJUKAN HAPUS' : 'HAPUS PERMANEN'}
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose} 
            disabled={processing}
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
            ? <>SISTEM MENDETEKSI PERMINTAAN PENGHAPUSAN SATUAN: <span className="text-red-500 font-bold underline decoration-2 underline-offset-4">{satuan.nama_satuan}</span>. DATA AKAN DIARSIPKAN JIKA ADMIN MENYETUJUI.</>
            : <>PERINGATAN TINGKAT TINGGI: ANDA AKAN MENGHAPUS DATA SATUAN <span className="text-red-500 font-bold underline decoration-2 underline-offset-4">{satuan.nama_satuan}</span> SECARA PERMANEN DARI SISTEM OPERASIONAL DART.</>}
        </p>
      </div>
    </BaseModal>
  );
};

export default SatuanDeleteModal;

