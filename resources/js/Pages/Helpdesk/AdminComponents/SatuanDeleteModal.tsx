import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useStore } from '@/store/useStore';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-cighra-darkcard w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-red-500/30">
        
        <div className="bg-red-50 dark:bg-red-900/20 p-6 border-b border-red-100 dark:border-red-900/30 flex items-start gap-4">
          <div className="p-3 bg-red-100 dark:bg-red-500/20 rounded-full text-red-600 dark:text-red-400 shrink-0 mt-1">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-tactical font-bold text-red-700 dark:text-red-400 uppercase tracking-widest leading-tight">
              {isPengajuan ? 'Pengajuan Hapus' : 'Konfirmasi Hapus'}
            </h3>
            <p className="text-sm text-red-600/80 dark:text-red-300/80 mt-2 font-medium">
              {isPengajuan 
                ? 'Pengajuan ini akan dikirim ke Admin untuk disetujui sebelum SATUAN dihapus secara permanen.' 
                : 'Tindakan ini akan menghapus SATUAN secara permanen dari sistem.'}
            </p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-cighra-darkcard text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">SATUAN yang akan dihapus:</p>
          <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="font-bold text-lg text-slate-800 dark:text-white">{satuan.nama_satuan}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            onClick={onClose}
            disabled={processing}
            className="px-5 py-2.5 text-sm font-tactical tracking-wider text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" /> BATAL
          </button>
          <button
            onClick={handleDelete}
            disabled={processing}
            className="px-5 py-2.5 text-sm font-tactical tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-500/20 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {processing ? 'MEMPROSES...' : isPengajuan ? (
              <>
                <Trash2 className="w-4 h-4" /> AJUKAN PENGHAPUSAN
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" /> YA, HAPUS
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SatuanDeleteModal;

