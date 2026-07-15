import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { BaseModal } from '@/Components/ui/BaseModal';
import { Button } from '@/Components/ui/Button';

interface UnitDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  unit: any;
  isPengajuan?: boolean;
}

const UnitDeleteModal: React.FC<UnitDeleteModalProps> = ({ isOpen, onClose, onConfirm, unit, isPengajuan }) => {
  if (!isOpen || !unit) return null;

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
        <div className="p-4 bg-cighra-primary/5 dark:bg-cighra-darkcard border border-cighra-primary/20 dark:border-slate-800 text-sm font-mono font-bold text-slate-800 dark:text-slate-300 leading-relaxed uppercase tracking-wider">
          {isPengajuan
            ? <>SISTEM MENDETEKSI PERMINTAAN PENGHAPUSAN UNIT DART NO. SERI <span className="text-red-500 font-bold underline decoration-2 underline-offset-4">{unit.nomor_seri}</span>. UNIT INI AKAN DIHAPUS DARI DAFTAR JIKA ADMIN MENYETUJUI.</>
            : <>PERINGATAN TINGKAT TINGGI: ANDA AKAN MENGHAPUS DATA UNIT DART NO. SERI <span className="text-red-500 font-bold underline decoration-2 underline-offset-4">{unit.nomor_seri}</span> SECARA PERMANEN DARI SISTEM OPERASIONAL.</>}
        </div>
      </div>
    </BaseModal>
  );
};

export default UnitDeleteModal;
